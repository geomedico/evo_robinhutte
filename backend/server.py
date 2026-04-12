from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date, time, timedelta
from bson import ObjectId
import os
import jwt
import bcrypt
from pymongo import MongoClient

# MongoDB setup
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "evo_database")
client = MongoClient(MONGO_URL)
db = client[DB_NAME]

# JWT Secret
JWT_SECRET = os.environ.get("JWT_SECRET", "evo-secret-key-2026")

app = FastAPI(title="EVO Elternvereinigung Oberglatt API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== MODELS ====================

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    address: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class BookingCreate(BaseModel):
    booking_date: str  # YYYY-MM-DD
    time_block: str  # "4h" or "24h"
    start_time: str  # HH:MM
    event_type: str
    expected_guests: int
    cleaning_addon: bool = False
    special_requests: Optional[str] = None

class ExternalBookingCreate(BaseModel):
    booking_date: str  # YYYY-MM-DD
    time_block: str  # "4h" or "24h"
    start_time: str  # HH:MM
    event_type: str
    expected_guests: int
    cleaning_addon: bool = False
    special_requests: Optional[str] = None
    # External user contact info
    name: str
    email: EmailStr
    phone: str

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class EventCreate(BaseModel):
    title: str
    date: str
    time: str
    location: str
    description: Optional[str] = None
    category: str

class BlogPostCreate(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None
    category: str

# ==================== HELPERS ====================

def serialize_doc(doc):
    """Convert MongoDB document to JSON-serializable dict"""
    if doc is None:
        return None
    doc["id"] = str(doc.pop("_id"))
    return doc

def serialize_docs(docs):
    return [serialize_doc(doc) for doc in docs]

def get_current_user(token: str):
    """Decode JWT and return user"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.users.find_one({"_id": ObjectId(payload["user_id"])})
        if user:
            return serialize_doc(user)
        return None
    except:
        return None

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

# ==================== PRICING LOGIC ====================

PRICING_RULES = {
    "4h": {"all": {"member": 80, "external": 120}},
    "12h": {
        "weekday": {"member": 120, "external": 180},
        "weekend": {"member": 150, "external": 270},
    },
    "24h": {
        "weekday": {"member": 150, "external": 230},
        "weekend": {"member": 200, "external": 350},
    }
}
CLEANING_PRICE = 60
DEPOSIT = 250
BUFFER_HOURS = 1.5
MAX_ADVANCE_MONTHS = 3  # Maximum booking 3 months in advance

# Swiss public holidays (Zurich Canton) - approximate dates for validation
SWISS_HOLIDAYS_2026 = [
    "2026-01-01",  # Neujahr
    "2026-01-02",  # Berchtoldstag
    "2026-04-03",  # Karfreitag
    "2026-04-06",  # Ostermontag
    "2026-05-01",  # Tag der Arbeit
    "2026-05-14",  # Auffahrt
    "2026-05-25",  # Pfingstmontag
    "2026-08-01",  # Nationalfeiertag
    "2026-12-25",  # Weihnachten
    "2026-12-26",  # Stephanstag
]

def is_weekend_or_holiday(booking_date: str) -> bool:
    """Check if date is weekend (Fr-So) or public holiday"""
    dt = datetime.strptime(booking_date, "%Y-%m-%d")
    day_of_week = dt.weekday()  # 0=Monday, 6=Sunday
    # Weekend = Friday(4), Saturday(5), Sunday(6)
    if day_of_week >= 4:
        return True
    # Check holidays
    if booking_date in SWISS_HOLIDAYS_2026:
        return True
    return False

def calculate_price(time_block: str, booking_date: str, is_member: bool, cleaning: bool):
    """Calculate booking price based on rules"""
    is_weekend = is_weekend_or_holiday(booking_date)
    
    if time_block == "4h":
        base = PRICING_RULES["4h"]["all"]
    elif time_block == "12h":
        base = PRICING_RULES["12h"]["weekend"] if is_weekend else PRICING_RULES["12h"]["weekday"]
    else:  # 24h
        base = PRICING_RULES["24h"]["weekend"] if is_weekend else PRICING_RULES["24h"]["weekday"]
    
    rental = base["member"] if is_member else base["external"]
    cleaning_cost = CLEANING_PRICE if cleaning else 0
    
    return {
        "rental_price": rental,
        "cleaning_price": cleaning_cost,
        "total": rental + cleaning_cost,
        "deposit": DEPOSIT,
        "is_weekend": is_weekend
    }

def get_hours_for_block(time_block: str) -> int:
    """Get duration in hours for a time block"""
    if time_block == "4h":
        return 4
    elif time_block == "12h":
        return 12
    else:  # 24h
        return 24

def check_booking_date_valid(booking_date: str) -> tuple:
    """Check if booking date is valid (tomorrow to 3 months ahead)"""
    booking_dt = datetime.strptime(booking_date, "%Y-%m-%d")
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    tomorrow = today + timedelta(days=1)
    max_date = today + timedelta(days=MAX_ADVANCE_MONTHS * 30)  # ~3 months
    
    if booking_dt < tomorrow:
        return False, "Buchungen sind erst ab morgen möglich"
    if booking_dt > max_date:
        return False, f"Buchungen sind maximal {MAX_ADVANCE_MONTHS} Monate im Voraus möglich"
    return True, None

def check_availability(booking_date: str, start_time: str, time_block: str):
    """Check if time slot is available"""
    # First check if date is valid
    valid, message = check_booking_date_valid(booking_date)
    if not valid:
        return False, message
    
    existing = list(db.bookings.find({
        "booking_date": booking_date,
        "status": {"$nin": ["cancelled"]}
    }))
    
    # Parse requested times
    req_start = datetime.strptime(f"{booking_date} {start_time}", "%Y-%m-%d %H:%M")
    hours = get_hours_for_block(time_block)
    req_end = req_start + timedelta(hours=hours)
    req_buffer_end = req_end + timedelta(hours=BUFFER_HOURS)
    
    for booking in existing:
        # Parse existing booking times
        ex_start = datetime.strptime(f"{booking['booking_date']} {booking['start_time']}", "%Y-%m-%d %H:%M")
        ex_hours = get_hours_for_block(booking['time_block'])
        ex_end = ex_start + timedelta(hours=ex_hours)
        ex_buffer_end = ex_end + timedelta(hours=BUFFER_HOURS)
        
        # Check overlap (including buffer)
        if req_start < ex_buffer_end and req_buffer_end > ex_start:
            return False, f"Konflikt mit bestehender Buchung um {booking['start_time']}"
    
    return True, None

# ==================== AUTH ENDPOINTS ====================

@app.post("/api/auth/register")
async def register(user: UserRegister):
    # Check if email exists
    if db.users.find_one({"email": user.email}):
        raise HTTPException(400, "E-Mail bereits registriert")
    
    # Create user
    user_doc = {
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password),
        "phone": user.phone,
        "address": user.address,
        "is_member": True,  # All registered users are members
        "created_at": datetime.utcnow().isoformat()
    }
    result = db.users.insert_one(user_doc)
    
    # Generate token
    token = jwt.encode({"user_id": str(result.inserted_id)}, JWT_SECRET, algorithm="HS256")
    
    return {
        "message": "Registrierung erfolgreich",
        "token": token,
        "user": {"id": str(result.inserted_id), "name": user.name, "email": user.email, "is_member": True}
    }

@app.post("/api/auth/login")
async def login(credentials: UserLogin):
    user = db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(401, "Ungültige Anmeldedaten")
    
    token = jwt.encode({"user_id": str(user["_id"])}, JWT_SECRET, algorithm="HS256")
    
    return {
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "is_member": user.get("is_member", False)
        }
    }

@app.get("/api/auth/me")
async def get_me(token: str):
    user = get_current_user(token)
    if not user:
        raise HTTPException(401, "Nicht autorisiert")
    user.pop("password", None)
    return user

# ==================== BOOKING ENDPOINTS ====================

@app.get("/api/bookings/availability/{year}/{month}")
async def get_availability(year: int, month: int):
    """Get booking availability for a month"""
    start = f"{year}-{month:02d}-01"
    if month == 12:
        end = f"{year+1}-01-01"
    else:
        end = f"{year}-{month+1:02d}-01"
    
    bookings = list(db.bookings.find({
        "booking_date": {"$gte": start, "$lt": end},
        "status": {"$nin": ["cancelled"]}
    }, {"_id": 0, "booking_date": 1, "start_time": 1, "time_block": 1, "event_type": 1}))
    
    return {"bookings": bookings}

@app.post("/api/bookings/seed")
async def seed_bookings():
    """Seed sample bookings for demo purposes"""
    from datetime import datetime, timedelta
    
    # Clear existing seed bookings
    db.bookings.delete_many({"is_seed": True})
    
    today = datetime.now()
    seed_bookings = []
    
    # Add some busy dates in the coming weeks
    busy_offsets = [3, 5, 7, 10, 12, 14, 17, 19, 21, 24, 28]
    event_types = ["Geburtstag", "Familienfeier", "Vereinsanlass", "Firmenanlass"]
    
    for i, offset in enumerate(busy_offsets):
        booking_date = (today + timedelta(days=offset)).strftime("%Y-%m-%d")
        time_block = "24h" if offset % 3 == 0 else "4h"
        start_time = "09:00" if time_block == "24h" else ["10:00", "14:00", "18:00"][i % 3]
        
        seed_bookings.append({
            "reference_number": f"SEED-{offset:04d}",
            "user_id": "seed_user",
            "user_name": "Demo User",
            "user_email": "demo@example.ch",
            "booking_date": booking_date,
            "start_time": start_time,
            "end_time": "09:00" if time_block == "24h" else str(int(start_time.split(":")[0]) + 4).zfill(2) + ":00",
            "time_block": time_block,
            "event_type": event_types[i % len(event_types)],
            "expected_guests": 20 + (i * 5) % 30,
            "cleaning_addon": i % 2 == 0,
            "special_requests": None,
            "rental_price": 150 if time_block == "24h" else 80,
            "cleaning_price": 60 if i % 2 == 0 else 0,
            "total_price": (150 if time_block == "24h" else 80) + (60 if i % 2 == 0 else 0),
            "deposit": 250,
            "is_member": True,
            "status": "confirmed",
            "payment_status": "paid",
            "is_seed": True,
            "created_at": datetime.utcnow().isoformat()
        })
    
    if seed_bookings:
        db.bookings.insert_many(seed_bookings)
    
    return {"message": f"{len(seed_bookings)} Demo-Buchungen erstellt", "dates": [b["booking_date"] for b in seed_bookings]}

@app.post("/api/bookings/check-price")
async def check_price(
    booking_date: str,
    time_block: str,
    cleaning: bool = False,
    token: Optional[str] = None
):
    """Calculate price for a booking"""
    is_member = False
    if token:
        user = get_current_user(token)
        is_member = user.get("is_member", False) if user else False
    
    return calculate_price(time_block, booking_date, is_member, cleaning)

@app.post("/api/bookings/check-prices")
async def check_both_prices(
    booking_date: str,
    time_block: str,
    cleaning: bool = False
):
    """Calculate both member and external prices for comparison"""
    member_price = calculate_price(time_block, booking_date, True, cleaning)
    external_price = calculate_price(time_block, booking_date, False, cleaning)
    
    return {
        "member": member_price,
        "external": external_price
    }

@app.post("/api/bookings/check-availability")
async def check_avail(booking_date: str, start_time: str, time_block: str):
    """Check if a time slot is available"""
    available, message = check_availability(booking_date, start_time, time_block)
    return {"available": available, "message": message}

@app.post("/api/bookings")
async def create_booking(booking: BookingCreate, token: str):
    """Create a new booking for registered users"""
    user = get_current_user(token)
    if not user:
        raise HTTPException(401, "Bitte einloggen um zu buchen")
    
    # Check availability
    available, message = check_availability(booking.booking_date, booking.start_time, booking.time_block)
    if not available:
        raise HTTPException(400, message)
    
    # Calculate price
    price = calculate_price(
        booking.time_block,
        booking.booking_date,
        user.get("is_member", False),
        booking.cleaning_addon
    )
    
    # Calculate end time
    start_dt = datetime.strptime(f"{booking.booking_date} {booking.start_time}", "%Y-%m-%d %H:%M")
    hours = 4 if booking.time_block == "4h" else 24
    end_dt = start_dt + timedelta(hours=hours)
    
    # Generate reference number
    count = db.bookings.count_documents({}) + 1
    ref_number = f"RH-{datetime.now().year}-{count:04d}"
    
    booking_doc = {
        "reference_number": ref_number,
        "user_id": user["id"],
        "user_name": user["name"],
        "user_email": user["email"],
        "booking_date": booking.booking_date,
        "start_time": booking.start_time,
        "end_time": end_dt.strftime("%H:%M"),
        "time_block": booking.time_block,
        "event_type": booking.event_type,
        "expected_guests": booking.expected_guests,
        "cleaning_addon": booking.cleaning_addon,
        "special_requests": booking.special_requests,
        "rental_price": price["rental_price"],
        "cleaning_price": price["cleaning_price"],
        "total_price": price["total"],
        "deposit": DEPOSIT,
        "is_member": user.get("is_member", False),
        "status": "confirmed",
        "payment_status": "pending",
        "created_at": datetime.utcnow().isoformat()
    }
    
    result = db.bookings.insert_one(booking_doc)
    booking_doc["id"] = str(result.inserted_id)
    del booking_doc["_id"]
    
    return {"message": "Buchung erfolgreich", "booking": booking_doc}

@app.post("/api/bookings/external")
async def create_external_booking(booking: ExternalBookingCreate):
    """Create a booking for external (non-registered) users"""
    
    # Check availability
    available, message = check_availability(booking.booking_date, booking.start_time, booking.time_block)
    if not available:
        raise HTTPException(400, message)
    
    # Calculate price for external users (is_member=False)
    price = calculate_price(
        booking.time_block,
        booking.booking_date,
        False,  # External users are not members
        booking.cleaning_addon
    )
    
    # Calculate end time
    start_dt = datetime.strptime(f"{booking.booking_date} {booking.start_time}", "%Y-%m-%d %H:%M")
    hours = 4 if booking.time_block == "4h" else 24
    end_dt = start_dt + timedelta(hours=hours)
    
    # Generate reference number
    count = db.bookings.count_documents({}) + 1
    ref_number = f"RH-{datetime.now().year}-{count:04d}"
    
    booking_doc = {
        "reference_number": ref_number,
        "user_id": "external",
        "user_name": booking.name,
        "user_email": booking.email,
        "user_phone": booking.phone,
        "booking_date": booking.booking_date,
        "start_time": booking.start_time,
        "end_time": end_dt.strftime("%H:%M"),
        "time_block": booking.time_block,
        "event_type": booking.event_type,
        "expected_guests": booking.expected_guests,
        "cleaning_addon": booking.cleaning_addon,
        "special_requests": booking.special_requests,
        "rental_price": price["rental_price"],
        "cleaning_price": price["cleaning_price"],
        "total_price": price["total"],
        "deposit": DEPOSIT,
        "is_member": False,
        "is_external": True,
        "status": "pending",  # External bookings need confirmation
        "payment_status": "pending",
        "created_at": datetime.utcnow().isoformat()
    }
    
    result = db.bookings.insert_one(booking_doc)
    booking_doc["id"] = str(result.inserted_id)
    del booking_doc["_id"]
    
    return {"message": "Anfrage gesendet! Wir melden uns zur Bestätigung.", "booking": booking_doc}

@app.get("/api/bookings/my")
async def get_my_bookings(token: str):
    """Get user's bookings"""
    user = get_current_user(token)
    if not user:
        raise HTTPException(401, "Nicht autorisiert")
    
    bookings = list(db.bookings.find({"user_id": user["id"]}).sort("booking_date", -1))
    return {"bookings": serialize_docs(bookings)}

# ==================== CONTENT ENDPOINTS ====================

@app.get("/api/board-members")
async def get_board_members():
    """Get all board members"""
    members = list(db.board_members.find({"is_active": True}).sort("sort_order", 1))
    if not members:
        # Seed default data
        default_members = [
            {"name": "Dominique Knöpfli", "role": "Präsidentin", "email": "dominique.knoepfli@elternvereinigung.ch", "photo": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80", "sort_order": 1, "is_active": True},
            {"name": "Mélanie Bosshardt", "role": "Vorstand", "email": "melanie.bosshardt@elternvereinigung.ch", "photo": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80", "sort_order": 2, "is_active": True},
            {"name": "Mirjam Spörri", "role": "Vorstand", "email": "mirjam.spoerri@elternvereinigung.ch", "photo": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80", "sort_order": 3, "is_active": True},
        ]
        db.board_members.insert_many(default_members)
        members = default_members
    return {"members": serialize_docs(members) if members and "_id" in members[0] else members}

@app.get("/api/events")
async def get_events(upcoming: bool = True, limit: int = 10):
    """Get events"""
    today = datetime.now().strftime("%Y-%m-%d")
    query = {"date": {"$gte": today}} if upcoming else {}
    events = list(db.events.find(query).sort("date", 1).limit(limit))
    
    if not events and upcoming:
        # Seed default events
        default_events = [
            {"title": "Kinderclub Nachmittag", "date": "2026-02-15", "time": "14:00 - 17:00", "location": "Robihütte", "category": "Kinderclub", "description": "Basteln und Spielen für Kinder"},
            {"title": "Familien-Spielabend", "date": "2026-02-22", "time": "18:00 - 21:00", "location": "Gemeindesaal", "category": "Familienanlass", "description": "Gemeinsamer Spieleabend für die ganze Familie"},
            {"title": "Frühlingsmarkt", "date": "2026-03-08", "time": "10:00 - 16:00", "location": "Dorfplatz Oberglatt", "category": "Familienanlass", "description": "Frühlingsmarkt mit Aktivitäten für Gross und Klein"},
        ]
        db.events.insert_many(default_events)
        events = default_events
    return {"events": serialize_docs(events) if events and "_id" in events[0] else events}

@app.get("/api/blog")
async def get_blog_posts(limit: int = 10):
    """Get blog posts"""
    posts = list(db.blog_posts.find().sort("created_at", -1).limit(limit))
    
    if not posts:
        # Seed default posts
        default_posts = [
            {"title": "Rückblick: Weihnachtsfeier 2025", "content": "Eine wunderbare Weihnachtsfeier mit über 50 Familien...", "image_url": "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&q=80", "category": "Anlässe", "created_at": "2025-12-20"},
            {"title": "Neuer Spielplatz bei der Robihütte", "content": "Wir freuen uns, den neuen Spielplatz einzuweihen...", "image_url": "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80", "category": "Robihütte", "created_at": "2025-11-15"},
        ]
        db.blog_posts.insert_many(default_posts)
        posts = default_posts
    return {"posts": serialize_docs(posts) if posts and "_id" in posts[0] else posts}

@app.get("/api/pricing")
async def get_pricing():
    """Get Robihütte pricing"""
    return {
        "pricing": [
            {"label": "4 Stunden", "time_block": "4h", "day_label": "Alle Tage", "member_price": 80, "external_price": 120, "time_note": "Flexible Startzeit"},
            {"label": "12 Stunden", "time_block": "12h", "day_label": "Mo–Do", "member_price": 120, "external_price": 180, "time_note": "Flexible Startzeit"},
            {"label": "12 Stunden", "time_block": "12h", "day_label": "Fr–So + Feiertage", "member_price": 150, "external_price": 270, "time_note": "Flexible Startzeit"},
            {"label": "24 Stunden", "time_block": "24h", "day_label": "Mo–Do", "member_price": 150, "external_price": 230, "time_note": "09:00 – 09:00 nächster Tag"},
            {"label": "24 Stunden", "time_block": "24h", "day_label": "Fr–So + Feiertage", "member_price": 200, "external_price": 350, "time_note": "09:00 – 09:00 nächster Tag"},
        ],
        "cleaning": {"price": CLEANING_PRICE, "label": "Optionale Reinigung"},
        "deposit": {"amount": DEPOSIT, "note": "Bar bei Schlüsselübergabe"},
        "buffer": {"hours": BUFFER_HOURS, "note": "Pufferzeit zwischen Buchungen"},
        "max_advance_months": MAX_ADVANCE_MONTHS
    }

# ==================== CONTACT ====================

@app.post("/api/contact")
async def send_contact(message: ContactMessage):
    """Save contact message"""
    doc = {
        **message.dict(),
        "created_at": datetime.utcnow().isoformat(),
        "status": "new"
    }
    db.contact_messages.insert_one(doc)
    return {"message": "Nachricht gesendet. Wir melden uns bald!"}

@app.post("/api/newsletter")
async def subscribe_newsletter(email: EmailStr):
    """Subscribe to newsletter"""
    if db.newsletter.find_one({"email": email}):
        return {"message": "Bereits angemeldet"}
    db.newsletter.insert_one({"email": email, "subscribed_at": datetime.utcnow().isoformat()})
    return {"message": "Erfolgreich angemeldet!"}

# ==================== HEALTH CHECK ====================

@app.get("/api/")
async def root():
    return {"status": "ok", "message": "EVO API läuft"}

@app.get("/api/health")
async def health():
    return {"status": "healthy"}
