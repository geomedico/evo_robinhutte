# 🆕 New Features Implementation - December 2025

## Summary of Changes

Based on requirements from Dominique, the following features have been implemented:

---

## ✅ 1. Enhanced Registration Form (Family Data)

### New Required Fields
- **Adresse** - Street address
- **Postleitzahl** - Postal code
- **Ort** - City/Town
- **Mobil** - Mobile phone number

### New Optional Fields (Children Information)
- **Name Kind 1** - Child 1 name
- **Geburtstag Kind 1** - Child 1 birthday
- **Name Kind 2** - Child 2 name
- **Geburtstag Kind 2** - Child 2 birthday
- **Name Kind 3** - Child 3 name
- **Geburtstag Kind 3** - Child 3 birthday

### Database Schema Update

The `users` collection now includes:

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  // New required fields
  adresse: String,
  postleitzahl: String,
  ort: String,
  mobil: String,
  // Legacy/compatibility
  phone: String,
  address: String (combined: "adresse, postleitzahl ort"),
  // Optional children fields
  nameKind1: String | null,
  geburtsdatumKind1: Date | null,
  nameKind2: String | null,
  geburtsdatumKind2: Date | null,
  nameKind3: String | null,
  geburtsdatumKind3: Date | null,
  // System fields
  is_member: Boolean,
  created_at: ISO Date String
}
```

### Backend Changes
**File:** `/app/backend_node/server.js`

- Updated `/api/auth/register` endpoint with new validation
- Added all new fields to user document
- Maintains backward compatibility with old `phone` and `address` fields

---

## ✅ 2. Weekend Booking Restrictions (4h Block)

### Business Rule
**4-hour time blocks are now blocked for Friday, Saturday, and Sunday.**

Only 12-hour and 24-hour blocks are available on weekends.

### Implementation

**Function:** `checkAvailability()` in `/app/backend_node/server.js`

```javascript
// Block 4h time blocks on weekends (Friday-Sunday)
if (timeBlock === '4h') {
  const date = new Date(bookingDate);
  const dayOfWeek = date.getDay(); // 0=Sunday, 5=Friday, 6=Saturday
  
  if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
    return { 
      available: false, 
      message: '4-Stunden-Buchungen sind nur von Montag bis Donnerstag möglich. Bitte wählen Sie 12h oder 24h für Wochenenden.' 
    };
  }
}
```

### User Experience
- **Monday-Thursday**: All time blocks available (4h, 12h, 24h)
- **Friday-Sunday**: Only 12h and 24h blocks available
- **Error message (German)**: "4-Stunden-Buchungen sind nur von Montag bis Donnerstag möglich. Bitte wählen Sie 12h oder 24h für Wochenenden."

### Updated Pricing Display

The pricing table now shows:
- **4 Stunden** - "Mo–Do" (instead of "Alle Tage")
- Time note: "Flexible Startzeit (nur Montag-Donnerstag)"

---

## ✅ 3. Member Price Visibility (Login Required)

### Business Rule
**Member prices are only visible to logged-in users.**

Non-logged-in users only see external prices.

### API Changes

#### **Endpoint:** `POST /api/bookings/check-prices`

**Request:**
```javascript
{
  booking_date: "2026-01-15",
  time_block: "12h",
  cleaning: false,
  token: "user-jwt-token" // Optional
}
```

**Response (Logged in):**
```json
{
  "member": {
    "rental_price": 120,
    "cleaning_price": 0,
    "total": 120,
    "deposit": 250,
    "is_weekend": false
  },
  "external": {
    "rental_price": 180,
    "cleaning_price": 0,
    "total": 180,
    "deposit": 250,
    "is_weekend": false
  },
  "showMemberPrice": true
}
```

**Response (Not logged in):**
```json
{
  "external": {
    "rental_price": 180,
    "cleaning_price": 0,
    "total": 180,
    "deposit": 250,
    "is_weekend": false
  },
  "showMemberPrice": false
}
```

#### **Endpoint:** `GET /api/pricing?token={token}`

**Query Parameter:** `token` (optional)

**Response (Logged in):**
```json
{
  "pricing": [
    {
      "label": "4 Stunden",
      "time_block": "4h",
      "day_label": "Mo–Do",
      "member_price": 80,
      "external_price": 120,
      "time_note": "Flexible Startzeit (nur Montag-Donnerstag)"
    },
    // ... other pricing options with member_price included
  ],
  "showMemberPrice": true,
  "cleaning": { "price": 60, "label": "Optionale Reinigung" },
  "deposit": { "amount": 250, "note": "Bar bei Schlüsselübergabe" },
  "buffer": { "hours": 1.5, "note": "Pufferzeit zwischen Buchungen" },
  "max_advance_months": 3
}
```

**Response (Not logged in):**
```json
{
  "pricing": [
    {
      "label": "4 Stunden",
      "time_block": "4h",
      "day_label": "Mo–Do",
      "member_price": undefined,
      "external_price": 120,
      "time_note": "Flexible Startzeit (nur Montag-Donnerstag)"
    },
    // ... other pricing options without member_price
  ],
  "showMemberPrice": false,
  // ... rest of the response
}
```

---

## 📋 Frontend Implementation Guide

### 1. Update Registration Form

**File to modify:** `/app/frontend/src/App.js`

Add these form fields to the registration component:

```jsx
// Required fields
<input type="text" name="adresse" placeholder="Adresse *" required />
<input type="text" name="postleitzahl" placeholder="Postleitzahl *" required />
<input type="text" name="ort" placeholder="Ort *" required />
<input type="tel" name="mobil" placeholder="Mobilnummer *" required />

