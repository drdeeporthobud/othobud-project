# Orthobud — Comprehensive Responsive Web Design (RWD) Blueprint & Roadmap

**Project:** Orthobud — Dr. Deep Chakraborty (Orthopedic Surgeon Clinic)  
**Document:** Responsive Web Design Master Plan (`responsiveness.md`)  
**Version:** 1.0  
**Stack:** React 19, TypeScript, Tailwind CSS v4, Vite  
**Goal:** Deliver a flawless, mobile-first, high-performance responsive experience across all screen sizes (320px mobile to 4K desktop) for all 10 pages and shared layout components.

---

## 1. Responsive Viewport & Breakpoint Matrix

We follow a **mobile-first** responsive design hierarchy based on Tailwind CSS v4 breakpoint tokens:

| Breakpoint Token | Min Width | Target Devices | Key Layout Behavior |
| :--- | :--- | :--- | :--- |
| **Default (Mobile XS)** | `320px` – `374px` | iPhone SE, Galaxy A-series, small compact smartphones | Single column, tight padding (`px-4`), fluid headings (`clamp`), vertical button stacks |
| **Mobile Standard** | `375px` – `639px` | iPhone 12–16, Galaxy S21–S25, Pixel | Full-width cards, optimized touch targets (min 44px), readable typography |
| **`sm` (Small Tablet / Phablet)** | `640px` | Large foldable screens, small tablets (iPad mini portrait) | 2-column stats/cards, side-by-side action buttons |
| **`md` (Tablet Portrait)** | `768px` | iPad 10th Gen, iPad Air portrait, Surface Pro | 2-column content grids, expanded navigation preview, tablet-optimized tables |
| **`lg` (Tablet Landscape / Laptop)** | `1024px` | iPad landscape, 13" MacBooks, standard laptops | Full desktop horizontal navbar, 3–4 column grids, sticky sidebars, hero split layouts |
| **`xl` (Desktop)** | `1280px` | 15"–16" Laptops, 24" Desktop Monitors | Max-width constraints (`max-w-7xl`), generous white-space, multi-column footers |
| **`2xl` (Large Display)** | `1536px+` | 27"+ iMacs, Ultrawide displays, 4K monitors | Centered layout with max-width containment to prevent stretching |

---

## 2. Global RWD Rules & Design System Principles

1. **No Horizontal Scroll (Zero X-Overflow):**
   - Every page wrapper, section, and container must strictly respect viewport boundaries (`w-full max-w-full overflow-x-clip` or `overflow-x-hidden`).
   - Image and SVG assets must have `max-w-full h-auto` or controlled aspect ratios.
2. **Touch-Target Sizing (Apple HIG / Google Material Standard):**
   - Minimum tap target size of `44x44px` or `48x48px` for all interactive elements (buttons, inputs, hamburger icon, carousel dots, accordion headers, calendar date cells).
3. **Fluid Typography & Headings:**
   - Headings use CSS `clamp()` or progressive Tailwind scale (e.g. `text-2xl sm:text-3xl lg:text-5xl font-display font-800`).
   - Body copy maintains readable line length (`max-w-prose` or `max-w-xl` to `max-w-3xl`) with comfortable line height (`leading-relaxed`).
4. **Adaptive Form Controls:**
   - On screens `< 640px`, form inputs must display at minimum 16px font size to prevent iOS Safari auto-zoom.
   - Radio buttons and slot pills expand to full width or comfortable touch grids.
5. **Data Displays & Tables on Mobile:**
   - Tables (especially on `/admin` and `/my-booking`) convert to card-based summaries or horizontally scrollable containers with clear visual cues and sticky headers.

---

## 3. Page-by-Page Execution Roadmap

