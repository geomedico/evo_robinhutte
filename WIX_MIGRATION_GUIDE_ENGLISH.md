# 🚀 Complete Wix Migration Guide - EVO Elternvereinigung Oberglatt

**Target Audience:** Junior Developer (Beginner Level)  
**Wix Plan Required:** Premium Plan  
**Editor:** Classic Wix Editor  
**Approach:** Full Wix Native (Velo + Wix Data + Wix Members)  
**Timeline:** Urgent - Step-by-step implementation  

---

## 📋 Table of Contents

1. [Prerequisites & Wix Setup](#1-prerequisites--wix-setup)
2. [Database Setup (Wix Data Collections)](#2-database-setup-wix-data-collections)
3. [Backend Logic (Velo Code)](#3-backend-logic-velo-code)
4. [Frontend/UI Implementation](#4-frontendui-implementation)
5. [Authentication System](#5-authentication-system)
6. [Booking System](#6-booking-system)
7. [Payment Integration](#7-payment-integration)
8. [Email Notifications](#8-email-notifications)
9. [Testing & Launch](#9-testing--launch)

---

## 1. Prerequisites & Wix Setup

### Step 1.1: Create Your Wix Site

1. Go to [wix.com](https://www.wix.com)
2. Click **"Get Started"** → **"Create a Site"**
3. Choose **"Start with a Template"**
4. Search for **"Community"** or **"Organization"** templates
5. Select a clean template (you'll customize it completely)
6. Click **"Edit This Site"**

### Step 1.2: Enable Velo (Developer Mode)

**Velo is Wix's coding platform - you MUST enable it!**

1. In the Wix Editor, click **"Dev Mode"** toggle in the top menu
   - If you don't see it, click **Tools & Apps** → **Developer Tools** → **Enable Developer Tools**
2. A popup appears: **"Turn on Developer Tools"**
3. Click **"Enable Developer Tools"**
4. The editor will reload with a code panel at the bottom
5. **Confirmation**: You should now see **"Code Files"** panel on the left sidebar

### Step 1.3: Enable Wix Members (Authentication)

1. In the Wix Editor, click **"Add"** (+ button on left sidebar)
2. Scroll to **"User Input"** section
3. Click **"Login Bar"**
4. Drag and drop the Login Bar to your header
5. A popup appears: **"Add Members Area"**
6. Click **"Add Members Area"**
7. Choose **"Member Signup & Login"** template
8. Click **"Add to Site"**

**Wix Members is now enabled!** Users can register and log in.

### Step 1.4: Upgrade to Premium Plan (If Not Already)

1. Click **"Upgrade"** button in top menu
2. Select **"Business Unlimited"** or higher plan
3. Connect your domain: **elternvereinigung.ch**
4. Complete payment setup

---

## 2. Database Setup (Wix Data Collections)

### What is Wix Data Collections?

Think of it like MongoDB collections, but managed by Wix. Each collection is a table with fields (columns).

### Step 2.1: Access Database Manager

1. In Wix Editor, click **"CMS"** button on left sidebar (Database icon)
2. Click **"Add a Collection"** or **"Database"** → **"Add Collection"**

### Step 2.2: Create Collections

You need to create **8 collections**. Here's the complete structure:

---

#### **Collection 1: Mitglieder (Members)**

**Purpose:** Extends Wix Members with custom fields including family information

**Collection Name:** `Mitglieder`  
**Permissions:** 
- Who can read: **Site Member**
- Who can create: **Site Member (Author)**
- Who can update: **Site Member (Author)**
- Who can delete: **Admin**

**Fields:**

| Field Name | Type | Description | Required |
|-----------|------|-------------|----------|
| `_id` | Text | Auto-generated ID (default) | Yes |
| `mitgliedId` | Text | Wix Member ID (connect to user) | Yes |
| `name` | Text | Full name | Yes |
| `email` | Email | Email address | Yes |
| `adresse` | Text | Street address | Yes |
| `postleitzahl` | Text | Postal code | Yes |
| `ort` | Text | City/Town | Yes |
| `mobil` | Phone | Mobile phone number | Yes |
| `telefon` | Phone | Alternative phone number | No |
| `nameKind1` | Text | Child 1 name | No |
| `geburtsdatumKind1` | Date | Child 1 birthday | No |
| `nameKind2` | Text | Child 2 name | No |
| `geburtsdatumKind2` | Date | Child 2 birthday | No |
| `nameKind3` | Text | Child 3 name | No |
| `geburtsdatumKind3` | Date | Child 3 birthday | No |
| `istMitglied` | Boolean | Is member (always true for registered) | Yes |
| `erstelltAm` | Date | Created date | Yes |

**How to create:**

1. Click **"Add Collection"**
2. Name it: `Mitglieder`
3. For each field above:
   - Click **"Add Field"**
   - Choose correct **Type**
   - Set field **Name** (German names as specified)
   - Mark as **Required** if specified in table above
   - Click **"Add"**
4. Set **Permissions** as listed above
5. Click **"Save"**

**Note:** This collection now stores complete family information (one data set per family) including up to 3 children (optional).

---

#### **Collection 2: Buchungen (Bookings)**

**Purpose:** Store all Robihütte bookings

**Collection Name:** `Buchungen`  
**Permissions:**
- Who can read: **Anyone** (for calendar visibility)
- Who can create: **Site Member**
- Who can update: **Admin only**
- Who can delete: **Admin only**

**Fields:**

| Field Name | Type | Description | Required |
|-----------|------|-------------|----------|
| `referenzNummer` | Text | Booking reference (e.g., RH-2026-0001) | Yes |
| `benutzerId` | Reference | Link to Mitglieder collection | Yes |
| `benutzerName` | Text | User's full name | Yes |
| `benutzerEmail` | Email | User's email | Yes |
| `benutzerTelefon` | Phone | User's phone (external only) | No |
| `buchungsDatum` | Date | Booking date (YYYY-MM-DD) | Yes |
| `startZeit` | Text | Start time (HH:MM) | Yes |
| `endZeit` | Text | End time (HH:MM) | Yes |
| `zeitBlock` | Text | Time block: "4h", "12h", or "24h" | Yes |
| `veranstaltungsTyp` | Text | Event type | Yes |
| `erwarteteGaeste` | Number | Expected guests count | Yes |
| `reinigungZusatz` | Boolean | Cleaning addon | No |
| `spezialleWuensche` | Rich Text | Special requests | No |
| `mietPreis` | Number | Rental price in CHF | Yes |
| `reinigungsPreis` | Number | Cleaning price in CHF | Yes |
| `gesamtPreis` | Number | Total price (rental + cleaning) | Yes |
| `kaution` | Number | Deposit amount (CHF 250) | Yes |
| `istMitglied` | Boolean | Is member booking | Yes |
| `istExtern` | Boolean | Is external (non-member) | No |
| `status` | Text | "bestaetigt", "ausstehend", "storniert" | Yes |
| `zahlungsStatus` | Text | "bezahlt", "ausstehend" | Yes |
| `erstelltAm` | Date & Time | Created timestamp | Yes |

**How to create:**
1. Same process as Mitglieder collection
2. Pay attention to **Field Types** (Date, Number, Boolean, etc.)
3. Set **Required** fields in field settings

---

#### **Collection 3: Veranstaltungen (Events)**

**Collection Name:** `Veranstaltungen`  
**Permissions:** Read: Anyone, Create/Update/Delete: Admin

**Fields:**

| Field Name | Type | Description |
|-----------|------|-------------|
| `titel` | Text | Event title |
| `datum` | Date | Event date |
| `uhrzeit` | Text | Time (e.g., "14:00 - 17:00") |
| `ort` | Text | Location |
| `kategorie` | Text | Category (Kinderclub, Familienanlass, etc.) |
| `beschreibung` | Rich Text | Description |
| `bild` | Image | Event image |

---

#### **Collection 4: BlogPosts**

**Collection Name:** `BlogPosts`  
**Permissions:** Read: Anyone, Create/Update/Delete: Admin

**Fields:**

| Field Name | Type | Description |
|-----------|------|-------------|
| `titel` | Text | Post title |
| `inhalt` | Rich Text | Post content |
| `bild` | Image | Featured image |
| `kategorie` | Text | Category |
| `erstelltAm` | Date & Time | Published date |

---

#### **Collection 5: Vorstandsmitglieder (Board Members)**

**Collection Name:** `Vorstandsmitglieder`  
**Permissions:** Read: Anyone, Create/Update/Delete: Admin

**Fields:**

| Field Name | Type | Description |
|-----------|------|-------------|
| `name` | Text | Member name |
| `rolle` | Text | Role (Präsidentin, Vorstand) |
| `email` | Email | Email |
| `foto` | Image | Photo |
| `sortierung` | Number | Sort order |
| `istAktiv` | Boolean | Is active |

**Pre-populate with:**
1. Dominique Knöpfli - Präsidentin
2. Mélanie Bosshardt - Vorstand
3. Mirjam Spörri - Vorstand

---

#### **Collection 6: Kontaktnachrichten (Contact Messages)**

**Collection Name:** `Kontaktnachrichten`  
**Permissions:** Read/Create: Anyone, Update/Delete: Admin

**Fields:**

| Field Name | Type | Description |
|-----------|------|-------------|
| `name` | Text | Sender name |
| `email` | Email | Sender email |
| `betreff` | Text | Subject |
| `nachricht` | Rich Text | Message |
| `status` | Text | "neu", "gelesen", "beantwortet" |
| `erstelltAm` | Date & Time | Sent timestamp |

---

#### **Collection 7: Newsletter**

**Collection Name:** `Newsletter`  
**Permissions:** Read: Admin, Create: Anyone, Update/Delete: Admin

**Fields:**

| Field Name | Type | Description |
|-----------|------|-------------|
| `email` | Email | Subscriber email |
| `angemeldetAm` | Date & Time | Subscription date |

---

#### **Collection 8: Preise (Pricing)**

**Collection Name:** `Preise`  
**Permissions:** Read: Anyone, Create/Update/Delete: Admin

**Fields:**

| Field Name | Type | Description |
|-----------|------|-------------|
| `label` | Text | "4 Stunden", "12 Stunden", "24 Stunden" |
| `zeitBlock` | Text | "4h", "12h", "24h" |
| `tagLabel` | Text | "Alle Tage", "Mo–Do", "Fr–So + Feiertage" |
| `mitgliedPreis` | Number | Member price |
| `externPreis` | Number | External price |
| `zeitNotiz` | Text | Time note |

**Pre-populate with 5 rows:**

| label | zeitBlock | tagLabel | mitgliedPreis | externPreis | zeitNotiz |
|-------|-----------|----------|---------------|-------------|-----------|
| 4 Stunden | 4h | Mo–Do | 80 | 120 | Flexible Startzeit (nur Montag-Donnerstag) |
| 12 Stunden | 12h | Mo–Do | 120 | 180 | Flexible Startzeit |
| 12 Stunden | 12h | Fr–So + Feiertage | 150 | 270 | Flexible Startzeit |
| 24 Stunden | 24h | Mo–Do | 150 | 230 | 09:00 – 09:00 nächster Tag |
| 24 Stunden | 24h | Fr–So + Feiertage | 200 | 350 | 09:00 – 09:00 nächster Tag |

**Important:** Note that 4h bookings are now restricted to Monday-Thursday only (tagLabel changed from "Alle Tage" to "Mo–Do").

---

### ✅ Checkpoint: Database Setup Complete

You should now have **8 collections** visible in your CMS panel. Click each one to verify fields are correct.

---

## 3. Backend Logic (Velo Code)

### What is Velo?

Velo lets you write JavaScript code to add backend logic. Code files end with `.jsw` (backend) or `.js` (frontend/page).

### Step 3.1: Understanding Velo File Structure

**Backend files (.jsw):**
- Located in **Backend** folder
- Run on Wix servers (secure, users can't see code)
- Can access database, perform calculations, send emails

**Page files (.js):**
- Located in **Public & Backend** folder
- Run in user's browser
- Handle UI interactions, button clicks, form submissions

### Step 3.2: Create Backend Module for Booking Logic

1. In Code Panel (bottom), click **"Public & Backend"** folder
2. Right-click **"Backend"** folder → **"New .jsw File"**
3. Name it: `buchungsLogik.jsw`
4. Copy and paste this complete code:

```javascript
// Filename: buchungsLogik.jsw (Backend)
// Purpose: All booking logic, pricing, availability checking

import wixData from 'wix-data';

// ==================== CONSTANTS ====================

const REINIGUNGSPREIS = 60;  // Cleaning fee
const KAUTION = 250;  // Deposit
const PUFFERZEIT_STUNDEN = 1.5;  // Buffer time in hours
const MAX_VORLAUFZEIT_MONATE = 3;  // Max 3 months advance booking

// Swiss holidays 2026
const SCHWEIZER_FEIERTAGE_2026 = [
  '2026-01-01', '2026-01-02', '2026-04-03', '2026-04-06',
  '2026-05-01', '2026-05-14', '2026-05-25', '2026-08-01',
  '2026-12-25', '2026-12-26'
];

// ==================== HELPER FUNCTIONS ====================

/**
 * Check if date is weekend (Fri-Sun) or holiday
 */
function istWochenende OderFeiertag(datumString) {
  const datum = new Date(datumString);
  const wochentag = datum.getDay(); // 0=Sunday, 5=Friday, 6=Saturday
  
  // Weekend = Friday(5), Saturday(6), Sunday(0)
  if (wochentag === 0 || wochentag === 5 || wochentag === 6) {
    return true;
  }
  
  // Check holidays
  return SCHWEIZER_FEIERTAGE_2026.includes(datumString);
}

/**
 * Get hours for time block
 */
function getStundenFuerBlock(zeitBlock) {
  if (zeitBlock === '4h') return 4;
  if (zeitBlock === '12h') return 12;
  return 24; // 24h
}

/**
 * Add hours to date and time
 */
function addStunden(datumString, zeitString, stunden) {
  const [jahr, monat, tag] = datumString.split('-');
  const [stunde, minute] = zeitString.split(':');
  const datum = new Date(jahr, monat - 1, tag, stunde, minute);
  datum.setHours(datum.getHours() + stunden);
  return datum;
}

/**
 * Format time as HH:MM
 */
function formatiereZeit(datum) {
  const stunde = String(datum.getHours()).padStart(2, '0');
  const minute = String(datum.getMinutes()).padStart(2, '0');
  return `${stunde}:${minute}`;
}

// ==================== PRICING FUNCTIONS ====================

/**
 * Calculate booking price based on rules
 * @export (makes function callable from frontend)
 */
export async function berechnePreis(zeitBlock, buchungsDatum, istMitglied, reinigung) {
  const istWochenende = istWochenende OderFeiertag(buchungsDatum);
  
  // Query pricing from database
  let query = wixData.query('Preise')
    .eq('zeitBlock', zeitBlock);
  
  // Add day filter for 12h and 24h blocks
  if (zeitBlock === '12h' || zeitBlock === '24h') {
    const tagLabel = istWochenende ? 'Fr–So + Feiertage' : 'Mo–Do';
    query = query.eq('tagLabel', tagLabel);
  }
  
  const ergebnis = await query.find();
  
  if (ergebnis.items.length === 0) {
    throw new Error('Preisregel nicht gefunden');
  }
  
  const preisRegel = ergebnis.items[0];
  const mietPreis = istMitglied ? preisRegel.mitgliedPreis : preisRegel.externPreis;
  const reinigungsPreis = reinigung ? REINIGUNGSPREIS : 0;
  
  return {
    mietPreis: mietPreis,
    reinigungsPreis: reinigungsPreis,
    gesamt: mietPreis + reinigungsPreis,
    kaution: KAUTION,
    istWochenende: istWochenende
  };
}

/**
 * Compare member vs external prices
 * @export
 */
export async function vergleichePreise(zeitBlock, buchungsDatum, reinigung) {
  const mitgliedPreis = await berechnePreis(zeitBlock, buchungsDatum, true, reinigung);
  const externPreis = await berechnePreis(zeitBlock, buchungsDatum, false, reinigung);
  
  return {
    mitglied: mitgliedPreis,
    extern: externPreis
  };
}

// ==================== VALIDATION FUNCTIONS ====================

/**
 * Check if booking date is valid (tomorrow to 3 months ahead)
 */
function pruefeValidierungDatum(buchungsDatum) {
  const buchung = new Date(buchungsDatum);
  const heute = new Date();
  heute.setHours(0, 0, 0, 0);
  
  const morgen = new Date(heute);
  morgen.setDate(morgen.getDate() + 1);
  
  const maxDatum = new Date(heute);
  maxDatum.setMonth(maxDatum.getMonth() + MAX_VORLAUFZEIT_MONATE);
  
  if (buchung < morgen) {
    return { gueltig: false, nachricht: 'Buchungen sind erst ab morgen möglich' };
  }
  if (buchung > maxDatum) {
    return { gueltig: false, nachricht: `Buchungen sind maximal ${MAX_VORLAUFZEIT_MONATE} Monate im Voraus möglich` };
  }
  return { gueltig: true };
}

/**
 * Check availability for time slot
 * @export
 */
export async function pruefeVerfuegbarkeit(buchungsDatum, startZeit, zeitBlock) {
  // Check date validity first
  const datumCheck = pruefeValidierungDatum(buchungsDatum);
  if (!datumCheck.gueltig) {
    return { verfuegbar: false, nachricht: datumCheck.nachricht };
  }
  
  // NEW: Block 4h time blocks on weekends (Friday-Sunday)
  if (zeitBlock === '4h') {
    const datum = new Date(buchungsDatum);
    const wochentag = datum.getDay(); // 0=Sunday, 5=Friday, 6=Saturday
    
    // Check if it's Friday (5), Saturday (6), or Sunday (0)
    if (wochentag === 0 || wochentag === 5 || wochentag === 6) {
      return { 
        verfuegbar: false, 
        nachricht: '4-Stunden-Buchungen sind nur von Montag bis Donnerstag möglich. Bitte wählen Sie 12h oder 24h für Wochenenden.' 
      };
    }
  }
  
  // Get existing bookings for this date
  const ergebnis = await wixData.query('Buchungen')
    .eq('buchungsDatum', buchungsDatum)
    .ne('status', 'storniert')
    .find();
  
  const vorhandeneBuchungen = ergebnis.items;
  
  // Calculate requested booking times
  const anfragStart = addStunden(buchungsDatum, startZeit, 0);
  const stunden = getStundenFuerBlock(zeitBlock);
  const anfragEnde = addStunden(buchungsDatum, startZeit, stunden);
  const anfragPufferEnde = addStunden(buchungsDatum, startZeit, stunden + PUFFERZEIT_STUNDEN);
  
  // Check for conflicts with existing bookings
  for (const buchung of vorhandeneBuchungen) {
    const vorhandStart = addStunden(buchung.buchungsDatum, buchung.startZeit, 0);
    const vorhandStunden = getStundenFuerBlock(buchung.zeitBlock);
    const vorhandEnde = addStunden(buchung.buchungsDatum, buchung.startZeit, vorhandStunden);
    const vorhandPufferEnde = addStunden(buchung.buchungsDatum, buchung.startZeit, vorhandStunden + PUFFERZEIT_STUNDEN);
    
    // Check overlap (including buffer)
    if (anfragStart < vorhandPufferEnde && anfragPufferEnde > vorhandStart) {
      return { 
        verfuegbar: false, 
        nachricht: `Konflikt mit bestehender Buchung um ${buchung.startZeit}` 
      };
    }
  }
  
  return { verfuegbar: true };
}

// ==================== BOOKING CREATION ====================

/**
 * Generate unique booking reference number
 */
async function generiereReferenzNummer() {
  const anzahl = await wixData.query('Buchungen').count();
  const jahr = new Date().getFullYear();
  const nummer = String(anzahl + 1).padStart(4, '0');
  return `RH-${jahr}-${nummer}`;
}

/**
 * Calculate end time
 */
function berechneEndZeit(buchungsDatum, startZeit, zeitBlock) {
  const stunden = getStundenFuerBlock(zeitBlock);
  const endDatum = addStunden(buchungsDatum, startZeit, stunden);
  return formatiereZeit(endDatum);
}

/**
 * Create booking for member
 * @export
 */
export async function erstelleBuchung(buchungsDaten, benutzerId) {
  // Check availability
  const verfuegbarkeitCheck = await pruefeVerfuegbarkeit(
    buchungsDaten.buchungsDatum,
    buchungsDaten.startZeit,
    buchungsDaten.zeitBlock
  );
  
  if (!verfuegbarkeitCheck.verfuegbar) {
    throw new Error(verfuegbarkeitCheck.nachricht);
  }
  
  // Get user info
  const benutzerErgebnis = await wixData.query('Mitglieder')
    .eq('mitgliedId', benutzerId)
    .find();
  
  if (benutzerErgebnis.items.length === 0) {
    throw new Error('Benutzer nicht gefunden');
  }
  
  const benutzer = benutzerErgebnis.items[0];
  
  // Calculate price
  const preis = await berechnePreis(
    buchungsDaten.zeitBlock,
    buchungsDaten.buchungsDatum,
    true, // always member
    buchungsDaten.reinigungZusatz || false
  );
  
  // Create booking document
  const buchung = {
    referenzNummer: await generiereReferenzNummer(),
    benutzerId: benutzer._id,
    benutzerName: benutzer.name,
    benutzerEmail: benutzer.email,
    buchungsDatum: buchungsDaten.buchungsDatum,
    startZeit: buchungsDaten.startZeit,
    endZeit: berechneEndZeit(buchungsDaten.buchungsDatum, buchungsDaten.startZeit, buchungsDaten.zeitBlock),
    zeitBlock: buchungsDaten.zeitBlock,
    veranstaltungsTyp: buchungsDaten.veranstaltungsTyp,
    erwarteteGaeste: buchungsDaten.erwarteteGaeste,
    reinigungZusatz: buchungsDaten.reinigungZusatz || false,
    spezialleWuensche: buchungsDaten.spezialleWuensche || '',
    mietPreis: preis.mietPreis,
    reinigungsPreis: preis.reinigungsPreis,
    gesamtPreis: preis.gesamt,
    kaution: KAUTION,
    istMitglied: true,
    istExtern: false,
    status: 'bestaetigt',
    zahlungsStatus: 'ausstehend',
    erstelltAm: new Date()
  };
  
  // Save to database
  const ergebnis = await wixData.insert('Buchungen', buchung);
  return ergebnis;
}

/**
 * Create booking for external user (non-member)
 * @export
 */
export async function erstelleExterneBuchung(buchungsDaten, kontaktInfo) {
  // Check availability
  const verfuegbarkeitCheck = await pruefeVerfuegbarkeit(
    buchungsDaten.buchungsDatum,
    buchungsDaten.startZeit,
    buchungsDaten.zeitBlock
  );
  
  if (!verfuegbarkeitCheck.verfuegbar) {
    throw new Error(verfuegbarkeitCheck.nachricht);
  }
  
  // Calculate price for external user
  const preis = await berechnePreis(
    buchungsDaten.zeitBlock,
    buchungsDaten.buchungsDatum,
    false, // not a member
    buchungsDaten.reinigungZusatz || false
  );
  
  // Create booking document
  const buchung = {
    referenzNummer: await generiereReferenzNummer(),
    benutzerId: 'extern',
    benutzerName: kontaktInfo.name,
    benutzerEmail: kontaktInfo.email,
    benutzerTelefon: kontaktInfo.telefon,
    buchungsDatum: buchungsDaten.buchungsDatum,
    startZeit: buchungsDaten.startZeit,
    endZeit: berechneEndZeit(buchungsDaten.buchungsDatum, buchungsDaten.startZeit, buchungsDaten.zeitBlock),
    zeitBlock: buchungsDaten.zeitBlock,
    veranstaltungsTyp: buchungsDaten.veranstaltungsTyp,
    erwarteteGaeste: buchungsDaten.erwarteteGaeste,
    reinigungZusatz: buchungsDaten.reinigungZusatz || false,
    spezialleWuensche: buchungsDaten.spezialleWuensche || '',
    mietPreis: preis.mietPreis,
    reinigungsPreis: preis.reinigungsPreis,
    gesamtPreis: preis.gesamt,
    kaution: KAUTION,
    istMitglied: false,
    istExtern: true,
    status: 'ausstehend', // Needs admin approval
    zahlungsStatus: 'ausstehend',
    erstelltAm: new Date()
  };
  
  // Save to database
  const ergebnis = await wixData.insert('Buchungen', buchung);
  return ergebnis;
}

// ==================== CALENDAR FUNCTIONS ====================

/**
 * Get bookings for a specific month
 * @export
 */
export async function getBuchungenFuerMonat(jahr, monat) {
  const startDatum = `${jahr}-${String(monat).padStart(2, '0')}-01`;
  
  let endDatum;
  if (monat === 12) {
    endDatum = `${jahr + 1}-01-01`;
  } else {
    endDatum = `${jahr}-${String(monat + 1).padStart(2, '0')}-01`;
  }
  
  const ergebnis = await wixData.query('Buchungen')
    .ge('buchungsDatum', startDatum)
    .lt('buchungsDatum', endDatum)
    .ne('status', 'storniert')
    .find();
  
  return ergebnis.items;
}
```

**✅ Save the file (Ctrl+S)**

---

### Step 3.3: Create Backend Module for Content

1. Create another file: `inhaltLogik.jsw`
2. Copy this code:

```javascript
// Filename: inhaltLogik.jsw (Backend)
// Purpose: Content management (events, blog, board members)

import wixData from 'wix-data';

/**
 * Get upcoming events
 * @export
 */
export async function getKommendeVeranstaltungen(limit = 10) {
  const heute = new Date();
  heute.setHours(0, 0, 0, 0);
  
  const ergebnis = await wixData.query('Veranstaltungen')
    .ge('datum', heute)
    .ascending('datum')
    .limit(limit)
    .find();
  
  return ergebnis.items;
}

/**
 * Get board members
 * @export
 */
export async function getVorstandsmitglieder() {
  const ergebnis = await wixData.query('Vorstandsmitglieder')
    .eq('istAktiv', true)
    .ascending('sortierung')
    .find();
  
  return ergebnis.items;
}

/**
 * Get blog posts
 * @export
 */
export async function getBlogPosts(limit = 10) {
  const ergebnis = await wixData.query('BlogPosts')
    .descending('erstelltAm')
    .limit(limit)
    .find();
  
  return ergebnis.items;
}

/**
 * Submit contact form
 * @export
 */
export async function sendeKontaktformular(name, email, betreff, nachricht) {
  const kontaktNachricht = {
    name: name,
    email: email,
    betreff: betreff,
    nachricht: nachricht,
    status: 'neu',
    erstelltAm: new Date()
  };
  
  await wixData.insert('Kontaktnachrichten', kontaktNachricht);
  return { erfolg: true, nachricht: 'Nachricht gesendet. Wir melden uns bald!' };
}

/**
 * Newsletter subscription
 * @export
 */
export async function abonniereNewsletter(email) {
  // Check if already subscribed
  const vorhandene = await wixData.query('Newsletter')
    .eq('email', email)
    .find();
  
  if (vorhandene.items.length > 0) {
    return { erfolg: true, nachricht: 'Bereits angemeldet' };
  }
  
  await wixData.insert('Newsletter', {
    email: email,
    angemeldetAm: new Date()
  });
  
  return { erfolg: true, nachricht: 'Erfolgreich angemeldet!' };
}
```

**✅ Save the file**

---

## 4. Frontend/UI Implementation

### Step 4.1: Create Page Structure

You need these pages:

1. **Homepage** (`/`)
2. **Über uns** (`/ueber-uns`)
3. **Aktuell** (`/aktuell`) - Events
4. **Robihütte** (`/robihuette`) - Booking info
5. **Robihütte buchen** (`/robihuette-buchen`) - Booking form
6. **Blog** (`/blog`)
7. **Kontakt** (`/kontakt`)

**How to create pages:**

1. Click **"Pages & Menu"** (pages icon on left sidebar)
2. Click **"Add Page"** (+)
3. Choose **"Blank Page"**
4. Name it (e.g., "Robihütte")
5. Set URL (e.g., `/robihuette`)
6. Repeat for all pages

---

### Step 4.2: Design Header & Navigation

**Current Design from React App:**
- Logo: EVO Logo (mobile version)
- Navigation: Start | Über uns | Aktuell | Robihütte | Blog | Kontakt
- Right side: "Anmelden" button + "Mitglied werden" button

**How to implement:**

1. **Add Header:**
   - Click **"Add"** (+) → **"Header & Footer"** → **"Header"**
   - Choose **"Sticky Header"** template

2. **Add Logo:**
   - Upload EVO logo image: Click **"Add"** → **"Image"** → **"Upload Image"**
   - Drag to header
   - Resize to height: 40-50px

3. **Add Navigation Menu:**
   - Click **"Add"** → **"Menu & Anchor"** → **"Horizontal Menu"**
   - Drag to header (center)
   - Click menu → **"Manage Menu"**
   - Add links: Start, Über uns, Aktuell, Robihütte, Blog, Kontakt

4. **Add Login Bar:**
   - Already added in Step 1.3
   - Customize text: Click Login Bar → **"Settings"** → Change to German labels

5. **Style Header:**
   - Click header background → **"Change Header Design"**
   - Background: White (`#FFFFFF`)
   - Height: 70px
   - Add bottom border: 1px solid `#E5E7EB`

**Header CSS (for advanced styling):**

If you want custom hover effects, click any element → **"Advanced Settings"** → **"Custom CSS":

```css
/* Navigation hover effect */
#menu a {
  transition: color 0.3s ease;
}

#menu a:hover {
  color: #F59E0B; /* Orange */
}
```

---

### Step 4.3: Typography & Fonts

**Current fonts from React:**
- Headings: Bold, large
- Body: Regular

**How to set:**

1. Click **"Site Design"** → **"Site Colors & Fonts"**
2. **Headings:**
   - Font: Choose modern sans-serif (e.g., "Open Sans", "Roboto")
   - Size: 
     - H1: 48px (mobile: 36px)
     - H2: 24px (mobile: 18px)
   - Weight: Bold (700)
   - Color: `#111827` (dark gray)

3. **Body Text:**
   - Font: Same as headings or "Inter"
   - Size: 16px
   - Weight: Regular (400)
   - Color: `#6B7280` (medium gray)

---

### Step 4.4: Homepage Design

**Sections to create:**

1. **Hero Section**
2. **About Teaser**
3. **Events Preview** (next 3 events)
4. **Robihütte Teaser**
5. **Board Members**
6. **Newsletter Signup**
7. **Footer**

#### Hero Section

1. **Add Strip (full-width section):**
   - Click **"Add"** → **"Strip"** → Drag to top of page
   - Height: 500px (desktop), 400px (mobile)

2. **Add Background Image:**
   - Click strip → **"Change Strip Background"** → **"Image"**
   - Upload hero image (family/children photo)
   - Image position: **"Fill"** with overlay

3. **Add Overlay:**
   - Strip settings → **"Color Overlay"**
   - Color: Black `#000000`
   - Opacity: 30%

4. **Add Text:**
   - Click **"Add"** → **"Text"** → **"Add Text"**
   - Type: "WILLKOMMEN BEI DER"
   - Font size: 14px
   - Color: `#F59E0B` (orange/gold)
   - Letter spacing: 2px

5. **Add Main Heading:**
   - Add another text element
   - Type: "Elternvereinigung\nOberglatt"
   - Font size: 56px (mobile: 36px)
   - Color: White `#FFFFFF`
   - Bold weight
   - **Make "Oberglatt" orange:** Highlight word → Change color to `#F59E0B`

6. **Add Subtitle:**
   - Add text
   - Type: "Gemeinschaft von Eltern für Kinder in Oberglatt..."
   - Font size: 18px
   - Color: White with slight transparency

7. **Add Buttons:**
   - Click **"Add"** → **"Button"**
   - Text: "Mitglied werden"
   - Link to: `/mitglied-werden` page
   - Button design:
     - Background: `#F59E0B` (orange)
     - Text: White
     - Padding: 12px 32px
     - Border radius: 8px
     - **Hover effect:** Background becomes darker (`#D97706`)

   - Add second button: "Robihütte mieten"
   - Design: Transparent with white border
   - Hover: White background, orange text

**Button Hover Effect (Custom CSS):**

```css
#button1 {
  transition: all 0.3s ease;
}

#button1:hover {
  background-color: #D97706;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

---

#### Events Preview Section

1. **Add Section:**
   - Add Strip, height: auto
   - Background: Light gray `#F9FAFB`
   - Padding: 60px top/bottom

2. **Add Heading:**
   - Text: "Kommende Veranstaltungen"
   - Size: 32px
   - Center aligned

3. **Add Repeater (for dynamic events):**
   - Click **"Add"** → **"Lists & Grids"** → **"Repeater"**
   - Layout: **"Grid"** (3 columns)
   - Connect to database:
     - Click repeater → **"Connect to Data"**
     - Dataset: **"Veranstaltungen"**
     - Mode: **"Read-only"**
     - Filter: `datum` greater than or equal to today
     - Sort: `datum` ascending
     - Limit: 3

4. **Design Event Card:**
   - Inside repeater, add:
     - **Image**: Connect to `bild` field
     - **Date badge** (text): Connect to `datum` field
     - **Title** (text): Connect to `titel` field
     - **Time** (text + icon): Connect to `uhrzeit` field
     - **Location** (text + icon): Connect to `ort` field

5. **Card Styling:**
   - Background: White
   - Border radius: 16px
   - Box shadow: `0 1px 3px rgba(0,0,0,0.1)`
   - Padding: 16px
   - **Hover effect:** Shadow increases

```css
.event-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}
```

---

#### Pricing Cards (Robihütte Page)

This is crucial! The pricing display must match your current design **and only show member prices to logged-in users**.

1. **Add Repeater:**
   - Connect to **"Preise"** collection
   - Display all 5 items

2. **Card Layout (for each price option):**
   - Border: 2px solid `#E5E7EB` (gray)
   - Border radius: 12px
   - Padding: 16px
   - **For member price:** Border color `#10B981` (green) when logged in
   - **For external price:** Border color `#F59E0B` (orange)

3. **Inside Each Card:**
   - **Time block label:** Connect to `label` (e.g., "4 Stunden")
   - **Day label:** Connect to `tagLabel` (e.g., "Mo–Do" for 4h)
   - **Member price (conditional):** 
     - Only show if user is logged in
     - Text: "CHF" + `mitgliedPreis` field
     - Color: Green `#10B981`
     - Size: 24px, bold
   - **External price:**
     - Always visible
     - Text: "CHF" + `externPreis` field
     - Color: Orange `#F59E0B`
     - Size: 20px

4. **Conditional Display Code:**

```javascript
import wixUsers from 'wix-users';

$w.onReady(async function () {
  const istAngemeldet = wixUsers.currentUser.loggedIn;
  
  // Set up repeater
  $w('#pricingRepeater').onItemReady(($item, itemData) => {
    // Always show external price
    $item('#externalPrice').text = `CHF ${itemData.externPreis}`;
    
    // Only show member price if logged in
    if (istAngemeldet) {
      $item('#memberPrice').text = `CHF ${itemData.mitgliedPreis}`;
      $item('#memberPrice').show();
      $item('#memberLabel').show();
    } else {
      $item('#memberPrice').hide();
      $item('#memberLabel').hide();
      $item('#loginPrompt').text = 'Mitglieder erhalten reduzierte Preise';
      $item('#loginPrompt').show();
    }
  });
});
```

5. **Two-column layout (when logged in):**
   - Left column: "Mitglieder" header + member prices (green)
   - Right column: "Externe" header + external prices (orange)

6. **Single-column layout (when not logged in):**
   - Only show external prices
   - Display message: "Bitte anmelden um Mitgliederpreise zu sehen"

---

### Step 4.5: Footer Design

1. **Add Footer:**
   - Click **"Add"** → **"Header & Footer"** → **"Footer"**

2. **Footer Content (3 columns):**

   **Column 1: About**
   - Logo
   - Short description
   - Social media icons

   **Column 2: Quick Links**
   - Über uns
   - Aktuell
   - Robihütte
   - Kontakt

   **Column 3: Contact**
   - Email: info@elternvereinigung.ch
   - Phone: (add if available)
   - Address

3. **Footer Styling:**
   - Background: Dark gray `#1F2937`
   - Text color: Light gray `#D1D5DB`
   - Links hover: Orange `#F59E0B`
   - Padding: 40px top/bottom

4. **Bottom Bar:**
   - Copyright text: "© 2026 Elternvereinigung Oberglatt"
   - Links: Impressum | Datenschutz | AGB
   - Background: Darker gray `#111827`

---

## 5. Authentication System

Wix Members handles most authentication automatically, but you need to connect it to your custom database.

### Step 5.1: Sync Wix Members with Mitglieder Collection

When a user registers, automatically create a record in `Mitglieder` collection.

1. Create a new file: `mitgliederSync.js` (Page code)
2. Add to **Site Code** (runs on every page):

**Location:** Click **"Public & Backend"** folder → **"Site"** tab → `site.js` file

```javascript
// Filename: site.js (Site-wide code)
// Purpose: Sync Wix Members with Mitglieder collection

import wixUsers from 'wix-users';
import wixData from 'wix-data';

// Run when site loads
$w.onReady(function () {
  // Check if user is logged in
  if (wixUsers.currentUser.loggedIn) {
    syncMitglied();
  }
});

// Sync current user with Mitglieder collection
async function syncMitglied() {
  const benutzer = wixUsers.currentUser;
  const mitgliedId = benutzer.id;
  
  // Check if user already exists in Mitglieder
  const ergebnis = await wixData.query('Mitglieder')
    .eq('mitgliedId', mitgliedId)
    .find();
  
  if (ergebnis.items.length === 0) {
    // User doesn't exist, create new record
    const neuesMitglied = {
      mitgliedId: mitgliedId,
      name: await benutzer.getEmail(), // or fetch from profile
      email: await benutzer.getEmail(),
      istMitglied: true,
      erstelltAm: new Date()
    };
    
    await wixData.insert('Mitglieder', neuesMitglied);
    console.log('Neues Mitglied erstellt:', mitgliedId);
  }
}
```

**✅ Save file**

---

### Step 5.2: Registration Flow

Wix handles registration automatically with the Login Bar. But you need to customize it to collect family information:

1. **Customize Registration Form:**
   - Click **Login Bar** → **Settings** → **"Sign Up & Login"**
   - Click **"Customize Sign Up Form"**
   - Add custom fields:
     - **Adresse** (Text, Required)
     - **Postleitzahl** (Text, Required)
     - **Ort** (Text, Required)
     - **Mobil** (Phone, Required)
     - **Name Kind 1** (Text, Optional)
     - **Geburtstag Kind 1** (Date, Optional)
     - **Name Kind 2** (Text, Optional)
     - **Geburtstag Kind 2** (Date, Optional)
     - **Name Kind 3** (Text, Optional)
     - **Geburtstag Kind 3** (Date, Optional)

2. **Map to Mitglieder Collection:**
   
After registration, sync data to Mitglieder collection in `site.js`:

```javascript
// Filename: site.js (Site-wide code)
import wixUsers from 'wix-users';
import wixData from 'wix-data';

$w.onReady(function () {
  if (wixUsers.currentUser.loggedIn) {
    syncMitgliedWithFamilyData();
  }
});

async function syncMitgliedWithFamilyData() {
  const benutzer = wixUsers.currentUser;
  const mitgliedId = benutzer.id;
  
  // Get user profile data
  const profile = await benutzer.getProfile();
  
  // Check if user already exists in Mitglieder
  const ergebnis = await wixData.query('Mitglieder')
    .eq('mitgliedId', mitgliedId)
    .find();
  
  if (ergebnis.items.length === 0) {
    // Create new member record with family data
    const neuesMitglied = {
      mitgliedId: mitgliedId,
      name: profile.name || await benutzer.getEmail(),
      email: await benutzer.getEmail(),
      adresse: profile.customFields.adresse || '',
      postleitzahl: profile.customFields.postleitzahl || '',
      ort: profile.customFields.ort || '',
      mobil: profile.customFields.mobil || '',
      telefon: profile.phone || null,
      // Children data (optional)
      nameKind1: profile.customFields.nameKind1 || null,
      geburtsdatumKind1: profile.customFields.geburtsdatumKind1 || null,
      nameKind2: profile.customFields.nameKind2 || null,
      geburtsdatumKind2: profile.customFields.geburtsdatumKind2 || null,
      nameKind3: profile.customFields.nameKind3 || null,
      geburtsdatumKind3: profile.customFields.geburtsdatumKind3 || null,
      istMitglied: true,
      erstelltAm: new Date()
    };
    
    await wixData.insert('Mitglieder', neuesMitglied);
    console.log('Neues Mitglied mit Familiendaten erstellt:', mitgliedId);
  }
}
```

3. **Registration Confirmation Email:**
   - Go to **"Settings"** → **"Members & Badges"** → **"Email Settings"**
   - Customize welcome email text (in German)
   - Include confirmation of family data received

---

### Step 5.3: Login Flow

Login is automatic with Wix Members. After login:

1. User is redirected to homepage or their profile
2. `site.js` automatically syncs them with `Mitglieder` collection
3. Login Bar shows **"Mein Konto"** instead of **"Anmelden"**

---

### Step 5.4: Logout Flow

1. **Logout Button:**
   - Already provided by Login Bar
   - Click profile icon → **"Abmelden"**

2. **Custom Logout Button (optional):**

```javascript
// Add to any page where you want custom logout
import wixUsers from 'wix-users';

$w('#logoutButton').onClick(() => {
  wixUsers.logout();
});
```

---

## 6. Booking System

This is the most complex part! The booking calendar and flow.

### Step 6.1: Create Booking Page (`/robihuette-buchen`)

**Page Structure:**

1. **Step 1: Date Selection (Calendar)**
2. **Step 2: Time Block Selection**
3. **Step 3: Booking Details**
4. **Step 4: Review & Payment**

---

### Step 6.2: Calendar Implementation

**Option A: Use Wix Bookings App (Easiest)**

1. Click **"Add"** → **"App Market"**
2. Search **"Wix Bookings"**
3. Install **Wix Bookings** app
4. Configure:
   - Service: "Robihütte mieten"
   - Duration: Variable (4h, 12h, 24h)
   - Availability: Connect to `Buchungen` collection

**Option B: Custom Calendar (More Control)**

Use a custom calendar repeater:

1. **Add Month Display:**
   - Show month/year header
   - Previous/Next month buttons

2. **Add Calendar Grid (Repeater):**
   - 7 columns (Mon-Sun)
   - Connect to custom code that generates date objects

3. **Page Code for Calendar:**

```javascript
// Filename: RobihütteBuchen.js (Page code)
// Purpose: Booking calendar and form

import { getBuchungenFuerMonat } from 'backend/buchungsLogik';
import wixUsers from 'wix-users';

let aktuellerMonat = new Date().getMonth() + 1;
let aktuellesJahr = new Date().getFullYear();
let ausgewaehltesDatum = null;

$w.onReady(function () {
  ladeKalender();
});

// Load calendar for current month
async function ladeKalender() {
  const buchungen = await getBuchungenFuerMonat(aktuellesJahr, aktuellerMonat);
  
  // Update month/year display
  $w('#monthYearText').text = `${getMonatsName(aktuellerMonat)} ${aktuellesJahr}`;
  
  // Generate calendar days
  const tage = generiereKalenderTage(aktuellesJahr, aktuellerMonat);
  
  // Mark booked days
  tage.forEach(tag => {
    const tagBuchungen = buchungen.filter(b => b.buchungsDatum === tag.datum);
    if (tagBuchungen.length > 0) {
      tag.status = 'gebucht'; // Red
    } else if (istVergangenheit(tag.datum)) {
      tag.status = 'vergangen'; // Gray
    } else {
      tag.status = 'frei'; // Green
    }
  });
  
  // Populate repeater
  $w('#calendarRepeater').data = tage;
  
  // Set up click handlers
  $w('#calendarRepeater').onItemReady(($item, itemData) => {
    $item('#dayButton').onClick(() => {
      tagGewaehlt(itemData.datum);
    });
    
    // Color coding
    if (itemData.status === 'gebucht') {
      $item('#dayButton').style.backgroundColor = '#FEE2E2'; // Light red
      $item('#dayButton').style.color = '#DC2626'; // Red text
    } else if (itemData.status === 'vergangen') {
      $item('#dayButton').style.backgroundColor = '#F3F4F6'; // Gray
      $item('#dayButton').disable();
    } else {
      $item('#dayButton').style.backgroundColor = '#D1FAE5'; // Light green
      $item('#dayButton').style.color = '#059669'; // Green text
    }
  });
}

// Generate calendar days
function generiereKalenderTage(jahr, monat) {
  const tage = [];
  const anzahlTage = new Date(jahr, monat, 0).getDate();
  
  for (let tag = 1; tag <= anzahlTage; tag++) {
    const datum = `${jahr}-${String(monat).padStart(2, '0')}-${String(tag).padStart(2, '0')}`;
    tage.push({
      _id: datum,
      tag: tag,
      datum: datum,
      status: 'frei'
    });
  }
  
  return tage;
}

// Handle day selection
function tagGewaehlt(datum) {
  ausgewaehltesDatum = datum;
  console.log('Datum gewählt:', datum);
  
  // Show time block selection
  $w('#timeBlockSection').expand();
  $w('#timeBlockSection').scrollTo();
}

// Month navigation
$w('#prevMonthButton').onClick(() => {
  aktuellerMonat--;
  if (aktuellerMonat < 1) {
    aktuellerMonat = 12;
    aktuellesJahr--;
  }
  ladeKalender();
});

$w('#nextMonthButton').onClick(() => {
  aktuellerMonat++;
  if (aktuellerMonat > 12) {
    aktuellerMonat = 1;
    aktuellesJahr++;
  }
  ladeKalender();
});

// Helper functions
function getMonatsName(monat) {
  const namen = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 
                 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  return namen[monat - 1];
}

function istVergangenheit(datum) {
  const heute = new Date();
  heute.setHours(0, 0, 0, 0);
  return new Date(datum) < heute;
}
```

---

### Step 6.3: Time Block Selection

After user selects a date, show time block options **with weekend restrictions**:

```javascript
// Add time block buttons with weekend logic
import { vergleichePreise } from 'backend/buchungsLogik';
import wixUsers from 'wix-users';

let ausgewaehlterBlock = null;

$w.onReady(function () {
  setupZeitblockButtons();
});

async function setupZeitblockButtons() {
  // Check if selected date is weekend
  const selectedDate = new Date(ausgewaehltesDatum);
  const dayOfWeek = selectedDate.getDay();
  const isWeekend = (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6);
  
  // Hide or disable 4h button on weekends
  if (isWeekend) {
    $w('#block4h').hide(); // Hide 4h option on weekends
    $w('#weekendNotice').text = 'An Wochenenden (Fr-So) sind nur 12h und 24h Buchungen möglich.';
    $w('#weekendNotice').show();
  } else {
    $w('#block4h').show(); // Show 4h option on weekdays
    $w('#weekendNotice').hide();
  }
  
  // 4h button (Monday-Thursday only)
  $w('#block4h').onClick(async () => {
    ausgewaehlterBlock = '4h';
    await zeigePreise('4h');
  });
  
  // 12h button (all days)
  $w('#block12h').onClick(async () => {
    ausgewaehlterBlock = '12h';
    await zeigePreise('12h');
  });
  
  // 24h button (all days)
  $w('#block24h').onClick(async () => {
    ausgewaehlterBlock = '24h';
    await zeigePreise('24h');
  });
}

async function zeigePreise(zeitBlock) {
  if (!ausgewaehltesDatum) {
    $w('#errorText').text = 'Bitte wählen Sie zuerst ein Datum';
    return;
  }
  
  // Get pricing - will return member prices only if logged in
  const preise = await vergleichePreise(zeitBlock, ausgewaehltesDatum, false);
  
  // Check if user is logged in
  const istAngemeldet = wixUsers.currentUser.loggedIn;
  
  if (istAngemeldet && preise.mitglied) {
    // Show member price (user is logged in)
    $w('#priceText').text = `CHF ${preise.mitglied.gesamt}`;
    $w('#priceLabel').text = 'Mitgliederpreis';
    $w('#priceLabel').style.color = '#10B981'; // Green
    $w('#externPriceHint').text = `(Externe: CHF ${preise.extern.gesamt})`;
    $w('#externPriceHint').show();
  } else {
    // Show only external price (not logged in)
    $w('#priceText').text = `CHF ${preise.extern.gesamt}`;
    $w('#priceLabel').text = 'Preis';
    $w('#priceLabel').style.color = '#F59E0B'; // Orange
    $w('#loginHint').text = 'Mitglieder erhalten reduzierte Preise - bitte anmelden';
    $w('#loginHint').show();
    $w('#externPriceHint').hide();
  }
  
  // Show booking form
  $w('#bookingFormSection').expand();
}
```

---

### Step 6.4: Booking Form

Create a form with these fields:

1. **Event Type** (dropdown)
   - Options: Geburtstag, Familienfeier, Vereinsanlass, Firmenanlass

2. **Expected Guests** (number input)

3. **Cleaning Addon** (checkbox)

4. **Special Requests** (textarea)

5. **Submit Button:** "Jetzt buchen"

**Form Submission:**

```javascript
import { erstelleBuchung, erstelleExterneBuchung, pruefeVerfuegbarkeit } from 'backend/buchungsLogik';
import wixPay from 'wix-pay-backend';

$w('#submitBookingButton').onClick(async () => {
  // Validate form
  if (!ausgewaehltesDatum || !ausgewaehlterBlock) {
    $w('#errorText').text = 'Bitte füllen Sie alle Felder aus';
    return;
  }
  
  const veranstaltungsTyp = $w('#eventTypeDropdown').value;
  const erwarteteGaeste = $w('#guestCountInput').value;
  const reinigungZusatz = $w('#cleaningCheckbox').checked;
  const spezialleWuensche = $w('#specialRequestsTextarea').value;
  const startZeit = $w('#startTimeDropdown').value; // Add dropdown for start time
  
  // Check availability one more time
  const verfuegbar = await pruefeVerfuegbarkeit(ausgewaehltesDatum, startZeit, ausgewaehlterBlock);
  if (!verfuegbar.verfuegbar) {
    $w('#errorText').text = verfuegbar.nachricht;
    return;
  }
  
  const buchungsDaten = {
    buchungsDatum: ausgewaehltesDatum,
    startZeit: startZeit,
    zeitBlock: ausgewaehlterBlock,
    veranstaltungsTyp: veranstaltungsTyp,
    erwarteteGaeste: parseInt(erwarteteGaeste),
    reinigungZusatz: reinigungZusatz,
    spezialleWuensche: spezialleWuensche
  };
  
  try {
    let buchung;
    
    if (wixUsers.currentUser.loggedIn) {
      // Member booking
      const benutzerId = wixUsers.currentUser.id;
      buchung = await erstelleBuchung(buchungsDaten, benutzerId);
    } else {
      // External booking - need contact info
      const name = $w('#nameInput').value;
      const email = $w('#emailInput').value;
      const telefon = $w('#phoneInput').value;
      
      buchung = await erstelleExterneBuchung(buchungsDaten, { name, email, telefon });
    }
    
    // Proceed to payment
    initiatePayment(buchung);
    
  } catch (error) {
    $w('#errorText').text = error.message;
  }
});
```

---

## 7. Payment Integration

### Step 7.1: Setup Wix Payments

1. Go to **"Settings"** → **"Accept Payments"**
2. Click **"Get Started with Wix Payments"**
3. Follow setup wizard:
   - Business info
   - Bank account (Swiss account)
   - Verification documents
4. Enable payment methods: Credit Card, Debit Card

### Step 7.2: Payment Flow

```javascript
import wixPay from 'wix-pay-backend';

async function initiatePayment(buchung) {
  // Create payment object
  const payment = {
    items: [
      {
        name: `Robihütte - ${buchung.zeitBlock}`,
        price: buchung.mietPreis,
        quantity: 1
      }
    ],
    amount: buchung.gesamtPreis,
    currency: 'CHF',
    description: `Buchung ${buchung.referenzNummer}`
  };
  
  if (buchung.reinigungZusatz) {
    payment.items.push({
      name: 'Reinigung',
      price: buchung.reinigungsPreis,
      quantity: 1
    });
  }
  
  // Start payment
  const paymentResult = await wixPay.startPayment(payment.amount, {
    paymentInfo: {
      items: payment.items,
      description: payment.description
    }
  });
  
  if (paymentResult.status === 'Approved') {
    // Update booking status
    await wixData.update('Buchungen', {
      _id: buchung._id,
      zahlungsStatus: 'bezahlt'
    });
    
    // Show success message
    $w('#successBox').expand();
    $w('#successText').text = `Buchung erfolgreich! Referenz: ${buchung.referenzNummer}`;
    
    // Send confirmation email
    sendeBestaetigung(buchung);
  }
}
```

---

## 8. Email Notifications

### Step 8.1: Setup Triggered Emails

1. Go to **"Settings"** → **"Automations"**
2. Click **"New Automation"**
3. Choose trigger: **"Item Added to Collection"**
4. Select collection: **"Buchungen"**
5. Action: **"Send Email"**

**Email Template:**

**Subject:** `Buchungsbestätigung - Robihütte ({{item.referenzNummer}})`

**Body:**

```
Hallo {{item.benutzerName}},

Ihre Buchung für die Robihütte wurde bestätigt!

**Buchungsdetails:**
- Referenznummer: {{item.referenzNummer}}
- Datum: {{item.buchungsDatum}}
- Zeit: {{item.startZeit}} - {{item.endZeit}}
- Zeitblock: {{item.zeitBlock}}
- Veranstaltungstyp: {{item.veranstaltungsTyp}}

**Kosten:**
- Miete: CHF {{item.mietPreis}}
- Reinigung: CHF {{item.reinigungsPreis}}
- **Gesamt: CHF {{item.gesamtPreis}}**
- Kaution (bar bei Schlüsselübergabe): CHF {{item.kaution}}

**Wichtige Informationen:**
- Bitte bringen Sie die Kaution von CHF 250 in bar zur Schlüsselübergabe mit
- Weitere Details erhalten Sie 24 Stunden vor der Buchung

Bei Fragen kontaktieren Sie uns: info@elternvereinigung.ch

Herzliche Grüsse,
Elternvereinigung Oberglatt
```

---

### Step 8.2: Admin Notification

Create another automation:
- Trigger: Item added to **Buchungen**
- Action: Send email to **info@elternvereinigung.ch**
- Template: "Neue Buchung eingegangen"

---

## 9. Testing & Launch

### Step 9.1: Testing Checklist

**Test on Wix Preview:**

1. Click **"Preview"** button (top right)
2. Test on **Desktop**, **Tablet**, **Mobile**

**Test Features:**

- [ ] Homepage loads with events
- [ ] Navigation menu works
- [ ] Login/Register flow
- [ ] Logout
- [ ] Calendar displays correctly
- [ ] Date selection works
- [ ] Price calculation (4h, 12h, 24h)
- [ ] Member vs External pricing
- [ ] Booking form submission
- [ ] Payment flow (use test mode)
- [ ] Confirmation email received
- [ ] Admin notification received
- [ ] Mobile responsiveness
- [ ] All links work

### Step 9.2: Publish Site

1. Click **"Publish"** button (top right)
2. Confirm domain: **elternvereinigung.ch**
3. Click **"Publish Now"**

**⏱ Publishing takes 2-5 minutes**

---

### Step 9.3: Connect Domain

1. Go to your domain provider (Hostpoint)
2. Update DNS records:
   - **A Record:** Point to Wix IP (provided in Wix domain settings)
   - **CNAME:** www points to Wix
3. Wait 24-48 hours for DNS propagation

---

## 🎯 Summary Checklist

**✅ Setup (Day 1)**
- [x] Create Wix site
- [x] Enable Velo
- [x] Enable Wix Members
- [x] Upgrade to Premium

**✅ Database (Day 1)**
- [x] Create 8 collections
- [x] Set permissions
- [x] Pre-populate pricing

**✅ Backend (Day 2)**
- [x] Create `buchungsLogik.jsw`
- [x] Create `inhaltLogik.jsw`
- [x] Test functions in console

**✅ Frontend (Day 3-4)**
- [x] Create all pages
- [x] Design header/nav
- [x] Build homepage
- [x] Build Robihütte page
- [x] Build booking page with calendar
- [x] Style all elements

**✅ Features (Day 5)**
- [x] Authentication sync
- [x] Booking form
- [x] Payment integration
- [x] Email notifications

**✅ Testing (Day 6)**
- [x] Test all features
- [x] Mobile testing
- [x] Payment testing

**✅ Launch (Day 7)**
- [x] Publish site
- [x] Connect domain
- [x] Monitor for issues

---

## 🆘 Troubleshooting

**Problem: Collection not showing in code**
- Solution: Make sure collection permissions are set correctly
- Check: CMS → Collection → Permissions → "What can site members do?"

**Problem: Payment not working**
- Solution: Ensure Wix Payments is fully verified
- Check: Settings → Accept Payments → Status

**Problem: Emails not sending**
- Solution: Check automation is enabled
- Check: Settings → Automations → Status

**Problem: Calendar dates wrong**
- Solution: Check date format (YYYY-MM-DD)
- Validate timezone in collection settings

---

## 📚 Additional Resources

**Wix Documentation:**
- Velo API Reference: https://www.wix.com/velo/reference/api-overview
- Wix Data: https://www.wix.com/velo/reference/wix-data
- Wix Members: https://www.wix.com/velo/reference/wix-members
- Wix Pay: https://www.wix.com/velo/reference/wix-pay

**Community:**
- Wix Forum: https://www.wix.com/forum/
- Velo Examples: https://www.wix.com/velo/examples

---

## ✅ Next Steps After Migration

**Future Enhancements:**

1. **Admin Dashboard:**
   - Create admin page to manage bookings
   - Approve/reject external bookings
   - View all bookings in calendar

2. **Email Reminders:**
   - Send reminder 24h before booking
   - Send follow-up after event

3. **Waitlist:**
   - Allow users to join waitlist for full days

4. **Advanced Reporting:**
   - Revenue reports
   - Booking statistics
   - Member analytics

---

## 🆕 Recent Feature Updates (December 2025)

**Three major features have been added to this guide:**

### 1. Enhanced Family Registration
- ✅ Required fields: Adresse, Postleitzahl, Ort, Mobil
- ✅ Optional fields: Up to 3 children (Name + Birthday each)
- ✅ One data set per family

### 2. Weekend Booking Restrictions
- ✅ 4-hour blocks now **blocked for Friday-Sunday**
- ✅ Only 12h and 24h blocks available on weekends
- ✅ Clear error message in German

### 3. Member Price Visibility
- ✅ Member prices **only shown to logged-in users**
- ✅ Non-logged-in users see only external prices
- ✅ Login prompt displayed for guests

**All code examples in this guide have been updated to include these features.**

---

**🎉 Congratulations! Your Wix site is now ready!**

If you encounter any issues during migration, refer to:
- This guide
- Wix Support: support@wix.com
- Velo Community Forum

**Good luck with your migration! 🚀**