// Optional children fields
<h3>Kinder (optional)</h3>
<input type="text" name="nameKind1" placeholder="Name Kind 1" />
<input type="date" name="geburtsdatumKind1" placeholder="Geburtstag Kind 1" />

<input type="text" name="nameKind2" placeholder="Name Kind 2" />
<input type="date" name="geburtsdatumKind2" placeholder="Geburtstag Kind 2" />

<input type="text" name="nameKind3" placeholder="Name Kind 3" />
<input type="date" name="geburtsdatumKind3" placeholder="Geburtstag Kind 3" />
```

### 2. Update Booking Calendar Logic

**File to modify:** `/app/frontend/src/App.js`

Hide 4h option on weekends:

```javascript
const selectedDate = new Date(bookingDate);
const dayOfWeek = selectedDate.getDay();
const isWeekend = (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6);

// In your time block selection UI
{!isWeekend && (
  <button onClick={() => selectTimeBlock('4h')}>
    4 Stunden
  </button>
)}

<button onClick={() => selectTimeBlock('12h')}>
  12 Stunden
</button>

<button onClick={() => selectTimeBlock('24h')}>
  24 Stunden
</button>
```

### 3. Update Pricing Display

**File to modify:** `/app/frontend/src/App.js`

Conditionally show member prices:

```javascript
const [pricingData, setPricingData] = useState(null);
const token = sessionStorage.getItem('token');

useEffect(() => {
  // Fetch pricing with token
  axios.get(`${API_URL}/api/pricing?token=${token || ''}`)
    .then(res => setPricingData(res.data));
}, []);

// In your pricing table
{pricingData?.showMemberPrice ? (
  <div>
    <p>Mitglieder: CHF {price.member_price}</p>
    <p>Externe: CHF {price.external_price}</p>
  </div>
) : (
  <div>
    <p>Preis: CHF {price.external_price}</p>
    <small>Mitglieder erhalten reduzierte Preise - bitte anmelden</small>
  </div>
)}
```

---

## 🧪 Testing the New Features

### Test 1: Enhanced Registration

**Steps:**
1. Go to registration page
2. Fill in all required fields (Adresse, Postleitzahl, Ort, Mobil)
3. Optionally fill in child information (1-3 children)
4. Submit registration
5. Verify user is created with all fields

**Test via curl:**
```bash
API_URL=$(grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d '=' -f2)

curl -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Familie",
    "email": "test@familie.ch",
    "password": "test123",
    "adresse": "Teststrasse 1",
    "postleitzahl": "8154",
    "ort": "Oberglatt",
    "mobil": "+41 79 123 45 67",
    "nameKind1": "Anna Test",
    "geburtsdatumKind1": "2015-05-10",
    "nameKind2": "Max Test",
    "geburtsdatumKind2": "2018-08-22"
  }'
```

**Expected:** Success response with token

---

### Test 2: Weekend 4h Block Restriction

**Steps:**
1. Select a Friday, Saturday, or Sunday date
2. Try to select 4h time block
3. Attempt booking

**Test via curl:**
```bash
API_URL=$(grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d '=' -f2)

# Test with a Friday date (2026-01-16 is a Friday)
curl -X POST "$API_URL/api/bookings/check-availability" \
  -H "Content-Type: application/json" \
  -d '{
    "booking_date": "2026-01-16",
    "start_time": "10:00",
    "time_block": "4h"
  }'
