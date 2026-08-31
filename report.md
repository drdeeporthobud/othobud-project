# Comprehensive Page-by-Page Website Audit & Technical Review
**Website:** Orthobud — Dr. Deep Chakraborty (Orthopedic Surgeon Clinic)  
**Technology Stack:** React 19, Vite 8, React Router 7 (`react-router-dom`), Tailwind CSS v4, TypeScript  
**Environment:** Live Local Development Server (`http://localhost:8443/`)  
**Audit Scope:** Full Page-by-Page Audit across all 8 routes and global components combining source-code static analysis and live browser interaction testing.

---

## Executive Summary

The Orthobud clinic web application represents a multi-page orthopedic surgery practice website designed for Dr. Deep Chakraborty (Kolkata). The design demonstrates clean medical typography (`Plus Jakarta Sans` for headers, `Inter` for body), a coherent medical palette (Deep Navy `#0F172A`, Primary Medical Blue `#0284C7`, Sky Light `#0EA5E9`, Crisp Soft Gray `#F8FAFC`), responsive glassmorphism navigation, and structured components.

However, as a prototype exported from Figma design specifications:
1. **Critical Animation / Tab Bug:** On the **Patient Resources** page, switching tabs (e.g. to "Patient Stories", "FAQs", or "Downloads") leaves the content completely blank / invisible due to mount-only `IntersectionObserver` binding in `useReveal.ts`.
2. **Mismatched & Duplicate Stock Photography:**
   - *"Robotic Knee Replacement"* (Treatments) and *"Understanding Knee Osteoarthritis"* (Blog) incorrectly display a brain neurology model image (`photo-1559757175-0eb30cd8c063`).
   - *"Knee Arthroscopy"* and *"Pediatric Orthopedics"* (Treatments) reuse the same generic photo of a doctor holding a smartphone.
   - About page hero displays an unrelated young stock doctor portrait rather than matching Dr. Deep's verified photos (`Dr_Deep.png`).
3. **Form & Data Interactivity:**
   - The multi-step **Book Appointment Wizard** is functional through Step 1 ➔ Step 2 ➔ Step 3, but appointment submissions are stored only in volatile React state (lost on refresh), time slots do not adjust to individual clinic operating hours, and date selection does not enforce clinic consultation days.
   - Navigation links across the Home hero widget and treatment cards drop parameters instead of pre-populating the booking wizard.
   - The **Contact Enquiry Form** and **Blog Newsletter** simulate submission without persistent storage.

---

## Global Navigation & Layout Audit

### 1. Navigation Header (`src/components/Navigation.tsx`)

#### Top-to-Bottom Audit & Visual Review
- Fixed-position sticky navigation header with frosted glass backdrop blur (`backdrop-filter: blur(20px)`), responsive brand identity (Orthobud + Dr. Deep Chakraborty), 6 desktop navigation routes, and a prominent primary CTA button *"Book Appointment"*.
- Dynamic scroll transition: Transparent background on the Home hero section, transitioning seamlessly to `glass-nav` with subtle border on scroll (`window.scrollY > 40`) or when navigating to subpages.

#### Interactive Elements Inventory & Connection Map
| Element | Selector / Type | Connection / Target | Status |
| :--- | :--- | :--- | :--- |
| **Brand Logo** | `<Link to="/">` | Home page (`/`) |  Working |
| **About Dr. Deep** | `<Link to="/about">` | About page (`/about`) |  Working |
| **Treatments** | `<Link to="/treatments">` | Treatments page (`/treatments`) |  Working |
| **Patient Resources** | `<Link to="/patient-resources">` | Resources page (`/patient-resources`) |  Working |
| **Blog** | `<Link to="/blog">` | Blog page (`/blog`) |  Working |
| **Gallery** | `<Link to="/gallery">` | Gallery page (`/gallery`) |  Working |
| **Contact** | `<Link to="/contact">` | Contact page (`/contact`) |  Working |
| **Book Appointment** (Desktop) | `<Link to="/book-appointment">` | Appointment wizard (`/book-appointment`) |  Working |
| **Hamburger Button** (Mobile) | `<button onClick>` | Toggles mobile drawer state `menuOpen` |  Working |
| **Book Appointment** (Mobile) | `<Link to="/book-appointment">` | Appointment wizard (`/book-appointment`) |  Working |

