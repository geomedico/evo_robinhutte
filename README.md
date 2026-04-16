# EVO Elternvereinigung Oberglatt - Web Application

A full-stack web application for the Elternvereinigung Oberglatt (EVO) parent association in Switzerland. This is a functional draft prototype built to improve upon their existing Wix site.

## 🚀 Technology Stack

### Frontend
- **React** 18.x
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons
- **TailwindCSS** for styling

### Backend
- **Node.js** with **Express**
- **MongoDB** native driver for database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

### Database
- **MongoDB** for data storage

## 📁 Project Structure

```
/app/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── App.js           # Main React component with routing
│   │   ├── App.css          # Styles
│   │   ├── utils/
│   │   │   └── auth.js      # Authentication utilities (sessionStorage)
│   │   └── components/
│   │       └── shared.jsx   # Reusable UI components
│   ├── package.json
│   └── .env                 # Frontend environment variables
│
├── backend_node/            # Node.js/Express backend
│   ├── server.js           # Main Express application
│   ├── package.json
│   └── .env                # Backend environment variables
│
└── README.md
```

## 🎯 Key Features

### 1. **Homepage**
- Hero section with organization branding
- Events calendar
- Blog posts
- Board member profiles
- Contact information

### 2. **Authentication System**
- User registration and login
- JWT-based authentication
- Secure password hashing with bcryptjs
- Session management with sessionStorage

### 3. **Robihütte Booking System**
Advanced booking system with:

#### Time Blocks
- **4 hours**: Flexible start time, all days
- **12 hours**: Flexible start time, different pricing for weekdays vs weekends
- **24 hours**: Fixed 09:00-09:00, different pricing for weekdays vs weekends

#### Pricing Logic
- **Member pricing** (registered users)
- **External pricing** (guests, requires approval)
- **Weekend/Holiday detection** (Friday-Sunday + Swiss public holidays)
- **Cleaning addon**: CHF 60
- **Deposit**: CHF 250

#### Booking Rules (Blueprint 9.1)
- **1.5-hour buffer** between bookings
- **3-month advance booking limit**
- **Start date**: Tomorrow (no same-day bookings)
- **Availability checking** with conflict detection
- **Visual calendar** with booked/available states
- **Drill-down modal** to view remaining slots on partially booked days

#### Pricing Examples
| Time Block | Days | Member | External |
|------------|------|--------|----------|
| 4h | All | CHF 80 | CHF 120 |
| 12h | Mo-Do | CHF 120 | CHF 180 |
| 12h | Fr-So + Holidays | CHF 150 | CHF 270 |
| 24h | Mo-Do | CHF 150 | CHF 230 |
| 24h | Fr-So + Holidays | CHF 200 | CHF 350 |

### 4. **User Roles**
- **Members**: Registered users, automatic member status, immediate booking confirmation
- **External Guests**: Non-registered users, bookings require admin approval

## 🔧 Environment Variables

### Frontend (`/app/frontend/.env`)
```
REACT_APP_BACKEND_URL=<Your_Backend_URL>
```

### Backend (`/app/backend_node/.env`)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=evo_database
JWT_SECRET=evo-secret-key-2026
PORT=8001
NODE_ENV=development
```

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB

### 1. Install Dependencies

**Frontend:**
```bash
cd /app/frontend
yarn install
```

**Backend:**
```bash
cd /app/backend_node
yarn install
```

### 2. Configure Environment Variables
Create `.env` files in both frontend and backend directories using the templates above.

### 3. Start MongoDB
```bash
mongod --bind_ip_all
```

### 4. Start Backend
```bash
cd /app/backend_node
node server.js
# or for development with auto-reload:
# yarn dev (requires nodemon)
```

### 5. Start Frontend
```bash
cd /app/frontend
yarn start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001/api

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me?token={token}` - Get current user

### Bookings
- `GET /api/bookings/availability/:year/:month` - Get month availability
- `POST /api/bookings/seed` - Seed demo bookings
- `POST /api/bookings/check-price` - Calculate single price
- `POST /api/bookings/check-prices` - Compare member vs external prices
- `POST /api/bookings/check-availability` - Check slot availability
- `POST /api/bookings` - Create booking (members, requires token)
- `POST /api/bookings/external` - Create external booking (guests)
- `GET /api/bookings/my?token={token}` - Get user's bookings

### Content
- `GET /api/board-members` - Get board members
- `GET /api/events` - Get events
- `GET /api/blog` - Get blog posts
- `GET /api/pricing` - Get Robihütte pricing info

### Contact
- `POST /api/contact` - Submit contact message
- `POST /api/newsletter` - Subscribe to newsletter

### Health
- `GET /api/` - API status
- `GET /api/health` - Health check

## 🧪 Testing Credentials

See `/app/memory/test_credentials.md` for test user accounts.

**Default Test User:**
- Email: `max@test.ch`
- Password: `test123`
- Role: Member

## 🗄️ Database Collections

### users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  is_member: Boolean,
  created_at: ISO Date String
}
```

### bookings
```javascript
{
  _id: ObjectId,
  reference_number: String,
  user_id: String,
  user_name: String,
  user_email: String,
  user_phone: String (external only),
  booking_date: String (YYYY-MM-DD),
  start_time: String (HH:MM),
  end_time: String (HH:MM),
  time_block: String ("4h" | "12h" | "24h"),
  event_type: String,
  expected_guests: Number,
  cleaning_addon: Boolean,
  special_requests: String,
  rental_price: Number,
  cleaning_price: Number,
  total_price: Number,
  deposit: Number,
  is_member: Boolean,
  is_external: Boolean,
  status: String ("confirmed" | "pending" | "cancelled"),
  payment_status: String,
  is_seed: Boolean (demo data marker),
  created_at: ISO Date String
}
```

## 🚧 Upcoming Features (Roadmap)

### P1 (High Priority)
1. **Admin Dashboard** - Approve/reject external booking requests
2. **Email Confirmations** - Send booking confirmation emails
3. **Waitlist Feature** - Join waitlist for fully booked dates

### P2 (Medium Priority)
4. **Dynamic Admin Controls** - Manage pricing, buffers, holidays from admin panel
5. **Payment Integration** - Stripe/PayPal for online payments

## 📝 Migration Notes

This application was recently migrated from **FastAPI/Python** to **Node.js/Express** while maintaining 100% feature parity:

✅ All authentication logic preserved  
✅ Complex booking validation and pricing rules maintained  
✅ MongoDB integration working  
✅ Frontend remains unchanged (React)  
✅ All API endpoints functional  

## 🔒 Security Features

- **Password hashing** with bcryptjs (10 rounds)
- **JWT authentication** with 7-day expiration
- **Session storage** instead of localStorage (auto-clears on browser close)
- **Input validation** with express-validator
- **CORS** configuration
- **SQL injection protection** (using MongoDB native driver)

## 📄 License

This is a private project for Elternvereinigung Oberglatt.

## 🤝 Contributing

This is a draft prototype. For production deployment to Wix or other platforms, additional modifications may be required.

## 📞 Support

For questions or issues, please contact the EVO board members listed on the website.

---

**Built with ❤️ for Elternvereinigung Oberglatt**