```

**Expected:**
```json
{
  "available": false,
  "message": "4-Stunden-Buchungen sind nur von Montag bis Donnerstag möglich. Bitte wählen Sie 12h oder 24h für Wochenenden."
}
```

**Test with Monday (should work):**
```bash
# 2026-01-19 is a Monday
curl -X POST "$API_URL/api/bookings/check-availability" \
  -H "Content-Type: application/json" \
  -d '{
    "booking_date": "2026-01-19",
    "start_time": "10:00",
    "time_block": "4h"
  }'
```

**Expected:**
```json
{
  "available": true
}
```

---

### Test 3: Member Price Visibility

**Test without login:**
```bash
API_URL=$(grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d '=' -f2)

curl -s "$API_URL/api/pricing" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(f\"Show member price: {data['showMemberPrice']}\")
print(f\"First price option member_price: {data['pricing'][0].get('member_price', 'Not shown')}\")
"
```

**Expected:**
```
Show member price: False
First price option member_price: Not shown
```

**Test with login:**
```bash
# First login
TOKEN=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"max@test.ch","password":"test123"}' \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['token'])")

# Then get pricing
curl -s "$API_URL/api/pricing?token=$TOKEN" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(f\"Show member price: {data['showMemberPrice']}\")
print(f\"First price member: CHF {data['pricing'][0].get('member_price')}\")
print(f\"First price external: CHF {data['pricing'][0]['external_price']}\")
"
```

**Expected:**
```
Show member price: True
First price member: CHF 80
First price external: CHF 120
```

---

## 📝 Database Migration Notes

### For Existing Users

Existing users in the database won't have the new fields. You can:

**Option 1:** Prompt users to update their profile with missing information

**Option 2:** Set defaults for existing users:

```javascript
// MongoDB shell
db.users.updateMany(
  { adresse: { $exists: false } },
  { 
    $set: {
      adresse: "",
      postleitzahl: "",
      ort: "",
      mobil: "",
      nameKind1: null,
      geburtsdatumKind1: null,
      nameKind2: null,
      geburtsdatumKind2: null,
      nameKind3: null,
      geburtsdatumKind3: null
    }
  }
);
```

---

## 🔄 Wix Migration Guide Updates

The Wix migration guides need to be updated to include:

### Collection: Mitglieder (Updated Schema)

Add these fields to the `Mitglieder` collection in Wix:

**New Required Fields:**
- `adresse` (Text) - Street address
- `postleitzahl` (Text) - Postal code
- `ort` (Text) - City
- `mobil` (Phone) - Mobile phone

**New Optional Fields:**
- `nameKind1` (Text) - Child 1 name
- `geburtsdatumKind1` (Date) - Child 1 birthday
- `nameKind2` (Text) - Child 2 name
- `geburtsdatumKind2` (Date) - Child 2 birthday
- `nameKind3` (Text) - Child 3 name
- `geburtsdatumKind3` (Date) - Child 3 birthday

### Velo Code Updates

Update the booking logic (`buchungsLogik.jsw`) to include weekend 4h restriction:

```javascript
// In pruefeVerfuegbarkeit function
export async function pruefeVerfuegbarkeit(buchungsDatum, startZeit, zeitBlock) {
  // ... existing date validation ...
  
  // NEW: Block 4h on weekends
  if (zeitBlock === '4h') {
    const datum = new Date(buchungsDatum);
    const wochentag = datum.getDay();
    
    if (wochentag === 0 || wochentag === 5 || wochentag === 6) {
      return { 
        verfuegbar: false, 
        nachricht: '4-Stunden-Buchungen sind nur von Montag bis Donnerstag möglich.' 
      };
    }
  }
  
  // ... rest of the function ...
}
```

---

## ✅ Summary

**All changes implemented and tested:**

1. ✅ Enhanced registration with family data (address + up to 3 children)
2. ✅ 4h booking blocks restricted to Monday-Thursday
3. ✅ Member prices only visible to logged-in users

**Backend changes:** `/app/backend_node/server.js`
**Frontend changes needed:** Registration form, booking calendar, pricing display
**Database schema:** Updated with new user fields
**Testing:** All features tested via curl

**Next step:** Update the frontend to implement the UI for these changes (or use Wix with the updated guides).

---

**Created:** December 2025  
**Status:** Backend complete, frontend implementation pending  
**Backward compatible:** Yes (existing users/bookings unaffected)
