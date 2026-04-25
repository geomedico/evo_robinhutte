require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

// ==================== CONFIG ====================
const app = express();
const PORT = process.env.PORT || 8001;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'evo_database';
const JWT_SECRET = process.env.JWT_SECRET || 'evo-secret-key-2026';

// MongoDB client
let db;
const client = new MongoClient(MONGO_URL);

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== CONSTANTS ====================
const PRICING_RULES = {
  '4h': { all: { member: 80, external: 120 } },
  '12h': {
    weekday: { member: 120, external: 180 },
    weekend: { member: 150, external: 270 }
  },
  '24h': {
    weekday: { member: 150, external: 230 },
    weekend: { member: 200, external: 350 }
  }
};

const CLEANING_PRICE = 60;
const DEPOSIT = 250;
const BUFFER_HOURS = 1.5;
const MAX_ADVANCE_MONTHS = 3;

const SWISS_HOLIDAYS_2026 = [
  '2026-01-01', '2026-01-02', '2026-04-03', '2026-04-06',
  '2026-05-01', '2026-05-14', '2026-05-25', '2026-08-01',
  '2026-12-25', '2026-12-26'
];

// ==================== HELPER FUNCTIONS ====================

// Check if date is weekend (Fri-Sun) or holiday
function isWeekendOrHoliday(dateStr) {
  const date = new Date(dateStr);
  const dayOfWeek = date.getDay(); // 0=Sunday, 6=Saturday
  // Weekend = Friday(5), Saturday(6), Sunday(0)
  if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
    return true;
  }
  return SWISS_HOLIDAYS_2026.includes(dateStr);
}

// Calculate booking price
function calculatePrice(timeBlock, bookingDate, isMember, cleaning) {
  const isWeekend = isWeekendOrHoliday(bookingDate);
  let base;

  if (timeBlock === '4h') {
    base = PRICING_RULES['4h'].all;
  } else if (timeBlock === '12h') {
    base = isWeekend ? PRICING_RULES['12h'].weekend : PRICING_RULES['12h'].weekday;
  } else { // 24h
    base = isWeekend ? PRICING_RULES['24h'].weekend : PRICING_RULES['24h'].weekday;
  }

  const rental = isMember ? base.member : base.external;
  const cleaningCost = cleaning ? CLEANING_PRICE : 0;

  return {
    rental_price: rental,
    cleaning_price: cleaningCost,
    total: rental + cleaningCost,
    deposit: DEPOSIT,
    is_weekend: isWeekend
  };
}

// Get hours for time block
function getHoursForBlock(timeBlock) {
  if (timeBlock === '4h') return 4;
  if (timeBlock === '12h') return 12;
  return 24;
}

// Add hours to time string
function addHours(dateStr, timeStr, hours) {
  const [year, month, day] = dateStr.split('-');
  const [hour, minute] = timeStr.split(':');
  const date = new Date(year, month - 1, day, hour, minute);
  date.setHours(date.getHours() + hours);
  return date;
}