We will execute the responsiveness systematically, one page at a time:

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                          RESPONSIVE EXECUTION ORDER                               │
│                                                                                   │
│  [Step 0] Global Shell & Shared Components (Navigation, Footer, Global CSS)       │
│                                  │                                                │
│  [Step 1] Page 1: Home (/)                                                        │
│                                  │                                                │
│  [Step 2] Page 2: About Dr. Deep (/about)                                         │
│                                  │                                                │
│  [Step 3] Page 3: Treatments (/treatments)                                        │
│                                  │                                                │
│  [Step 4] Page 4: Patient Resources (/patient-resources)                          │
│                                  │                                                │
│  [Step 5] Page 5: Blog & Articles (/blog)                                         │
│                                  │                                                │
│  [Step 6] Page 6: Surgery & Clinic Gallery (/gallery)                             │
│                                  │                                                │
│  [Step 7] Page 7: Contact Us (/contact)                                           │
│                                  │                                                │
│  [Step 8] Page 8: Book Appointment Wizard (/book-appointment)                     │
│                                  │                                                │
│  [Step 9] Page 9: Track Booking (/my-booking)                                     │
│                                  │                                                │
│  [Step 10] Page 10: Staff Admin Dashboard (/admin)                                │
│                                  │                                                │
│  [Step 11] Cross-Device QA & Final Audit (Mobile, Tablet, Desktop)                │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Detailed Component & Page Checklists

### Step 0: Global Navigation & Footer

#### `src/components/Navigation.tsx`
- [ ] **Mobile Drawer:** Smooth slide-down / fade transition with backdrop blur, full touch height, scroll locking when opened.
- [ ] **Brand Logo:** Responsive text sizing (`text-base sm:text-lg`) preventing logo clipping on 320px screens.
- [ ] **Mobile CTA:** "Book Appointment" button prominently placed inside mobile drawer as full-width tap target.
- [ ] **Sticky Navbar:** Smooth blur & background transition without layout jitter on mobile scroll.
- [ ] **Close Drawer triggers:** Closes automatically on route change, click outside, or escape key.

#### `src/components/Footer.tsx`
- [ ] **Top CTA Banner:** Flex column on mobile (`flex-col md:flex-row`), text centered on small screens, full-width CTA button on mobile.
- [ ] **4-Column Grid:** Collapses smoothly from 4 columns (`lg:grid-cols-4`) to 2 columns (`sm:grid-cols-2`) to 1 column on mobile.
- [ ] **Social Icons & Quick Links:** Adequate spacing, min 44px touch targets.
- [ ] **Bottom Copyright Row:** Clean wrap on narrow screens without awkward breaks.

---

### Step 1: Home (`src/pages/Home.tsx`)

- [ ] **Hero Section:**
  - Currently the doctor image and floating badge are `hidden lg:block`. On mobile/tablet, show a dedicated, beautifully styled doctor card or compact portrait frame so mobile users see Dr. Deep immediately.
  - CTAs: Stacking `flex-col sm:flex-row` with full-width buttons on mobile.
  - Floating "Quick Appointment" widget: Seamlessly dock beneath hero text or doctor image on mobile rather than being hidden.
- [ ] **Key Statistics Strip:**
  - 4 cards: `grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6`.
  - Prevent large numbers (e.g. "5,000+") from overflowing card borders on 320px screens.
