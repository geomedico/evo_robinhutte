# 🎯 Quick Visual Reference - Homepage Asset Placement

**For:** Wix Designer/Developer  
**Purpose:** Visual guide showing exact placement of each asset on the homepage  

---

## 📍 Asset Placement Map (Top to Bottom)

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER                                │
│  [logo_evo_mobile.jpg]  Nav Links  [Login Button]          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              HERO SECTION (90vh height)                      │
│                                                              │
│  Background: hero_background_familie.jpg                    │
│  Overlay: Dark gradient (left→right, 80%→transparent)       │
│                                                              │
│  ┌──────────────────────────────┐                          │
│  │ WILLKOMMEN BEI DER (amber)   │                          │
│  │ Elternvereinigung            │                          │
│  │ Oberglatt (amber)            │                          │
│  │                              │                          │
│  │ Subtitle text...             │                          │
│  │                              │                          │
│  │ [Mitglied werden] [Robihütte mieten]                    │
│  └──────────────────────────────┘                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              MISSION SECTION (white bg)                      │
│                                                              │
│              Wofür wir stehen                               │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                │
│  │  [Icon]  │  │  [Icon]  │  │  [Icon]  │                │
│  │ Begegnung│  │Gemeinsch.│  │Zusammenarb│               │
│  │   ...    │  │   ...    │  │   ...    │                │
│  └──────────┘  └──────────┘  └──────────┘                │
│        (No images - just icons from Lucide)                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│           EVENTS TEASER (gray bg)                           │
│                                                              │
│              Nächste Anlässe                                │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                │
│  │ [Calendar│  │ [Calendar│  │ [Calendar│                │
│  │   Icon]  │  │   Icon]  │  │   Icon]  │                │
│  │  Event 1 │  │  Event 2 │  │  Event 3 │                │
│  └──────────┘  └──────────┘  └──────────┘                │
│        (No images - gradient placeholders)                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│        ROBIHÜTTE TEASER (white bg)                          │
│                                                              │
│  ┌────────────────┐  Dein Ort für                          │
│  │                │  unvergessliche Feste                    │
│  │ robihuette_    │                                          │
│  │ exterior.jpg   │  • Platz für 50 Personen                │
│  │                │  • Küche                                 │
│  │  (800×400px)   │  • Garten                                │
│  │                │  • Parkplätze                            │
│  └────────────────┘                                          │
│       ↳ [CHF 80 badge]  [Jetzt reservieren]                 │
│          (overlay)                                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│             TEAM SECTION (gray bg)                          │
│                                                              │
│                 Der Vorstand                                │
│                                                              │
│    ┌─────────┐      ┌─────────┐      ┌─────────┐          │
│    │  ○○○○   │      │  ○○○○   │      │  ○○○○   │          │
│    │team_    │      │team_    │      │team_    │          │
│    │member_  │      │member_  │      │member_  │          │
│    │1.jpg    │      │2.jpg    │      │3.jpg    │          │
│    │         │      │         │      │         │          │
│    │Dominique│      │Mélanie  │      │Mirjam   │          │
│    │Knöpfli  │      │Bosshardt│      │Spörri   │          │
│    │Präsident│      │Vorstand │      │Vorstand │          │
│    └─────────┘      └─────────┘      └─────────┘          │
│        (96×96px circular photos with amber ring)            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│         CTA BAND (amber→orange gradient)                     │
│                                                              │
│            Mitmachen bei der EVO                            │
│        Die EVO lebt vom Mitmachen...                        │
│                                                              │
│      [Mitglied werden]  [Bei Anlässen helfen]              │
│               (No images)                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    FOOTER (dark bg)                          │
│                                                              │
│  [logo_evo_mobile.jpg]    Kontakt    Links    Newsletter   │
│  (smaller, 48px)                                            │
│                                                              │
│  Copyright © 2026 Elternvereinigung Oberglatt              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Asset Usage Summary

| Asset Filename | Used In | Quantity | Size (Display) | Special Effects |
|----------------|---------|----------|----------------|-----------------|
| `logo_evo_mobile.jpg` | Header + Footer | 2× | 40-50px (header), 48px (footer) | White bg, rounded |
| `hero_background_familie.jpg` | Hero Section | 1× | Full-width, 90vh | Dark gradient overlay |
| `robihuette_exterior.jpg` | Robihütte Teaser | 1× | 800×400px | Rounded corners, shadow, price badge |
| `team_member_1.jpg` | Team Section | 1× | 96×96px | Circular, amber ring |
| `team_member_2.jpg` | Team Section | 1× | 96×96px | Circular, amber ring |
| `team_member_3.jpg` | Team Section | 1× | 96×96px | Circular, amber ring |