#### Behavioral Specifications
- Active route highlighting: The link corresponding to the current URL pathname automatically receives `text-teal bg-teal/8 font-semibold` styling.
- Route change auto-collapse: Navigating to any link in the mobile drawer invokes `useEffect` on `location` and automatically sets `menuOpen(false)`.

#### Actionable Improvement Plan
- Add emergency hotline / direct calling link (`tel:+919830000000`) in the top bar.
- Add live clinic status chip (e.g. *"Salt Lake Clinic: Open Today 5–8 PM"*).
- Add accessibility ARIA tags (`aria-expanded`, `aria-label`, `aria-controls`).

---

### 2. Footer (`src/components/Footer.tsx`)

#### Top-to-Bottom Audit & Visual Review
- 3-tier dark navy footer comprising a top teal CTA conversion banner, 4-column directory (Brand description, Quick Links, Treatments list, Contact & Locations), and a bottom legal/copyright bar.

#### Interactive Elements Inventory & Connection Map
| Element | Selector / Type | Connection / Target | Status |
| :--- | :--- | :--- | :--- |
| **Top CTA Button** | `<Link to="/book-appointment">` | `/book-appointment` |  Working |
| **Quick Links** (6 items) | `<Link to="...">` | Respective pages (`/about`, `/treatments`, etc.) |  Working |
| **Treatment Directory** (6 items) | `<Link to="/treatments">` | Generic `/treatments` route | ⚠️ Generic link (doesn't pre-filter category) |
| **Social Media Icons** (4) | `<a href="#">` | Dead links (`#`) | ⚠️ Placeholder links |
| **Legal Links** (Privacy, Terms, Disclaimer) | `<a href="#">` | Dead links (`#`) | ⚠️ Placeholder links |
| **Phone Link** | `<a href="tel:...">` | `tel:+919830000000` |  Working protocol |
| **Email Link** | `<a href="mailto:...">` | `mailto:dr.deep@orthobud.in` |  Working protocol |

#### Behavioral Specifications
- Treatment links should pass query parameters (e.g. `/treatments?category=Joint+Replacement`) so the Treatments page automatically filters to the relevant procedures.
- Legal links should open dedicated informational modals or pages.

#### Actionable Improvement Plan
- Connect treatment directory items with deep-linked category filters.
- Replace placeholder social URLs with real clinic social media channels.
- Add doctor registration numbers (MCI / WBMC) and statutory medical disclaimer.

---

## Page-by-Page Comprehensive Audit

---

### Page 1: Home Page (`/`)

#### 1. Top-to-Bottom Audit & Visual Review
- **Hero Section:** Radial ambient glow, large headline (*"Restoring Movement. Renewing Lives."*), sub-headline, trust pills (*"15+ Years Experience"*, *"5,000+ Surgeries"*, *"MBBS · MS · DNB"*), authentic Dr. Deep image frame with floating surgery count badge, and floating quick-appointment booking widget.
- **Trust & Stats Grid:** 6 animated count-up stat cards (15+ Years, 5000+ Surgeries, 8 Hospital Affiliations, 12 Awards, 4800+ Reviews, 98% Satisfaction) with credential badges.
- **Meet Dr. Deep Snippet:** Clinical photo, quote callout, biographical summary, specialization matrix, and link to complete profile.
- **Conditions We Treat:** 6-card grid with custom icons covering Knee Pain, Hip Pain, Shoulder Pain, Sports Injuries, Fractures, and Back Pain.
- **Featured Treatments:** 6 dark glass cards with hover glow effects.
- **Why Choose Dr. Deep:** 6 value proposition items (Personalized Treatment, Evidence-Based Care, Transparent Communication, Advanced Surgical Expertise, Complete Rehabilitation, Hospital-Grade Safety).
- **Patient Journey Timeline:** 7-stage roadmap from consultation to long-term follow-up.
- **Patient Testimonials:** 3 verified patient review cards with star ratings and photos.
- **Latest Insights & Gallery Preview:** 3 blog cards and 6-photo masonry grid.
- **Frequently Asked Questions:** 3 accordion FAQ toggles.
- **Clinic Locator & Contact Strip:** Salt Lake & Alipore timing cards with Call, WhatsApp, and Booking action buttons.

#### 2. Interactive Elements Inventory
| Element | Type | Target / Action | Status |
| :--- | :--- | :--- | :--- |
| `Book Appointment` (Hero Primary) | `<Link>` | `/book-appointment` |  Working |
| `Meet Dr. Deep` (Hero Secondary) | `<Link>` | `/about` |  Working |
| `Select Clinic` (Hero Widget) | `<select>` | Updates local state `clinic` | ⚠️ State dropped on navigation |
| `Date Input` (Hero Widget) | `<input type="date">` | Updates local state `date` | ⚠️ State dropped on navigation |
| `Book Now →` (Hero Widget) | `<Link>` | `/book-appointment` | ⚠️ Drops selected clinic & date |
| `View Complete Profile` | `<Link>` | `/about` |  Working |
| `Condition Cards` (6 cards) | `<Link>` | `/treatments` | ⚠️ Generic link |
| `Explore All Conditions →` | `<Link>` | `/treatments` |  Working |
| `Treatment Cards` (6 cards) | `<Link>` | `/treatments` | ⚠️ Generic link |
| `View All Treatments →` | `<Link>` | `/treatments` |  Working |
| `Learn More →` (Why Choose) | `<Link>` | `/about` |  Working |
| `Know the Complete Process →` | `<Link>` | `/patient-resources` |  Working |
| `Read More Stories →` | `<Link>` | `/patient-resources` | ⚠️ Opens default tab, not Stories |
| `Visit Blog →` & Blog Cards (3) | `<Link>` | `/blog` |  Working |
| `View Full Gallery →` & Gallery Images (6) | `<Link>` | `/gallery` |  Working |
| `FAQ Accordions` (3 items) | `<button>` | Toggles open/close state |  Working |
| `View All FAQs →` | `<Link>` | `/patient-resources` | ⚠️ Opens default tab, not FAQs |
| `Call Clinic` | `<a>` | `tel:+919830000000` |  Working |
| `WhatsApp` | `<a>` | `https://wa.me/919830000000` | ⚠️ Placeholder phone number |
| `View All Locations →` | `<Link>` | `/contact` |  Working |
| `Book Appointment` (Map Banner) | `<Link>` | `/book-appointment` |  Working |

#### 3. Behavioral Specifications
- Quick Appointment Widget: Selecting clinic and date in the hero widget must append URL parameters (`/book-appointment?clinic=salt-lake&date=2026-09-15`) so Step 1 in the booking wizard is pre-filled.
- Deep Linking: Links to *"Read More Stories"* and *"View All FAQs"* must route with query parameters (`/patient-resources?tab=Patient+Stories` and `/patient-resources?tab=FAQs`) to activate the target tab directly.

#### 4. Actionable Improvement Plan
- Pass widget state through React Router navigation search params.
- Replace generic photo in "Why Choose" section with genuine orthopedic consultation image.
- Add an interactive **Joint Pain & Symptom Self-Assessment Checker** widget.

---

### Page 2: About Dr. Deep (`/about`)

#### 1. Top-to-Bottom Audit & Visual Review
- **Hero:** Dark navy banner presenting qualifications (MS Ortho, DNB, Fellowship Germany), MCI registration number, and doctor photo.
- **Biography Section:** Narrative covering early background, IPGMER post-graduation, German Endo-Klinik fellowship, and clinical philosophy blockquote.
- **Career Timeline:** Vertical timeline tracking milestones from 2003 MBBS graduation to 2023 5,000th surgery.
- **Awards & Honours:** 5 awards with custom badge iconography.
- **Professional Affiliations & Hospital Empanelment:** IOA, ISAKOS memberships and 5 hospital consultant roles (AMRI, Peerless, CMRI, Fortis, Ruby).
- **Media Coverage:** 3 press mentions (The Telegraph, Anandabazar Patrika, Times of India).
- **Bottom CTA:** Teal consultation booking banner.

#### 2. Interactive Elements Inventory
| Element | Type | Target / Action | Status |
| :--- | :--- | :--- | :--- |
| `Book Consultation` (Hero) | `<Link>` | `/book-appointment` |  Working |
| `Call Clinic` (Hero) | `<a>` | `tel:+919830000000` |  Working |
| `Book Appointment →` (Bottom CTA) | `<Link>` | `/book-appointment` |  Working |

#### 3. Behavioral Specifications
- The photo used in the About hero is a stock photo of an unrelated doctor (`photo-1612349317150-e413f6a5b16d`). It should be updated to use the authentic Dr. Deep image (`Dr_Deep.png`).

#### 4. Actionable Improvement Plan
- Replace hero stock image with authentic Dr. Deep photo.
- Add a downloadable CV / Fellowship Credentials PDF button.
- Add clickable links or modal previews for media press articles.

---

### Page 3: Treatments & Specialities (`/treatments`)

#### 1. Top-to-Bottom Audit & Visual Review
- **Hero Banner:** Dark navy header defining orthopedic sub-specialties.
- **Category Filter Bar:** 6 pill buttons (`All`, `Joint Replacement`, `Arthroscopy`, `Sports Medicine`, `Trauma`, `Pediatric`).
- **Treatment Cards Grid:** 8 cards with icon, category badge, title, procedure summary, expandable symptoms & recovery drawer, and action button.
- **Bottom CTA:** Consultation guide for patients unsure of their treatment needs.

#### 2. Interactive Elements Inventory
| Element | Type | Target / Action | Status |
| :--- | :--- | :--- | :--- |
| `Category Filter Buttons` (6) | `<button>` | Updates `activeCategory` state |  Working filter |
| `View Symptoms & Recovery` / `Show Less` | `<button>` | Toggles card accordion expansion |  Working drawer |
| `Book for this Treatment` (8 cards) | `<Link>` | `/book-appointment` | ⚠️ Does not pre-select condition |
| `Book a Consultation →` (Bottom CTA) | `<Link>` | `/book-appointment` |  Working |

#### 3. Behavioral Specifications
- Clicking *"Book for this Treatment"* on any card (e.g. *Total Hip Replacement*) should route to `/book-appointment?condition=Hip+Pain` so the patient form is pre-configured.
- Sync active category with URL search params (`/treatments?category=Sports+Medicine`).

#### 4. Actionable Improvement Plan
- **Fix Mismatched / Duplicate Images:**
  - Card 1 (*Robotic Knee Replacement*): Replace brain model image (`photo-1559757175-0eb30cd8c063`) with robotic orthopedic joint surgery visual.
  - Card 4 (*Knee Arthroscopy*) & Card 8 (*Pediatric Orthopedics*): Replace duplicate doctor with phone image (`photo-1576091160399-112ba8d25d1d`) with separate arthroscopy and pediatric visuals.
- Add an interactive recovery timeline visualizer component.

---

### Page 4: Patient Resources (`/patient-resources`)

#### 1. Top-to-Bottom Audit & Visual Review
- **Header:** Informational resource center hero.
- **Sticky Tab Bar:** 4 tabs (`Guides`, `Patient Stories`, `FAQs`, `Downloads`).
- **Tab 1 — Recovery Guides:** 6 patient preparation guides with download buttons and 3 rehabilitation video cards.
- **Tab 2 — Patient Stories:** 6 verified patient reviews with Google review badges.
- **Tab 3 — FAQs:** 8 categorized FAQ accordions.
- **Tab 4 — Downloads:** Patient forms, discharge care sheets, and diet charts.

#### 2. Interactive Elements Inventory
| Element | Type | Target / Action | Status |
| :--- | :--- | :--- | :--- |
| `Tab Navigation` (4 tabs) | `<button>` | Updates `activeTab` state | ❌ **Critical Bug: Content invisible** |
| `Download PDF` Buttons (6 guides) | `<button>` | Trigger file download | ⚠️ Placeholder button (no file) |
| `Video Play Overlays` (3 cards) | `<div>` | Open video player modal | ⚠️ Non-clickable overlay |
| `FAQ Accordion Toggles` (8 items) | `<button>` | Toggles FAQ open/close |  Working |

#### 3. Critical Bug Analysis (Tab Switching Blank Screen)
- **Root Cause:** In `PatientResources.tsx`, each tab section wraps its content in elements with the `.reveal` class. In `src/hooks/useReveal.ts`, `IntersectionObserver` only attaches once on component mount. When the user switches tabs, newly mounted elements remain unobserved with `opacity: 0` and `transform: translateY(28px)`.
- **Resolution:** Modify `useReveal.ts` or replace mount-only scroll observers inside tab panels with direct CSS fade transitions.

#### 4. Actionable Improvement Plan
- **Bug Fix:** Fix tab rendering so all tabs render instantly with smooth transitions.
- **Functional:** Provide downloadable PDF care guides (Pre-op checklist, Knee exercise chart).
- **Media:** Add video modal player for rehabilitation exercises.

---

### Page 5: Blog & Insights (`/blog`)

#### 1. Top-to-Bottom Audit & Visual Review
- **Header with Live Search:** Search bar filtering articles in real-time.
- **Featured Article:** Large highlight card on Robotic Surgery with tags and read time.
- **Category Filter Pills:** 6 categories (`All`, `Doctor's Insights`, `Patient Education`, `Sports Medicine`, `Recovery`, `Research`).
- **Article Grid:** 5 post cards with category badges, read times, summaries, and dates.
- **Newsletter Banner:** Email subscription box in dark navy.

#### 2. Interactive Elements Inventory
| Element | Type | Target / Action | Status |
| :--- | :--- | :--- | :--- |
| `Search Bar` | `<input>` | Live filter query `search` |  Working search |
| `Category Filter Pills` (6) | `<button>` | Updates `activeCategory` |  Working filter |
| `Read Article →` (Featured) | `<button>` | Opens full article | ⚠️ Dead button |
| `Read →` (5 grid cards) | `<button>` | Opens full article | ⚠️ Dead button |
| `Newsletter Input & Subscribe` | `<input>` / `<button>` | Submits newsletter email | ⚠️ No submit handler |

#### 3. Behavioral Specifications
- Clicking any article card or *"Read Article"* button should open an interactive Article Reader Modal or route to a dedicated article view.
- Newsletter subscription should validate email and display confirmation feedback.

#### 4. Actionable Improvement Plan
- Implement full article modal reader with complete clinical text and sharing options.
- Replace brain model photo on *"Understanding Knee Osteoarthritis"*.
- Wire newsletter form with instant validation and confirmation message.

---

### Page 6: Case Studies & Gallery (`/gallery`)

#### 1. Top-to-Bottom Audit & Visual Review
- **Header:** Dark navy banner.
- **Category Filter:** 8 categories (`All`, `Consultations`, `Conferences`, `Workshops`, `Facilities`, `Community`, `Media`, `Achievements`).
- **Masonry Grid:** 12 cards with image zoom hover effects and category badges.
- **Lightbox Modal:** Full-screen modal viewer with backdrop blur, image title, description, and close button.

#### 2. Interactive Elements Inventory
| Element | Type | Target / Action | Status |
| :--- | :--- | :--- | :--- |
| `Category Filter Pills` (8) | `<button>` | Updates `activeCategory` |  Working filter |
| `Gallery Cards` (12 items) | `<div>` | Sets `lightbox` state to active image |  Working lightbox opener |
| `Lightbox Backdrop & Close (X)` | `<button>` / `<div>` | Closes lightbox (`setLightbox(null)`) |  Working lightbox closer |

#### 3. Behavioral Specifications
- Lightbox opens smoothly and prevents background page scrolling.
- Escape key listener and next/previous keyboard navigation should be supported.

#### 4. Actionable Improvement Plan
- Replace mismatched photos (brain model on Consultation, duplicate IV drip stands, unrelated stock portraits).
- Add an interactive **Before / After X-Ray Comparison Slider** (drag-to-compare).

---

### Page 7: Contact & Locations (`/contact`)

#### 1. Top-to-Bottom Audit & Visual Review
- **Header:** Clean title and subtitle.
- **Quick Contact Strip:** Cyan bar with phone number, WhatsApp link, email, and 24/7 emergency hotline.
- **3 Clinic Cards Grid:** Salt Lake, Alipore, and Newtown locations with addresses, consulting hours, direct phone links, WhatsApp buttons, and booking buttons.
- **Enquiry Form:** Form with Name, Phone, Email, Subject dropdown, and Message textarea.

#### 2. Interactive Elements Inventory
| Element | Type | Target / Action | Status |
| :--- | :--- | :--- | :--- |
| `Top Bar Phone Link` | `<a>` | `tel:+919830000000` |  Working |
| `Top Bar WhatsApp Link` | `<a>` | `https://wa.me/919830000000` | ⚠️ Placeholder phone number |
| `Top Bar Email Link` | `<a>` | `mailto:dr.deep@orthobud.in` |  Working |
| `Clinic Card Phone Links` (3) | `<a>` | `tel:+919830000001-3` |  Working |
| `Clinic Card WhatsApp Links` (3) | `<a>` | `https://wa.me/...` |  Working |
| `Book Here` (3 Clinic Cards) | `<Link>` | `/book-appointment` | ⚠️ Does not pre-select clinic |
| `Enquiry Form Submit` | `<form onSubmit>` | Toggles `submitted` confirmation |  Working simulated state |

#### 3. Behavioral Specifications
- Clicking *"Book Here"* on a clinic card should route to `/book-appointment?clinic=Salt+Lake+Clinic` so Step 1 pre-selects that location.
- Enquiry form should save submissions in `localStorage` for offline review.

#### 4. Actionable Improvement Plan
- Replace static map photos with interactive Google Maps embeds or GPS navigation links.
- Replace IV drip stand photo on Alipore Clinic card with clinic reception photo.

---

### Page 8: Book Appointment Wizard (`/book-appointment`)

#### 1. Top-to-Bottom Audit & Visual Review
- **Header:** 2-step progress indicator (Step 1: Choose Slot ➔ Step 2: Your Details ➔ Step 3: Confirmation).
- **Step 1 (Slot Selection):** Clinic selection cards (Salt Lake, Alipore, Newtown), date picker, and 6 time slot buttons.
- **Step 2 (Patient Details):** Slot summary banner, full name, age, gender, phone, email, condition selector chips, medical notes textarea, first visit toggle, and optional insurance field.
- **Step 3 (Confirmation Summary):** Success checkmark, appointment details summary card, pre-visit checklist, and WhatsApp / Back to Home navigation buttons.

#### 2. Interactive Elements Inventory
| Element | Type | Target / Action | Status |
| :--- | :--- | :--- | :--- |
| `Clinic Select Cards` (3) | `<button>` | Updates `form.clinic` |  Working |
| `Date Picker` | `<input type="date">` | Updates `form.date` |  Working |
| `Time Slot Buttons` (6) | `<button>` | Updates `form.timeSlot` |  Working |
| `Continue to Patient Details →` | `<button>` | Advances to Step 2 |  Working (Validates Step 1) |
| `Back Arrow Button` (Step 2) | `<button>` | Returns to Step 1 |  Working |
| `Condition Selector Chips` (10) | `<button>` | Updates `form.condition` |  Working |
| `First Visit Toggle` (Yes/No) | `<button>` | Updates `form.firstVisit` |  Working |
| `Confirm Appointment Request →` | `<button>` | Advances to Step 3 |  Working (Validates Step 2) |
| `Back to Home` (Step 3) | `<Link>` | `/` |  Working |
| `WhatsApp Us` (Step 3) | `<a>` | `https://wa.me/919830000000` | ⚠️ Placeholder phone number |

#### 3. Behavioral Specifications
- Dynamic Clinic Operating Hours:
  - **Salt Lake Clinic:** Evening slots (5:00 PM, 5:30 PM, 6:00 PM, 6:30 PM, 7:00 PM, 7:30 PM).
  - **Alipore Clinic:** Morning slots (11:00 AM, 11:30 AM, 12:00 PM, 12:30 PM).
  - **Newtown Clinic:** Evening slots (6:00 PM, 6:30 PM, 7:00 PM, 7:30 PM, 8:00 PM, 8:30 PM).
- Pre-population: Parse URL search parameters (`useSearchParams`) to pre-select clinic and condition automatically.

#### 4. Actionable Improvement Plan
- Implement dynamic clinic-specific time slots and consulting days validation.
- Add "Add to Google Calendar / Apple Calendar (.ics)" export button on the confirmation screen.
- Persist appointments to `localStorage` so patients can review upcoming visits.

---

## Technical Audit & Animation System Analysis

### The `useReveal` Hook Issue (`src/hooks/useReveal.ts`)
```typescript
// Current implementation in useReveal.ts
useEffect(() => {
  const el = ref.current
  if (!el) return
  const observer = new IntersectionObserver(...)
  const children = el.querySelectorAll('.reveal')
  children.forEach((child) => observer.observe(child))
  return () => observer.disconnect()
}, []) // <- Empty dependency array: runs only once on mount
```
**Impact:** Any component that switches child content without remounting the parent ref (e.g. `PatientResources.tsx` tabs) fails to observe new DOM elements. Consequently, elements retain CSS `.reveal { opacity: 0; transform: translateY(28px); }` and remain completely invisible.

**Recommended Fix:** Replace mount-only scroll observers inside tab panels with direct CSS fade transitions or pass active dependencies to `useReveal`.

---

## Prioritized Implementation Roadmap

### Phase 1: Critical Bug Fixes & Visual Corrections (High Priority)
1. **Fix Tab Switching Bug in Patient Resources:** Update `useReveal.ts` and tab panel rendering in `PatientResources.tsx` so all tabs render instantly.
2. **Replace Mismatched Photography:**
   - Replace brain image on Robotic Knee Replacement (Treatments) and Knee Osteoarthritis (Blog).
   - Replace duplicate doctor holding phone image on Knee Arthroscopy, Pediatric Orthopedics, and IOA Conference.
   - Replace generic stock portraits in About and Gallery with authentic orthopedic imagery and Dr. Deep's verified portraits.

### Phase 2: Navigation & Flow Interactivity (Medium Priority)
1. **Query Parameter Wiring:**
   - Wire Home Hero Quick Booking widget directly to `/book-appointment?clinic=...&date=...`.
   - Wire Treatment card CTA buttons to `/book-appointment?condition=...`.
   - Wire Clinic card "Book Here" buttons to `/book-appointment?clinic=...`.
   - Wire Footer and Home links to specific tabs in `/patient-resources?tab=...`.
2. **Dynamic Slot Validation in Book Appointment:**
   - Dynamically load morning slots for Alipore Clinic (11 AM – 1 PM) and evening slots for Salt Lake & Newtown.
   - Add calendar invite export (`.ics` generation) on confirmation screen.

### Phase 3: Interactive Features & Rich Polish (Enhancement Priority)
1. **Interactive Before / After X-Ray Slider** on Gallery page.
2. **Blog Article Modal / Full Reader** to allow patients to read full educational guides.
3. **Interactive Symptom / Joint Pain Assessment Widget** on Home page.
4. **Google Maps Live Direction Embeds** for all 3 clinic locations.
