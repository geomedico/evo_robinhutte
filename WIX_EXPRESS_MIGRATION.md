# ⚡ Express Wix Migration - 1-2 Day Quick Start

**For:** When you MUST use Wix and need it done FAST  
**Timeline:** 1-2 days for working MVP  
**Approach:** Essential features only, shortcuts where possible  

---

## 🎯 What You'll Get (MVP)

**Day 1 (4-6 hours):**
- ✅ Homepage with images
- ✅ Contact form
- ✅ Events display
- ✅ Basic member registration

**Day 2 (4-6 hours):**
- ✅ Simple booking form (with email notifications)
- ✅ Pricing display
- ✅ Admin approval workflow

**SKIPPED for speed (add later):**
- ❌ Complex calendar with availability checking
- ❌ Advanced weekend restrictions
- ❌ Real-time availability updates
- ❌ Member-only price visibility

---

## 🚀 Day 1: Core Setup (4-6 hours)

### Hour 1: Wix Account & Template

**1. Create Wix Site (10 min)**
- Go to wix.com → **"Create New Site"**
- Choose **"Community"** template (any clean one)
- Name it: "EVO Elternvereinigung"

**2. Enable Velo (5 min)**
- Top menu → **"Dev Mode"** toggle → **"Enable"**
- Code panel appears at bottom

**3. Enable Wix Members (5 min)**
- Add → **"Login Bar"** → Drag to header
- Popup appears → **"Add Members Area"**
- Done! Registration/login is automatic

---

### Hour 2: Database (Simplified)

**Create ONLY 4 Essential Collections:**

#### **Collection 1: Mitglieder**
```
Name: Mitglieder
Fields:
- mitgliedId (Text) - Wix member ID
- name (Text)
- email (Email)
- adresse (Text)
- postleitzahl (Text)
- ort (Text)
- mobil (Phone)
```

#### **Collection 2: Buchungen**
```
Name: Buchungen
Fields:
- referenzNummer (Text)
- benutzerName (Text)
- benutzerEmail (Email)
- buchungsDatum (Date)
- zeitBlock (Text) - "4h", "12h", "24h"
- veranstaltungsTyp (Text)
- erwarteteGaeste (Number)
- gesamtPreis (Number)
- status (Text) - "ausstehend", "bestaetigt", "storniert"
- erstelltAm (Date)
```

#### **Collection 3: Veranstaltungen**
```
Name: Veranstaltungen
Fields:
- titel (Text)
- datum (Date)
- uhrzeit (Text)
- ort (Text)
- beschreibung (Rich Text)
```

#### **Collection 4: Kontaktnachrichten**
```
Name: Kontaktnachrichten
Fields:
- name (Text)
- email (Email)
- nachricht (Rich Text)
- erstelltAm (Date)
```

**⏱️ Time saved:** Skipped 4 collections (Board, Blog, Newsletter, Pricing) - add later if needed

---

### Hour 3: Upload Homepage Assets

**1. Upload Images to Media Manager (10 min)**

From `/app/assets/homepage/`:
- `logo_evo_mobile.jpg`
- `hero_background_familie.jpg`
- `robihuette_exterior.jpg`

**2. Create Homepage Structure (30 min)**

**Header:**
- Add logo (left)
- Add menu: Start | Über uns | Robihütte | Kontakt
- Login bar already there ✅

**Hero Section:**
- Add Strip → Full-width
- Background → Upload `hero_background_familie.jpg`
- Add gradient overlay (dark)
- Add text: "Elternvereinigung Oberglatt"
- Add button: "Mitglied werden" (links to /mitglied-werden)

**Events Section:**
- Add Repeater (3 columns)
- Connect to **Veranstaltungen** collection
- Display: Title, Date, Location

**Robihütte Teaser:**
- Add image: `robihuette_exterior.jpg`
- Add text: "Robihütte mieten"
- Add button: "Jetzt anfragen" (links to /kontakt)

**Footer:**
- Logo + Contact info
- Copyright text

**⏱️ Time saved:** Skipped board members, blog, mission cards - focus on essentials

---

### Hour 4: Contact Form (EASY)

**Wix Built-in Form (No code needed!):**

1. Add → **"Contact & Forms"** → **"Contact Form"**
2. Drag to page
3. Connect to **Kontaktnachrichten** collection
4. Fields: Name, Email, Message
5. Done! Auto-saves to database

**⏱️ Time saved:** No custom code, Wix handles it

---

### Hour 5: Events Page (Dynamic)

**1. Create Events Page:**
- Pages → Add Page → **"Aktuell"**

**2. Add Repeater:**
- Connect to **Veranstaltungen** collection
- Display all events
- Sort by date (ascending)

**3. Manually Add 3 Sample Events** in CMS:
- Kinderclub Nachmittag - 2026-02-15
- Familien-Spielabend - 2026-02-22
- Frühlingsmarkt - 2026-03-08

**⏱️ Time saved:** No complex filtering, just show all upcoming events

---

### Hour 6: Member Registration (AUTO)

**Already done!** Wix Members handles this automatically.