- [ ] **Conditions Treated Grid:**
  - Responsive grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6`.
  - Card padding and icon sizing adapted for compact touch screens.
- [ ] **Treatments Showcase:**
  - Image thumbnail sizing and text hierarchy scaling.
- [ ] **Why Choose Dr. Deep:**
  - 2-column split collapses to single-column on mobile with preserved visual hierarchy.
- [ ] **Patient Recovery Journey (Stepper):**
  - Timeline transforms to a clean vertical stepper on mobile with uninterrupted connecting lines.
- [ ] **Testimonials Carousel/Grid:**
  - Responsive cards with touch-friendly navigation arrows and mobile swipe capability.
- [ ] **Latest Articles & FAQ Accordion:**
  - Expandable FAQ buttons with comfortable touch targets and clear chevron indicators.
- [ ] **Consultation Strip / Booking CTA:**
  - Full-width mobile container with direct call and book links.

---

### Step 2: About Dr. Deep (`src/pages/About.tsx`)

- [ ] **Hero Section:**
  - Doctor portrait + MCI certification badge: Reposition badge on mobile so it doesn't overlap screen edges or text.
  - Quick Info Badges (MCI Registration, Experience, Surgeries, Languages): Ensure 2x2 grid padding fits cleanly on 320px screens.
- [ ] **Biography & Quote Box:**
  - Responsive blockquote with custom left border and font sizing (`text-base sm:text-xl`).
- [ ] **Interactive Career Timeline:**
  - Verify line positioning (`left-6 sm:left-8`), node alignment, and text content offset (`pl-14 sm:pl-20`).
  - Ensure zero horizontal text overflow on narrow viewports.
- [ ] **Hospital Affiliations & Memberships:**
  - Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.
  - Badges and cards adapt cleanly without awkward wrapping.
- [ ] **Awards & Recognitions:**
  - Responsive card grid or vertical list with trophy icons.

---

### Step 3: Treatments (`src/pages/Treatments.tsx`)

- [ ] **Hero & Category Filter Tabs:**
  - Category selector: Horizontally scrollable chips with hidden scrollbar (`flex overflow-x-auto no-scrollbar gap-2 pb-2`) or responsive grid so pills don't wrap into 4 clunky rows.
- [ ] **Treatment Cards:**
  - 1 column on mobile (`< 640px`), 2 columns on tablet (`640px - 1023px`), 3 columns on desktop (`1024px+`).
  - Treatment tags (Recovery time, Hospital stay, Anesthesia) badge row wrapping.
- [ ] **Interactive Treatment Details Modal / Expanded Drawer:**
  - Centered modal on desktop, smooth bottom sheet on mobile (`max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl`).
- [ ] **Surgical FAQ & Recovery Guidelines:**
  - Mobile-optimized accordion items.

---

### Step 4: Patient Resources (`src/pages/PatientResources.tsx`)

- [ ] **Hero & Search Filter:**
  - Full-width search bar with clear button on mobile.
- [ ] **Resource Categories (Pre-op, Post-op, Exercises, Diet, Insurance):**
  - Responsive tab switcher.
- [ ] **Downloadable Patient Guides / PDF Cards:**
  - File cards: Icon + Title + File size + Download CTA.
  - Download CTA full-width on mobile.
- [ ] **Interactive Pre/Post Surgery Checklist:**
  - Interactive checkboxes with touch-friendly tap targets (`min-h-[44px]`).
- [ ] **Insurance & TPA Section:**
  - Logos / partner names grid: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6`.

---

### Step 5: Blog & Health Articles (`src/pages/Blog.tsx`)

- [ ] **Header, Search & Category Filters:**
  - Responsive pill bar for tags (Arthritis, Joint Replacement, Sports Injury, Rehabilitation).
- [ ] **Featured Article Hero:**
  - Stack image and content vertically on mobile; side-by-side on desktop.
- [ ] **Article Grid:**
  - Responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.
  - Image aspect ratio lock (`aspect-[16/9]`) with object-cover.
- [ ] **Article Reader Modal:**
  - Fixed mobile header with close button, comfortable reading typography, scrollable body.

---

### Step 6: Surgery & Clinic Gallery (`src/pages/Gallery.tsx`)

- [ ] **Filter Controls:**
  - Category pill filter with active state.
- [ ] **Image Grid / Masonry:**
  - `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6`.
  - Image hover overlay accessible via tap on mobile.
- [ ] **Fullscreen Lightbox / Modal:**
  - Touch-friendly close button (top right, large tap area).
  - Next / Previous buttons scaled for thumb zones or mobile swipe gestures.
  - Image containment: `max-w-[95vw] max-h-[80vh] object-contain`.

