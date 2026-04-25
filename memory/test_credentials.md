# Test Credentials - EVO Website

## Admin Account (NEW)
- **Email:** admin@elternvereinigung.ch
- **Password:** admin123
- **Role:** Admin (is_admin=true, is_member=true)
- **Access:** /admin route — booking approval dashboard
- **Note:** Auto-seeded on backend startup (server.js seedAdmin())

## Test User Account (Member)
- **Email:** max@test.ch
- **Password:** test123
- **Name:** Max Muster
- **Member Status:** Yes (registered users are automatically members)

## API Testing
- Backend URL: Check /app/frontend/.env for REACT_APP_BACKEND_URL
- All API endpoints are under /api/ prefix
- Backend stack: Node.js/Express at /app/backend_node/server.js

## Booking Test Data
- Member pricing: CHF 80 (4h Mo-Do), CHF 120/150 (12h), CHF 150-200 (24h)
- External pricing: CHF 120 (4h Mo-Do), CHF 180/270 (12h), CHF 230-350 (24h)
- Cleaning addon: CHF 60
- Deposit: CHF 250
- 4h blocks blocked on Fri/Sat/Sun (weekends require 12h or 24h)

## New Registration Fields
Required: name, email, password, mobil, adresse, postleitzahl, ort
Optional: nameKind1-3, geburtsdatumKind1-3 (family/children info)

## Admin Endpoints (require admin token)
- GET /api/admin/stats
- GET /api/admin/bookings?status=pending|confirmed|rejected
- POST /api/admin/bookings/:id/approve
- POST /api/admin/bookings/:id/reject  (body: { reason })