**Customize Registration Form:**
- Login Bar → Settings → Sign Up Form
- Add fields: Name, Email, Password
- Optional: Add Adresse, Postleitzahl, Ort, Mobil

**⏱️ Time saved:** No manual sync code, Wix handles member creation

---

## ✅ End of Day 1 Checkpoint

**What's working:**
- ✅ Beautiful homepage with images
- ✅ Contact form (saves to database)
- ✅ Events page (dynamic from CMS)
- ✅ Member registration/login
- ✅ Mobile responsive (automatic)

**Test it:** Click **"Preview"** and try:
- Registering a new account
- Logging in
- Viewing events
- Submitting contact form

---

## 🚀 Day 2: Booking System (4-6 hours)

### Hour 1: Simple Booking Form (No Complex Calendar)

**Create `/robihuette-buchen` page:**

**Add Wix Form with fields:**
1. **Datum** (Date Picker)
2. **Zeitblock** (Dropdown)
   - Options: "4 Stunden (CHF 80)", "12 Stunden (CHF 120-150)", "24 Stunden (CHF 150-200)"
3. **Veranstaltungstyp** (Dropdown)
   - Options: Geburtstag, Familienfeier, Vereinsanlass, Firmenanlass
4. **Erwartete Gäste** (Number)
5. **Name** (Text) - Auto-fill if logged in
6. **Email** (Email) - Auto-fill if logged in
7. **Telefon** (Phone)
8. **Nachricht** (Textarea)

**Submit Button:** "Buchungsanfrage senden"

**⏱️ Time saved:** No calendar, no availability checking - just a form!

---

### Hour 2: Connect Form to Database

**Page Code (`RobihütteBuchen.js`):**

```javascript
import wixData from 'wix-data';
import wixUsers from 'wix-users';

$w.onReady(function () {
  // Auto-fill name/email if logged in
  if (wixUsers.currentUser.loggedIn) {
    wixUsers.currentUser.getEmail().then(email => {
      $w('#emailInput').value = email;
    });
  }
});

export function submitButton_click(event) {
  // Get form values
  const datum = $w('#datumPicker').value;
  const zeitBlock = $w('#zeitblockDropdown').value;
  const veranstaltungsTyp = $w('#veranstaltungDropdown').value;
  const gaeste = $w('#gaesteInput').value;
  const name = $w('#nameInput').value;
  const email = $w('#emailInput').value;
  const telefon = $w('#telefonInput').value;
  const nachricht = $w('#nachrichtTextarea').value;
  
  // Calculate simple price
  let preis = 80; // Default 4h
  if (zeitBlock.includes('12')) preis = 150;
  if (zeitBlock.includes('24')) preis = 200;
  
  // Create booking
  const buchung = {
    referenzNummer: 'RH-' + Date.now(),
    benutzerName: name,
    benutzerEmail: email,
    buchungsDatum: datum,
    zeitBlock: zeitBlock,
    veranstaltungsTyp: veranstaltungsTyp,
    erwarteteGaeste: parseInt(gaeste),
    gesamtPreis: preis,
    status: 'ausstehend',
    erstelltAm: new Date()
  };
  
  // Save to database
  wixData.insert('Buchungen', buchung)
    .then(() => {
      $w('#successMessage').show();
      $w('#bookingForm').hide();
    })
    .catch(err => {
      console.error(err);
      $w('#errorMessage').text = 'Fehler beim Senden. Bitte erneut versuchen.';
      $w('#errorMessage').show();
    });
}
```

**⏱️ Time saved:** Simple flat pricing, no weekend detection, no complex validation

---

### Hour 3: Email Notifications (AUTO)

**Setup Automation:**

1. Settings → **Automations**
2. **New Automation**
3. Trigger: **"Item added to Buchungen"**
4. Action: **"Send Email"**

**Email to Customer:**
```
Subject: Buchungsanfrage erhalten - {{item.referenzNummer}}

Hallo {{item.benutzerName}},

Ihre Buchungsanfrage wurde erhalten!

Datum: {{item.buchungsDatum}}
Zeitblock: {{item.zeitBlock}}
Preis: CHF {{item.gesamtPreis}}

Wir melden uns innerhalb von 24 Stunden zur Bestätigung.

Herzliche Grüsse,
Elternvereinigung Oberglatt
```

**Email to Admin:**
- Same trigger
- Send to: info@elternvereinigung.ch
- Subject: "Neue Buchungsanfrage"

**⏱️ Time saved:** Wix automations = no custom email code

---

### Hour 4: Admin Dashboard (Simple)

**Create `/admin` page (hidden from menu):**

**Add Table/Repeater:**
- Connect to **Buchungen** collection
- Display: Referenz, Name, Datum, Zeitblock, Status
- Sort by: Created date (descending)

**Add Buttons per Row:**
- **"Bestätigen"** → Updates status to "bestaetigt"
- **"Ablehnen"** → Updates status to "storniert"

**Simple Code:**
```javascript
import wixData from 'wix-data';

$w('#bestaetigenButton').onClick(() => {
  const itemId = $item('#repeater').id;
  wixData.update('Buchungen', {
    _id: itemId,
    status: 'bestaetigt'
  }).then(() => {
    $w('#repeater').refresh();
  });
});
```