---

### Step 7: Contact Us (`src/pages/Contact.tsx`)

- [ ] **3 Clinic Locations Cards (Salt Lake, Alipore, Newtown):**
  - Stacks into 3 cards on mobile, 3-column grid on desktop.
  - Timings table, direct `tel:` and `mailto:` links, "Get Directions" Google Maps CTA.
- [ ] **Interactive Consultation Schedule:**
  - Day-by-day clinic timing table with clear visual highlighting of today's schedule.
- [ ] **Contact / Inquiry Form:**
  - Mobile inputs with correct keyboard types (`type="tel"`, `type="email"`).
  - Full-width submit button.
- [ ] **Emergency Contact Banner:**
  - Prominent emergency call button with 24/7 hotline.

---

### Step 8: Book Appointment Wizard (`src/pages/BookAppointment.tsx`)

- [ ] **Wizard Step Progress Header:**
  - Multi-step indicator (Step 1: Clinic & Date, Step 2: Time Slot, Step 3: Details).
  - Compact mobile representation (e.g. "Step 2 of 3: Choose Slot" with progress bar) to avoid text truncation on small screens.
- [ ] **Step 1 — Clinic & Date Selection:**
  - Clinic selection radio cards: Clear active border, full-width on mobile.
  - Date picker: Big touch target calendar date selector or quick day pills.
- [ ] **Step 2 — Slot Picker:**
  - Morning / Evening slots grid: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5`.
  - Available vs booked vs selected visual states with min 44px touch height.
- [ ] **Step 3 — Patient Details Form:**
  - Responsive form layout: 2-column fields collapse to single column on mobile.
- [ ] **Confirmation & Summary Screen:**
  - Appointment receipt card with QR / Booking Reference.
  - Action buttons (WhatsApp confirmation, Add to Google/Apple Calendar .ics) stacked on mobile.

---

### Step 9: Track & Manage Booking (`src/pages/MyBooking.tsx`)

- [ ] **Lookup Card:**
  - Search input by Booking ID or Mobile number with clear submit button.
- [ ] **Booking Details View:**
  - Status badge (Confirmed, Completed, Rescheduled, Cancelled).
  - Key-value list of clinic, doctor, date, time slot, patient name.
  - Action buttons (Reschedule, Cancel Appointment, Download Receipt) stacked on mobile.
- [ ] **Reschedule Modal:**
  - Mobile bottom-sheet layout with slot picker.

---

### Step 10: Staff Admin Dashboard (`src/pages/AdminDashboard.tsx`)

- [ ] **Dashboard Header & Navigation:**
  - Clinic switcher & date picker in flexible wrap layout.
  - Quick action buttons (Block Date, New Booking, Export).
- [ ] **KPI Stat Cards:**
  - `grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6`.
- [ ] **Appointments Data View:**
  - Desktop: Clean data table with sortable columns.
  - Mobile/Tablet: Either responsive card view for each appointment or table inside horizontal scrolling container with fixed sticky actions.
- [ ] **Status Change & Modal Windows:**
  - Modals adapt to mobile screen size with sticky header & footer action bar.

---

## 5. Verification & Testing Strategy

For every page completed:
1. **Automated Verification:**
   - Run `npx tsc --noEmit` to verify 0 TypeScript compilation errors.
   - Run `npm run build` or Vite build check to ensure clean bundles.
2. **Visual & Responsive Testing:**
   - Test at `360px` (Small Android/iPhone SE).
   - Test at `390px` (Standard iPhone 12/13/14/15/16).
   - Test at `768px` (iPad portrait).
   - Test at `1024px` (iPad landscape / small laptop).
   - Test at `1440px` (Desktop).
3. **Interactive Validation:**
   - Verify hamburger drawer open/close.
   - Verify all form inputs, date pickers, and slot selections.
   - Confirm zero horizontal scrollbar on every page.