// Format time as HH:MM
function formatTime(date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// Check booking date validity
function checkBookingDateValid(bookingDate) {
  const booking = new Date(bookingDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + MAX_ADVANCE_MONTHS);

  if (booking < tomorrow) {
    return { valid: false, message: 'Buchungen sind erst ab morgen möglich' };
  }
  if (booking > maxDate) {
    return { valid: false, message: `Buchungen sind maximal ${MAX_ADVANCE_MONTHS} Monate im Voraus möglich` };
  }
  return { valid: true };
}

// Check availability
async function checkAvailability(bookingDate, startTime, timeBlock) {
  // Check date validity
  const dateCheck = checkBookingDateValid(bookingDate);
  if (!dateCheck.valid) {
    return { available: false, message: dateCheck.message };
  }

  // NEW: Block 4h time blocks on weekends (Friday-Sunday)
  if (timeBlock === '4h') {
    const date = new Date(bookingDate);
    const dayOfWeek = date.getDay(); // 0=Sunday, 5=Friday, 6=Saturday
    
    // Check if it's Friday (5), Saturday (6), or Sunday (0)
    if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
      return { 
        available: false, 
        message: '4-Stunden-Buchungen sind nur von Montag bis Donnerstag möglich. Bitte wählen Sie 12h oder 24h für Wochenenden.' 
      };
    }
  }

  // Get existing bookings
  const existingBookings = await db.collection('bookings').find({
    booking_date: bookingDate,
    status: { $nin: ['cancelled'] }
  }).toArray();

  // Calculate requested booking times
  const reqStart = addHours(bookingDate, startTime, 0);
  const hours = getHoursForBlock(timeBlock);
  const reqEnd = addHours(bookingDate, startTime, hours);
  const reqBufferEnd = addHours(bookingDate, startTime, hours + BUFFER_HOURS);

  // Check for conflicts
  for (const booking of existingBookings) {
    const exStart = addHours(booking.booking_date, booking.start_time, 0);
    const exHours = getHoursForBlock(booking.time_block);
    const exEnd = addHours(booking.booking_date, booking.start_time, exHours);
    const exBufferEnd = addHours(booking.booking_date, booking.start_time, exHours + BUFFER_HOURS);

    // Check overlap (including buffer)
    if (reqStart < exBufferEnd && reqBufferEnd > exStart) {
      return { available: false, message: `Konflikt mit bestehender Buchung um ${booking.start_time}` };
    }
  }

  return { available: true };
}

// Generate reference number
async function generateReferenceNumber() {
  const count = await db.collection('bookings').countDocuments({}) + 1;
  const year = new Date().getFullYear();
  return `RH-${year}-${String(count).padStart(4, '0')}`;
}

// Calculate end time
function calculateEndTime(bookingDate, startTime, timeBlock) {
  const hours = getHoursForBlock(timeBlock);
  const endDate = addHours(bookingDate, startTime, hours);
  return formatTime(endDate);
}

// JWT verification middleware
function authenticateToken(req, res, next) {
  const token = req.query.token || req.body.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Nicht autorisiert' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.user_id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Ungültiges Token' });
  }
}

// Get current user from token
async function getCurrentUser(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.user_id) });
    if (user) {
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        is_member: user.is_member || false,
        is_admin: user.is_admin || false,
        phone: user.phone,
        address: user.address
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Admin authentication middleware
async function requireAdmin(req, res, next) {
  const token = req.query.token || req.body.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Nicht autorisiert' });
  }
  const user = await getCurrentUser(token);
  if (!user || !user.is_admin) {
    return res.status(403).json({ error: 'Admin-Berechtigung erforderlich' });
  }
  req.adminUser = user;
  next();
}

