# EVO Elternvereinigung Oberglatt - Website Draft

**Project:** Full-stack website for Elternvereinigung Oberglatt
**Date:** January 2026
**Status:** MVP Complete ✅

---

## Original Problem Statement
Build a functional draft website for EVO (Elternvereinigung Oberglatt) according to their blueprint, including homepage, login/logout, member registration, and Robihütte booking system with business logic.

## User Requirements
- Platform: Design prototype (can be used as Wix reference)
- Design Style: Modern, minimalist, family-friendly
- Business Logic: Robihütte booking with pricing rules from blueprint
- Authentication: Member registration & login

---

## What's Been Implemented

### Pages
1. **Homepage** - Hero, Mission (Wofür wir stehen), Events teaser, Robihütte teaser, Team, CTA Band, Newsletter
2. **Über uns** - Board members / Vorstand page
3. **Aktuell** - Upcoming events list
4. **Robihütte** - Info, pricing table, booking CTA
5. **Robihütte Buchen** - 3-step booking wizard with visual calendar
6. **Blog** - Blog posts / Rückblick
7. **Kontakt** - Contact form
8. **Meine Buchungen** - User's booking history
9. **Login** - User authentication
10. **Mitglied werden** - Registration
11. **Legal pages** - Impressum, Datenschutz, AGB

### Features
- ✅ **Official EVO Logo** in header and footer
- ✅ User registration & login (JWT-based)
- ✅ **Dual Booking Mode**:
  - **Members**: 3 steps, member pricing, instant confirmation
  - **External/Guests**: 4 steps, external pricing, pending status
- ✅ Member vs External pricing differentiation clearly displayed
- ✅ **Visual Booking Calendar** with:
  - 3-state days: Free (white), Partially busy (amber), Fully booked (red)
  - Calendar starts from tomorrow (today's date disabled)
  - **Click on any day to see availability details**
  - Modal shows existing bookings with time + event type
  - Modal shows available slots on partially busy days
  - Click slot to auto-fill booking form
  - Fully booked days show "24h-Buchung reserviert"
  - Demo bookings seeded for preview
  - Month navigation
  - Legend: Ausgewählt / Teilweise belegt / Voll belegt / Frei
- ✅ Robihütte booking system with:
  - 4h and 24h time blocks
  - Weekday vs Weekend pricing
  - Cleaning addon option
  - Availability checking
  - Booking confirmation
- ✅ Contact form submission
- ✅ Newsletter subscription
- ✅ Responsive design (desktop & mobile)

### Pricing Logic (from Blueprint)
| Time Block | Day | Member | External |
|------------|-----|--------|----------|
| 4 Stunden | All | CHF 80 | CHF 120 |
| 12 Stunden | Mo-Do | CHF 120 | CHF 180 |
| 12 Stunden | Fr-So + Feiertage | CHF 150 | CHF 270 |
| 24 Stunden | Mo-Do | CHF 150 | CHF 230 |
| 24 Stunden | Fr-So + Feiertage | CHF 200 | CHF 350 |
| Reinigung | - | +CHF 60 | +CHF 60 |
| Kaution | - | CHF 250 | CHF 250 |

### Business Rules
- 1.5h buffer between all bookings
- Max. 3 months advance booking
- No same-day booking (earliest: tomorrow)
- Swiss holidays count as weekend pricing
- 24h blocks: fixed 09:00-09:00
- 4h/12h blocks: flexible start times

---

## Tech Stack
- **Frontend:** React + Tailwind CSS + React Router
- **Backend:** FastAPI (Python)
- **Database:** MongoDB
- **Auth:** JWT tokens + bcrypt

---

## API Endpoints

### Auth
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Bookings
- `GET /api/bookings/availability/{year}/{month}` - Monthly availability
- `POST /api/bookings/check-price` - Calculate price
- `POST /api/bookings/check-availability` - Check slot availability
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my` - User's bookings

### Content
- `GET /api/board-members` - Board members list
- `GET /api/events` - Events list
- `GET /api/blog` - Blog posts
- `GET /api/pricing` - Robihütte pricing

### Contact
- `POST /api/contact` - Contact form submission
- `POST /api/newsletter` - Newsletter subscription

---

## Prioritized Backlog

### P0 - Done ✅
- Homepage with all sections
- User authentication
- Robihütte booking system
- Pricing logic implementation

### P1 - Next Phase
- Admin dashboard for managing bookings
- Email notifications (booking confirmation)
- Calendar integration
- iCal export for bookings

### P2 - Future
- Payment integration (Stripe)
- Automatic invoice generation
- Online payment for bookings
- WhatsApp integration for notifications

---

## User Personas

1. **Eltern (Parents)**
   - Want to book Robihütte for kids' birthdays
   - Need to see upcoming events
   - May want to become members

2. **Mitglieder (Members)**
   - Get discounted pricing
   - Can book Robihütte online
   - Receive newsletter

3. **Vorstand (Board)**
   - Manage bookings (future admin)
   - Update events and content
   - Handle contact inquiries

---

## Next Steps
1. Deploy to production or use as Wix reference
2. Add real images (replace Unsplash placeholders)
3. Set up email service for notifications
4. Consider admin dashboard for Vorstand