**⏱️ Time saved:** Basic approve/reject only, no complex admin features

---

### Hour 5: Pricing Page (Static)

**Create `/robihuette` page:**

**Add Static Pricing Table (No database):**

```html
<table>
  <tr>
    <th>Zeitblock</th>
    <th>Tage</th>
    <th>Preis</th>
  </tr>
  <tr>
    <td>4 Stunden</td>
    <td>Mo-Do</td>
    <td>CHF 80</td>
  </tr>
  <tr>
    <td>12 Stunden</td>
    <td>Mo-Do</td>
    <td>CHF 120</td>
  </tr>
  <tr>
    <td>12 Stunden</td>
    <td>Fr-So</td>
    <td>CHF 150</td>
  </tr>
  <tr>
    <td>24 Stunden</td>
    <td>Mo-Do</td>
    <td>CHF 150</td>
  </tr>
  <tr>
    <td>24 Stunden</td>
    <td>Fr-So</td>
    <td>CHF 200</td>
  </tr>
</table>
```

Add text: "Reinigung: CHF 60", "Kaution: CHF 250"

**⏱️ Time saved:** Static table, no dynamic pricing logic

---

### Hour 6: Testing & Polish

**Test Everything:**
- [ ] Homepage loads
- [ ] Member registration works
- [ ] Login/logout works
- [ ] Contact form saves
- [ ] Events display
- [ ] Booking form submits
- [ ] Email notifications sent
- [ ] Admin can approve/reject

**Quick Polish:**
- [ ] Add logo to all pages
- [ ] Fix any broken links
- [ ] Check mobile view
- [ ] Add privacy policy link (required for forms)

---

## ✅ End of Day 2 - YOU'RE LIVE!

**What's working:**
- ✅ Complete homepage
- ✅ Member registration/login
- ✅ Contact form
- ✅ Events page
- ✅ Booking request form
- ✅ Auto email notifications
- ✅ Admin approval dashboard
- ✅ Pricing information

**What's simplified (vs full guide):**
- ⚠️ No live calendar (just date picker)
- ⚠️ No automatic availability checking
- ⚠️ Manual price entry (not calculated)
- ⚠️ No member-only pricing
- ⚠️ No weekend restrictions
- ⚠️ Admin manually approves all bookings

---

## 🚀 Publishing

**1. Connect Domain:**
- Settings → Domains → Connect **elternvereinigung.ch**

**2. Publish:**
- Click **"Publish"** button
- Wait 2-5 minutes

**3. You're LIVE!** 🎉

---

## 📈 Phase 2: Add Advanced Features (Later)

**After you're live, add these incrementally:**

**Week 2:**
- [ ] Visual calendar (Wix Bookings app)
- [ ] Board members section
- [ ] Blog posts

**Week 3:**
- [ ] Automatic pricing calculation
- [ ] Weekend restrictions
- [ ] Availability checking

**Week 4:**
- [ ] Member-only pricing
- [ ] My bookings page
- [ ] Advanced admin features

---

## 🆘 Quick Troubleshooting

**"Form not saving"**
- Check collection permissions: Anyone can Create

**"Email not sending"**
- Verify automation is enabled
- Check email address is correct

**"Page not found after publish"**
- Clear browser cache
- Wait 5 minutes for DNS

**"Can't login"**
- Check Members area is enabled
- Verify user was created in Wix Members

---

## 📊 Time Breakdown

| Task | Time | Priority |
|------|------|----------|
| Wix setup + Velo | 30 min | High |
| Database (4 collections) | 45 min | High |
| Homepage design | 1.5 hours | High |
| Contact form | 20 min | High |
| Events page | 30 min | High |
| Member registration | 15 min | High |
| **Day 1 Total** | **4-5 hours** | |
| Booking form | 1 hour | High |
| Form → Database | 45 min | High |
| Email notifications | 30 min | High |
| Admin dashboard | 1 hour | High |
| Pricing page | 30 min | Medium |
| Testing | 30 min | High |
| **Day 2 Total** | **4-5 hours** | |
| **TOTAL** | **8-10 hours** | |

---

## ✅ Success Criteria

**Your MVP is successful if:**
- ✅ Users can register and login
- ✅ Users can submit booking requests
- ✅ You receive email notifications
- ✅ You can approve/reject bookings
- ✅ Contact form works
- ✅ Site looks professional
- ✅ Mobile responsive

**Don't worry about:**
- ❌ Perfect calendar integration
- ❌ Real-time availability
- ❌ Complex pricing logic

**You can add these later!**

---

## 🎯 Key Philosophy

**"Working now > Perfect later"**

This guide gets you:
- Live website in 1-2 days
- Basic booking system working
- Professional appearance
- Room to improve incrementally

**Better to have:**
- Working simple system TODAY
- Than perfect system in 7 days

---

**Questions during setup?**
- Wix Support: support@wix.com
- Wix Forum: wix.com/forum
- Velo Docs: wix.com/velo/reference

**Let's get you live! 🚀**
