# 📸 Homepage Visual Assets - EVO Elternvereinigung Oberglatt

**Purpose:** Complete visual asset package for Wix migration  
**Location:** `/app/assets/homepage/`  
**Date Extracted:** December 2025  
**Total Assets:** 6 images  

---

## 📁 Asset Inventory

### 1. **Logo / Branding**

#### **logo_evo_mobile.jpg**
- **File Size:** 87 KB
- **Dimensions:** Original EVO logo (mobile optimized)
- **Usage:** 
  - Header navigation (top-left)
  - Footer branding
- **Wix Implementation:**
  - Upload to **Site → Media Manager**
  - Add to **Header** as logo image
  - Add to **Footer** in branding section
- **Design Specs:**
  - Height: 40-50px (header)
  - Height: 48px (footer)
  - Background: White or transparent
  - Border radius: 8px (optional rounded corners)
- **Original URL:** `https://customer-assets.emergentagent.com/job_elternverein-og/artifacts/io84x5w7_Logo_EVO_Neu_mobile.jpg`

---

### 2. **Hero Section**

#### **hero_background_familie.jpg**
- **File Size:** 291 KB
- **Dimensions:** 1920px width (high resolution)
- **Usage:** 
  - Homepage hero section background (full-width, 90vh height)
- **Wix Implementation:**
  - Upload to **Media Manager**
  - Set as **Strip Background** for hero section
  - Position: **Fill** (cover entire area)
  - Add **Color Overlay:**
    - Gradient: Left to right
    - From: `rgba(17, 24, 39, 0.8)` (dark gray 80% opacity)
    - Via: `rgba(17, 24, 39, 0.6)` (60% opacity)
    - To: Transparent
- **Content on This Image:**
  - "WILLKOMMEN BEI DER" (small text, amber)
  - "Elternvereinigung Oberglatt" (large heading, white + amber for "Oberglatt")
  - Subtitle text
  - 2 CTA buttons ("Mitglied werden" + "Robihütte mieten")
- **Design Notes:**
  - Image shows happy family/children
  - Warm, welcoming atmosphere
  - High contrast for text readability
- **Original URL:** `https://images.unsplash.com/photo-1609220136736-443140cffec6?w=1920&q=80`
- **Unsplash Credit:** Photo by Unsplash (family scene)

---

### 3. **Robihütte Section**

#### **robihuette_exterior.jpg**
- **File Size:** 1.1 MB
- **Dimensions:** 1920px width (high resolution)
- **Usage:** 
  - Homepage "Robihütte Teaser" section image
  - Also used as hero background on `/robihuette` page