// Seed admin user on startup
async function seedAdmin() {
  const adminEmail = 'admin@elternvereinigung.ch';
  const existing = await db.collection('users').findOne({ email: adminEmail });
  if (!existing) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.collection('users').insertOne({
      name: 'EVO Admin',
      email: adminEmail,
      password: hashedPassword,
      is_member: true,
      is_admin: true,
      created_at: new Date().toISOString()
    });
    console.log('✅ Admin user seeded:', adminEmail);
  } else if (!existing.is_admin) {
    // Promote existing user to admin if needed
    await db.collection('users').updateOne(
      { email: adminEmail },
      { $set: { is_admin: true } }
    );
    console.log('✅ Admin role applied to existing user:', adminEmail);
  }
}

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', [
  body('email').isEmail().withMessage('Ungültige E-Mail'),
  body('password').isLength({ min: 6 }).withMessage('Passwort muss mindestens 6 Zeichen haben'),
  body('name').notEmpty().withMessage('Name ist erforderlich'),
  body('adresse').notEmpty().withMessage('Adresse ist erforderlich'),
  body('postleitzahl').notEmpty().withMessage('Postleitzahl ist erforderlich'),
  body('ort').notEmpty().withMessage('Ort ist erforderlich'),
  body('mobil').notEmpty().withMessage('Mobilnummer ist erforderlich')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  try {
    const { 
      name, email, password, phone, 
      adresse, postleitzahl, ort, mobil,
      nameKind1, geburtsdatumKind1,
      nameKind2, geburtsdatumKind2,
      nameKind3, geburtsdatumKind3
    } = req.body;

    // Check if email exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'E-Mail bereits registriert' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with family information
    const userDoc = {
      name,
      email,
      password: hashedPassword,
      phone: phone || mobil, // Use mobil as primary phone
      mobil: mobil,
      adresse: adresse,
      postleitzahl: postleitzahl,
      ort: ort,
      address: `${adresse}, ${postleitzahl} ${ort}`, // Combined address for compatibility
      // Children information (optional)
      nameKind1: nameKind1 || null,
      geburtsdatumKind1: geburtsdatumKind1 || null,
      nameKind2: nameKind2 || null,
      geburtsdatumKind2: geburtsdatumKind2 || null,
      nameKind3: nameKind3 || null,
      geburtsdatumKind3: geburtsdatumKind3 || null,
      is_member: true, // All registered users are members
      created_at: new Date().toISOString()
    };

    const result = await db.collection('users').insertOne(userDoc);
    const userId = result.insertedId.toString();

    // Generate token
    const token = jwt.sign({ user_id: userId }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Registrierung erfolgreich',
      token,
      user: { id: userId, name, email, is_member: true }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// Login
app.post('/api/auth/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Ungültige Eingaben' });
  }

  try {
    const { email, password } = req.body;

    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    const token = jwt.sign({ user_id: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        is_member: user.is_member || false,
        is_admin: user.is_admin || false
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// Get current user
app.get('/api/auth/me', async (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(401).json({ error: 'Token erforderlich' });
  }

  const user = await getCurrentUser(token);
  if (!user) {
    return res.status(401).json({ error: 'Nicht autorisiert' });
  }

  res.json(user);
});

// ==================== BOOKING ROUTES ====================

// Get availability for month
app.get('/api/bookings/availability/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    
    let endDate;
    if (parseInt(month) === 12) {
      endDate = `${parseInt(year) + 1}-01-01`;
    } else {
      endDate = `${year}-${String(parseInt(month) + 1).padStart(2, '0')}-01`;
    }

    const bookings = await db.collection('bookings').find({
      booking_date: { $gte: startDate, $lt: endDate },
      status: { $nin: ['cancelled'] }
    }, {
      projection: { booking_date: 1, start_time: 1, time_block: 1, event_type: 1, _id: 0 }
    }).toArray();

    res.json({ bookings });
  } catch (error) {
    console.error('Availability error:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// Seed bookings
app.post('/api/bookings/seed', async (req, res) => {
  try {
    // Clear existing seed bookings
    await db.collection('bookings').deleteMany({ is_seed: true });

    const today = new Date();
    const busyOffsets = [3, 5, 7, 10, 12, 14, 17, 19, 21, 24, 28];
    const eventTypes = ['Geburtstag', 'Familienfeier', 'Vereinsanlass', 'Firmenanlass'];
    const startTimes = ['10:00', '14:00', '18:00'];
    
    const seedBookings = busyOffsets.map((offset, i) => {
      const bookingDate = new Date(today);
      bookingDate.setDate(bookingDate.getDate() + offset);
      const dateStr = bookingDate.toISOString().split('T')[0];
      
      const timeBlock = offset % 3 === 0 ? '24h' : '4h';
      const startTime = timeBlock === '24h' ? '09:00' : startTimes[i % 3];
      const hasCleaning = i % 2 === 0;
      const basePrice = timeBlock === '24h' ? 150 : 80;
      const endHour = timeBlock === '24h' ? '09' : String(parseInt(startTime.split(':')[0]) + 4).padStart(2, '0');

      return {
        reference_number: `SEED-${String(offset).padStart(4, '0')}`,
        user_id: 'seed_user',
        user_name: 'Demo User',
        user_email: 'demo@example.ch',
        booking_date: dateStr,
        start_time: startTime,
        end_time: `${endHour}:00`,
        time_block: timeBlock,
        event_type: eventTypes[i % eventTypes.length],
        expected_guests: 20 + (i * 5) % 30,
        cleaning_addon: hasCleaning,
        special_requests: null,
        rental_price: basePrice,
        cleaning_price: hasCleaning ? 60 : 0,
        total_price: basePrice + (hasCleaning ? 60 : 0),
        deposit: 250,
        is_member: true,
        status: 'confirmed',
        payment_status: 'paid',
        is_seed: true,
        created_at: new Date().toISOString()
      };
    });

    if (seedBookings.length > 0) {
      await db.collection('bookings').insertMany(seedBookings);
    }

    res.json({
      message: `${seedBookings.length} Demo-Buchungen erstellt`,
      dates: seedBookings.map(b => b.booking_date)
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// Check price
app.post('/api/bookings/check-price', async (req, res) => {
  try {
    const { booking_date, time_block, cleaning = false, token } = req.body;
    
    let isMember = false;
    if (token) {
      const user = await getCurrentUser(token);
      isMember = user?.is_member || false;
    }

    const price = calculatePrice(time_block, booking_date, isMember, cleaning);
    res.json(price);
  } catch (error) {
    console.error('Check price error:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// Check both prices
app.post('/api/bookings/check-prices', async (req, res) => {
  try {
    const { booking_date, time_block, cleaning = false, token } = req.body;
    
    // Check if user is logged in
    let isLoggedIn = false;
    if (token) {
      const user = await getCurrentUser(token);
      isLoggedIn = user !== null;
    }
    
    const externalPrice = calculatePrice(time_block, booking_date, false, cleaning);
    
    // Only return member price if user is logged in
    if (isLoggedIn) {
      const memberPrice = calculatePrice(time_block, booking_date, true, cleaning);
      res.json({
        member: memberPrice,
        external: externalPrice,
        showMemberPrice: true
      });
    } else {
      // Only show external price for non-logged-in users
      res.json({
        external: externalPrice,
        showMemberPrice: false
      });
    }
  } catch (error) {
    console.error('Check prices error:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// Check availability
app.post('/api/bookings/check-availability', async (req, res) => {
  try {
    const { booking_date, start_time, time_block } = req.body;
    const result = await checkAvailability(booking_date, start_time, time_block);
    res.json(result);
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// Create booking (members)
app.post('/api/bookings', async (req, res) => {
  try {
    const token = req.body.token || req.query.token;
    if (!token) {
      return res.status(401).json({ error: 'Bitte einloggen um zu buchen' });
    }

    const user = await getCurrentUser(token);
    if (!user) {
      return res.status(401).json({ error: 'Bitte einloggen um zu buchen' });
    }

    const { booking_date, time_block, start_time, event_type, expected_guests, cleaning_addon, special_requests } = req.body;

    // Check availability
    const availCheck = await checkAvailability(booking_date, start_time, time_block);
    if (!availCheck.available) {
      return res.status(400).json({ error: availCheck.message });
    }

    // Calculate price
    const isMember = user.is_member || false;
    const price = calculatePrice(time_block, booking_date, isMember, cleaning_addon);
    
    // Create booking
    const bookingDoc = {
      reference_number: await generateReferenceNumber(),
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      booking_date,
      start_time,
      end_time: calculateEndTime(booking_date, start_time, time_block),
      time_block,
      event_type,
      expected_guests,
      cleaning_addon: cleaning_addon || false,
      special_requests: special_requests || null,
      rental_price: price.rental_price,
      cleaning_price: price.cleaning_price,
      total_price: price.total,
      deposit: DEPOSIT,
      is_member: isMember,
      status: 'confirmed',
      payment_status: 'pending',
      created_at: new Date().toISOString()
    };

    const result = await db.collection('bookings').insertOne(bookingDoc);
    bookingDoc.id = result.insertedId.toString();
    delete bookingDoc._id;

    res.json({
      message: 'Buchung erfolgreich',
      booking: bookingDoc
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// Create external booking
app.post('/api/bookings/external', [
  body('email').isEmail(),
  body('name').notEmpty(),
  body('phone').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  try {
    const { booking_date, time_block, start_time, event_type, expected_guests, cleaning_addon, special_requests, name, email, phone } = req.body;

    // Check availability
    const availCheck = await checkAvailability(booking_date, start_time, time_block);
    if (!availCheck.available) {
      return res.status(400).json({ error: availCheck.message });
    }

    // Calculate price for external users
    const price = calculatePrice(time_block, booking_date, false, cleaning_addon);
    
    // Create booking
    const bookingDoc = {
      reference_number: await generateReferenceNumber(),
      user_id: 'external',
      user_name: name,
      user_email: email,
      user_phone: phone,
      booking_date,
      start_time,
      end_time: calculateEndTime(booking_date, start_time, time_block),
      time_block,
      event_type,
      expected_guests,
      cleaning_addon: cleaning_addon || false,
      special_requests: special_requests || null,
      rental_price: price.rental_price,
      cleaning_price: price.cleaning_price,
      total_price: price.total,
      deposit: DEPOSIT,
      is_member: false,
      is_external: true,
      status: 'pending',
      payment_status: 'pending',
      created_at: new Date().toISOString()
    };

    const result = await db.collection('bookings').insertOne(bookingDoc);
    bookingDoc.id = result.insertedId.toString();
    delete bookingDoc._id;

    res.json({
      message: 'Anfrage gesendet! Wir melden uns zur Bestätigung.',
      booking: bookingDoc
    });
  } catch (error) {
    console.error('Create external booking error:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// Get my bookings
app.get('/api/bookings/my', async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.status(401).json({ error: 'Nicht autorisiert' });
    }

    const user = await getCurrentUser(token);
    if (!user) {
      return res.status(401).json({ error: 'Nicht autorisiert' });
    }

    const bookings = await db.collection('bookings')
      .find({ user_id: user.id })
      .sort({ booking_date: -1 })
      .toArray();

    // Convert _id to id
    const formattedBookings = bookings.map(b => ({
      ...b,
      id: b._id.toString(),
      _id: undefined
    }));

    res.json({ bookings: formattedBookings });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// ==================== CONTENT ROUTES ====================

// Get board members
app.get('/api/board-members', async (req, res) => {
  try {
    let members = await db.collection('board_members')
      .find({ is_active: true })
      .sort({ sort_order: 1 })
      .toArray();

    if (members.length === 0) {
      // Seed default data
      const defaultMembers = [
        { name: 'Dominique Knöpfli', role: 'Präsidentin', email: 'dominique.knoepfli@elternvereinigung.ch', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80', sort_order: 1, is_active: true },
        { name: 'Mélanie Bosshardt', role: 'Vorstand', email: 'melanie.bosshardt@elternvereinigung.ch', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80', sort_order: 2, is_active: true },
        { name: 'Mirjam Spörri', role: 'Vorstand', email: 'mirjam.spoerri@elternvereinigung.ch', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80', sort_order: 3, is_active: true }
      ];
      await db.collection('board_members').insertMany(defaultMembers);
      members = defaultMembers;
    }

    const formattedMembers = members.map(m => ({
      ...m,
      id: m._id?.toString(),
      _id: undefined
    }));

    res.json({ members: formattedMembers });
  } catch (error) {
    console.error('Board members error:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// Get events
app.get('/api/events', async (req, res) => {
  try {
    const upcoming = req.query.upcoming !== 'false';
    const limit = parseInt(req.query.limit) || 10;
    const today = new Date().toISOString().split('T')[0];

    const query = upcoming ? { date: { $gte: today } } : {};
    let events = await db.collection('events')
      .find(query)
      .sort({ date: 1 })
      .limit(limit)
      .toArray();

    if (events.length === 0 && upcoming) {
      // Seed default events
      const defaultEvents = [
        { title: 'Kinderclub Nachmittag', date: '2026-02-15', time: '14:00 - 17:00', location: 'Robihütte', category: 'Kinderclub', description: 'Basteln und Spielen für Kinder' },
        { title: 'Familien-Spielabend', date: '2026-02-22', time: '18:00 - 21:00', location: 'Gemeindesaal', category: 'Familienanlass', description: 'Gemeinsamer Spieleabend für die ganze Familie' },
        { title: 'Frühlingsmarkt', date: '2026-03-08', time: '10:00 - 16:00', location: 'Dorfplatz Oberglatt', category: 'Familienanlass', description: 'Frühlingsmarkt mit Aktivitäten für Gross und Klein' }
      ];
      await db.collection('events').insertMany(defaultEvents);
      events = defaultEvents;
    }

    const formattedEvents = events.map(e => ({
      ...e,
      id: e._id?.toString(),
      _id: undefined
    }));

    res.json({ events: formattedEvents });
  } catch (error) {
    console.error('Events error:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// Get blog posts
app.get('/api/blog', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    let posts = await db.collection('blog_posts')
      .find()
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray();

    if (posts.length === 0) {
      // Seed default posts
      const defaultPosts = [
        { title: 'Rückblick: Weihnachtsfeier 2025', content: 'Eine wunderbare Weihnachtsfeier mit über 50 Familien...', image_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&q=80', category: 'Anlässe', created_at: '2025-12-20' },
        { title: 'Neuer Spielplatz bei der Robihütte', content: 'Wir freuen uns, den neuen Spielplatz einzuweihen...', image_url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80', category: 'Robihütte', created_at: '2025-11-15' }
      ];
      await db.collection('blog_posts').insertMany(defaultPosts);
      posts = defaultPosts;
    }

    const formattedPosts = posts.map(p => ({
      ...p,
      id: p._id?.toString(),
      _id: undefined
    }));

    res.json({ posts: formattedPosts });
  } catch (error) {
    console.error('Blog error:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// Get pricing
app.get('/api/pricing', async (req, res) => {
  try {
    // Check if user is logged in via token
    const token = req.query.token;
    let showMemberPrice = false;
    
    if (token) {
      const user = await getCurrentUser(token);
      showMemberPrice = user !== null;
    }
    
    // Base pricing data
    const pricingData = [
      { label: '4 Stunden', time_block: '4h', day_label: 'Mo–Do', member_price: 80, external_price: 120, time_note: 'Flexible Startzeit (nur Montag-Donnerstag)' },
      { label: '12 Stunden', time_block: '12h', day_label: 'Mo–Do', member_price: 120, external_price: 180, time_note: 'Flexible Startzeit' },
      { label: '12 Stunden', time_block: '12h', day_label: 'Fr–So + Feiertage', member_price: 150, external_price: 270, time_note: 'Flexible Startzeit' },
      { label: '24 Stunden', time_block: '24h', day_label: 'Mo–Do', member_price: 150, external_price: 230, time_note: '09:00 – 09:00 nächster Tag' },
      { label: '24 Stunden', time_block: '24h', day_label: 'Fr–So + Feiertage', member_price: 200, external_price: 350, time_note: '09:00 – 09:00 nächster Tag' }
    ];
    
    // If not logged in, remove member prices
    const pricing = showMemberPrice ? pricingData : pricingData.map(p => ({
      ...p,
      member_price: undefined
    }));
    
    res.json({
      pricing,
      showMemberPrice,
      cleaning: { price: CLEANING_PRICE, label: 'Optionale Reinigung' },
      deposit: { amount: DEPOSIT, note: 'Bar bei Schlüsselübergabe' },
      buffer: { hours: BUFFER_HOURS, note: 'Pufferzeit zwischen Buchungen' },
      max_advance_months: MAX_ADVANCE_MONTHS
    });
  } catch (error) {
    console.error('Pricing error:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// ==================== ADMIN ROUTES ====================

// List all bookings (admin) — with optional status filter
app.get('/api/admin/bookings', requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const bookings = await db.collection('bookings')
      .find(query)
      .sort({ created_at: -1 })
      .toArray();

    const formatted = bookings.map(b => ({
      ...b,
      id: b._id.toString(),
      _id: undefined
    }));

    res.json({ bookings: formatted, count: formatted.length });
  } catch (error) {
    console.error('Admin list bookings error:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// Get admin stats
app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    const [pending, confirmed, rejected, total] = await Promise.all([
      db.collection('bookings').countDocuments({ status: 'pending' }),
      db.collection('bookings').countDocuments({ status: 'confirmed' }),
      db.collection('bookings').countDocuments({ status: 'rejected' }),
      db.collection('bookings').countDocuments({})
    ]);
    res.json({ pending, confirmed, rejected, total });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// Approve booking
app.post('/api/admin/bookings/:id/approve', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Ungültige Buchungs-ID' });
    }

    const result = await db.collection('bookings').findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: 'confirmed',
          approved_at: new Date().toISOString(),
          approved_by: req.adminUser.email
        }
      },
      { returnDocument: 'after' }
    );

    const booking = result.value || result;
    if (!booking) {
      return res.status(404).json({ error: 'Buchung nicht gefunden' });
    }

    res.json({
      message: 'Buchung bestätigt',
      booking: { ...booking, id: booking._id.toString(), _id: undefined }
    });
  } catch (error) {
    console.error('Approve booking error:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// Reject booking
app.post('/api/admin/bookings/:id/reject', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Ungültige Buchungs-ID' });
    }

    const result = await db.collection('bookings').findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: 'rejected',
          rejected_at: new Date().toISOString(),
          rejected_by: req.adminUser.email,
          rejection_reason: reason || null
        }
      },
      { returnDocument: 'after' }
    );

    const booking = result.value || result;
    if (!booking) {
      return res.status(404).json({ error: 'Buchung nicht gefunden' });
    }

    res.json({
      message: 'Buchung abgelehnt',
      booking: { ...booking, id: booking._id.toString(), _id: undefined }
    });
  } catch (error) {
    console.error('Reject booking error:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// ==================== CONTACT ROUTES ====================

// Contact form
app.post('/api/contact', [
  body('email').isEmail(),
  body('name').notEmpty(),
  body('subject').notEmpty(),
  body('message').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  try {
    const { name, email, subject, message } = req.body;
    
    await db.collection('contact_messages').insertOne({
      name,
      email,
      subject,
      message,
      created_at: new Date().toISOString(),
      status: 'new'
    });

    res.json({ message: 'Nachricht gesendet. Wir melden uns bald!' });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// Newsletter subscription
app.post('/api/newsletter', [
  body('email').isEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Ungültige E-Mail' });
  }

  try {
    const { email } = req.body;
    
    const existing = await db.collection('newsletter').findOne({ email });
    if (existing) {
      return res.json({ message: 'Bereits angemeldet' });
    }

    await db.collection('newsletter').insertOne({
      email,
      subscribed_at: new Date().toISOString()
    });

    res.json({ message: 'Erfolgreich angemeldet!' });
  } catch (error) {
    console.error('Newsletter error:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/', (req, res) => {
  res.json({ status: 'ok', message: 'EVO API läuft' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// ==================== START SERVER ====================

async function startServer() {
  try {
    // Connect to MongoDB
    await client.connect();
    db = client.db(DB_NAME);
    console.log('✅ Connected to MongoDB');

    // Seed admin user
    await seedAdmin();

    // Start Express server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 EVO Backend (Node.js) running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down gracefully...');
  await client.close();
  process.exit(0);
});

startServer();