**Total unique images:** 6  
**Total placements:** 8

---

## 🔧 Wix Implementation Steps

### 1. Header Logo
```
Wix Editor:
→ Add → Image → Upload "logo_evo_mobile.jpg"
→ Design: Height 40-50px, Width auto
→ Background: White (#FFFFFF)
→ Border radius: 8px
→ Link: Home page (/)
```

### 2. Hero Background
```
Wix Editor:
→ Add → Strip (full-width section)
→ Strip height: 90vh
→ Change Background → Image → Upload "hero_background_familie.jpg"
→ Image position: Fill
→ Add → Color Overlay
  - Type: Gradient (linear, left to right)
  - Stop 1: #111827 at 0% (opacity 80%)
  - Stop 2: #111827 at 50% (opacity 60%)
  - Stop 3: Transparent at 100%
→ Add text elements on top (white color)
```

### 3. Robihütte Image
```
Wix Editor:
→ Add → Image → Upload "robihuette_exterior.jpg"
→ Size: 800px × 400px
→ Design:
  - Border radius: 16px
  - Shadow: Drop shadow (large)
→ Optional: Add shape for price badge
  - Position: Bottom-right, offset -24px
  - Background: #F59E0B
  - Text: "CHF 80" (large) + "ab / 4 Stunden"
```

### 4. Team Photos
```
Wix Editor:
→ Add → Repeater (3 columns)
→ Connect to Data → Vorstandsmitglieder collection
→ For each item:
  - Add → Image → Connect to "foto" field
  - Manual upload: team_member_1.jpg, team_member_2.jpg, team_member_3.jpg
  - Shape: Circular (border-radius 50%)
  - Size: 96×96px
  - Border: 4px solid #FEF3C7 (amber-100)
→ Add text below: Name, Role, Email (from collection)
```

### 5. Footer Logo
```
Same as Header Logo but:
→ Height: 48px
→ Place in footer left column
```

---

## 📱 Responsive Behavior

### Desktop (≥1024px)
- All assets at full specified sizes
- 3-column grids
- Hero at 90vh height

### Tablet (768px - 1023px)
- Logo: Same size
- Hero: 80vh height
- Team: 2 columns
- Robihütte image: 100% width

### Mobile (< 768px)
- Logo: 40px height
- Hero: 70vh height, text smaller
- Team: 1 column, photos 80×80px
- All sections: Single column
- Robihütte image: 100% width, auto height

---

## 🎨 Image Optimization Tips

### Before Uploading to Wix
All images are already optimized, but you can further compress:

1. **Logo:** Already 87KB ✅
2. **Hero:** 291KB (good for 1920px)
3. **Robihütte:** 1.1MB (can compress to ~500KB)
   - Use TinyPNG or similar
   - Target: <600KB for faster load
4. **Team photos:** Already small (12-26KB each) ✅

### Wix Media Manager
- Wix automatically creates responsive versions
- Original high-res images are preserved
- Mobile users get smaller versions automatically

---

## ✅ Upload Checklist

**Before starting Wix design:**
- [ ] All 6 images downloaded to local computer
- [ ] Reviewed ASSETS_README.md
- [ ] Understand color palette and spacing
- [ ] Ready to follow Wix Migration Guide

**During Wix design:**
- [ ] Upload all images to Media Manager first
- [ ] Create Homepage page in Wix
- [ ] Build section by section (top to bottom)
- [ ] Apply design specs (rounded corners, shadows)
- [ ] Connect team photos to database
- [ ] Test responsive on preview mode

**After design complete:**
- [ ] Check all images load correctly
- [ ] Verify mobile responsive
- [ ] Test all links on images
- [ ] Optimize any large images if needed

---

**Ready to build!** 🚀

Refer to:
- Full details: `ASSETS_README.md`
- Wix guide: `WIX_MIGRATION_GUIDE_ENGLISH.md` or `WIX_MIGRATION_GUIDE_UKRAINIAN.md`
- Current design: See live at `http://localhost:3000` (if running)