- **Wix Implementation:**
  - Upload to **Media Manager**
  - Add to **Image** element in Robihütte teaser section
  - Image dimensions: 800px width × 400px height
  - Border radius: 16px
  - Box shadow: Large (xl)
  - **Additional Design Element:**
    - Overlay price badge (bottom-right, offset -24px)
    - Badge: Amber background (#F59E0B)
    - Text: "CHF 80" (large) + "ab / 4 Stunden" (small)
- **Design Notes:**
  - Image shows cozy cabin/house exterior
  - Natural wood or rustic building
  - Inviting atmosphere for events
- **Original URL:** `https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1920&q=80`
- **Unsplash Credit:** Photo by Unsplash (cabin/house exterior)

---

### 4. **Team Members (Board / Vorstand)**

#### **team_member_1.jpg** (Dominique Knöpfli - Präsidentin)
- **File Size:** 26 KB
- **Dimensions:** 300px × 300px
- **Usage:** Board member profile photo
- **Wix Implementation:**
  - Upload to **Media Manager**
  - Add to **Repeater** item for board members
  - Display as **circular** image (border-radius: 50%)
  - Dimensions: 96px × 96px
  - Ring border: 4px solid amber-100 (#FEF3C7)
- **Associated Text:**
  - Name: Dominique Knöpfli
  - Role: Präsidentin
  - Email: dominique.knoepfli@elternvereinigung.ch
- **Original URL:** `https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80`

#### **team_member_2.jpg** (Mélanie Bosshardt - Vorstand)
- **File Size:** 17 KB
- **Dimensions:** 300px × 300px
- **Usage:** Board member profile photo
- **Wix Implementation:** Same as team_member_1
- **Associated Text:**
  - Name: Mélanie Bosshardt
  - Role: Vorstand
  - Email: melanie.bosshardt@elternvereinigung.ch
- **Original URL:** `https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80`

#### **team_member_3.jpg** (Mirjam Spörri - Vorstand)
- **File Size:** 12 KB
- **Dimensions:** 300px × 300px
- **Usage:** Board member profile photo
- **Wix Implementation:** Same as team_member_1
- **Associated Text:**
  - Name: Mirjam Spörri
  - Role: Vorstand
  - Email: mirjam.spoerri@elternvereinigung.ch
- **Original URL:** `https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80`

---

## 🎨 Homepage Layout Structure

### Section 1: Hero (90vh height)
**Background:** `hero_background_familie.jpg` with gradient overlay  
**Position:** Top of page  
**Content:**
- Logo (top-left in header)
- Welcome text + heading
- 2 CTA buttons

---

### Section 2: Mission / Values (White background)
**Background:** Solid white (#FFFFFF)  
**Content:**
- 3 value cards with **icons only** (no images)
  - Icons: Users, Heart, Home (Lucide React icons)
  - Colors: Amber accent (#F59E0B)

---

### Section 3: Events Teaser (Gray background)
**Background:** Light gray (#F9FAFB)  
**Content:**
- 3 event cards with **generated placeholders** (no specific images)
  - Each card: Calendar icon with gradient background
  - Colors: Amber to orange gradient

---

### Section 4: Robihütte Teaser (White background)
**Background:** Solid white  
**Image:** `robihuette_exterior.jpg`  
**Position:** Left side, 800×400px, rounded corners  
**Content:** Feature list + CTA button

---

### Section 5: Team / Board (Gray background)
**Background:** Light gray (#F9FAFB)  
**Images:** 
- `team_member_1.jpg`
- `team_member_2.jpg`
- `team_member_3.jpg`  
**Layout:** 3-column grid, centered  
**Card Design:** White cards with circular photos

---

### Section 6: CTA Band (Gradient background)
**Background:** Gradient amber to orange (#F59E0B → #EA580C)  
**Content:** Text + 2 CTA buttons (no images)

---

### Footer
**Background:** Dark gray (#111827)  
**Logo:** `logo_evo_mobile.jpg` (smaller, 48px height)  
**Content:** 4 columns (logo/about, contact, links, newsletter)

---

## 📋 Wix Upload Checklist

### Media Manager Upload
- [ ] `logo_evo_mobile.jpg`
- [ ] `hero_background_familie.jpg`
- [ ] `robihuette_exterior.jpg`
- [ ] `team_member_1.jpg`
- [ ] `team_member_2.jpg`
- [ ] `team_member_3.jpg`

### Logo Placement
- [ ] Header - Logo element (h-10 to h-12)
- [ ] Footer - Logo element (h-12)

### Hero Section
- [ ] Strip background = `hero_background_familie.jpg`
- [ ] Gradient overlay configured
- [ ] Text overlay (white color)
- [ ] 2 CTA buttons added

### Robihütte Section
- [ ] Image element = `robihuette_exterior.jpg`
- [ ] Border radius: 16px
- [ ] Shadow: xl
- [ ] Price badge overlay (optional)

### Team Section
- [ ] Repeater connected to Vorstandsmitglieder collection
- [ ] 3 team photos uploaded to member records
- [ ] Circular image styling
- [ ] Ring border (amber-100)

---

## 🎨 Design Specifications

### Color Palette
- **Primary Amber:** `#F59E0B`
- **Primary Orange:** `#EA580C`
- **Dark Gray (text):** `#111827`
- **Medium Gray:** `#6B7280`
- **Light Gray (bg):** `#F9FAFB`
- **White:** `#FFFFFF`
- **Amber accent:** `#FEF3C7` (light, for borders)

### Typography
- **Headings (H1):** 48-56px, bold, dark gray
- **Headings (H2):** 32-40px, bold
- **Body:** 16px, regular, gray
- **Accent text:** Amber color, uppercase, small (12-14px)

### Spacing
- **Section padding:** 80px top/bottom (desktop), 60px (mobile)
- **Container max-width:** 1280px
- **Grid gap:** 32px (desktop), 24px (mobile)

### Border Radius
- **Cards:** 16px
- **Buttons:** 9999px (full rounded)
- **Images:** 16px (large), 8px (small)
- **Team photos:** 50% (circular)

### Shadows
- **Cards hover:** 0 12px 24px rgba(0,0,0,0.15)
- **Cards default:** 0 1px 3px rgba(0,0,0,0.1)
- **Price badge:** 0 10px 15px rgba(0,0,0,0.2)

---

## 📐 Image Dimensions for Wix

### Desktop Sizes
- **Hero background:** 1920px width (full-width)
- **Robihütte image:** 800px width × 400px height
- **Team photos:** 96px × 96px (displayed), upload at 300px

### Mobile Sizes
- **Hero:** Responsive (100% width)
- **Robihütte:** Responsive (100% width, maintain aspect)
- **Team photos:** 80px × 80px

---

## 🔗 External Asset References

### Icons (No Download Needed)
All icons are from **Lucide React** icon library. In Wix, use:
- **Wix built-in icons** OR
- **SVG icons** from similar libraries

**Icons used on homepage:**
- `Users` (Begegnungen)
- `Heart` (Gemeinschaft)
- `Home` (Zusammenarbeit)
- `Calendar` (Events)
- `MapPin` (Location)
- `Clock` (Time)
- `Mail` (Email)
- `Phone` (Contact)
- `ArrowRight` (CTA arrows)
- `ChevronRight` (Navigation arrows)

---

## 📝 Image Attribution

**Unsplash Images:**
- All Unsplash images are free to use under Unsplash License
- No attribution required for Unsplash photos
- Original URLs preserved in this document for reference

**EVO Logo:**
- Custom logo for Elternvereinigung Oberglatt
- Proprietary asset
- Already uploaded to Emergent customer assets

---

## 🚀 Next Steps for Wix Migration

1. **Upload all 6 images** to Wix Media Manager
2. **Create Homepage** in Wix Editor
3. **Follow the layout structure** outlined above
4. **Apply design specifications** (colors, spacing, shadows)
5. **Connect team photos** to Vorstandsmitglieder collection
6. **Test responsive** behavior on mobile devices

---

## 🔍 Additional Assets Needed

**Not included in this package (used on other pages):**
- Blog post images (dynamically loaded from database)
- Event images (dynamically loaded from database)
- Booking calendar icons (UI elements, not images)
- Favicon (not extracted, needs to be created)

**To get these:**
- See `/app/BILD_URLS_FUER_WIX.md` for scraped Wix image URLs (if available)
- Or use Wix's built-in image search/Unsplash integration

---

**Total Package Size:** 1.5 MB  
**All assets ready for Wix upload!** ✅

**Questions?** Refer to:
- Wix Migration Guides: `WIX_MIGRATION_GUIDE_ENGLISH.md` or `WIX_MIGRATION_GUIDE_UKRAINIAN.md`
- Current React implementation: `/app/frontend/src/App.js` (lines 262-466 for HomePage)
