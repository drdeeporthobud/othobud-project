# Complete System Specification & Architecture Blueprint
**Project:** Orthobud — Dr. Deep Chakraborty (Orthopedic Surgeon Clinic)  
**System:** Multi-Clinic Online Patient Appointment, Clinical Management & Communication System  
**Document:** System Specification (`specification.md`)  
**Version:** 1.1 (Production Blueprint with Role-Based Access Control & Discrete Staff Entry)  
**Target Stack:** React 19 + TypeScript + Tailwind CSS v4 (Frontend) | Vercel (Hosting & Edge) | Supabase (PostgreSQL, Auth, Realtime)  

---

## 1. System Overview & Top-to-Bottom Architecture

The Orthobud platform is a full-stack healthcare web application designed to provide a frictionless appointment booking experience for patients across 3 clinic locations in Kolkata (Salt Lake, Alipore, Newtown), while providing Dr. Deep Chakraborty, clinic coordinators, and practice administrators with a secure, role-based management dashboard.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                    TOP LAYER: CLIENT UI                                │
│  • Public Patient Portal: Home, About, Treatments, Patient Resources, Blog, Gallery    │
│  • Dynamic Booking Wizard (/book-appointment): Multi-step live slot booking flow       │
│  • Patient Self-Service (/my-booking): Track, reschedule, cancel, download .ics invite │
│  • Discrete Staff Entry: Accessible via /admin, stealth footer key, or keyboard shortcut│
│  • Role-Specific Internal Dashboards: Doctor Portal, Clinic Receptionist, System Admin │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ HTTP / JSON / Supabase Client (RPC & RLS)
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                            CONNECTION & REQUEST MANAGEMENT LAYER                       │
│  • TypeScript Service Layer (`appointmentService.ts`): Typed API & query wrappers       │
│  • Role-Based Access Control (RBAC): JWT Role verification (Admin, Doctor, Reception)  │
│  • Concurrency Gate: Atomic RPC execution (`book_appointment_atomic`)                   │
│  • Fallback Engine: Seamless local/offline development mode when API is unconfigured    │
│  • Search Params Synchronizer: Pre-populates booking form from Hero, Treatment & Contact│
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                                 BACKEND & DATABASE LAYER                               │
│  • Supabase PostgreSQL Database (AWS Mumbai Region `ap-south-1`)                       │
│  • Relational Schema: `clinics`, `clinic_operating_hours`, `doctor_blocked_dates`,      │
│    `appointments`, `user_roles`, `audit_logs`                                          │
│  • Concurrency Control: PostgreSQL Exclusion Constraints (`btree_gist` + `EXCLUDE`)    │
│  • Row Level Security (RLS): Strict granular policies enforced per user role           │
│  • Dynamic Slot Calculation Engine: Procedural SQL function calculating live openings   │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                              NOTIFICATIONS & EXTERNAL PIPELINE                         │
│  • Primary (MVP): Instant WhatsApp deep-links + Resend Transactional Email + .ics invite│
│  • Phase 2 (Automated): Meta WhatsApp Cloud API / Gupshup Webhooks + SMS Fallback       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Discrete Staff Entry: How Admin, Doctor, and Receptionist Access the System Without a Public Login Button

### 2.1 Design Philosophy: Why No Public "Login" Button in Navigation
In modern healthcare UX (e.g., Practo, Apollo, Doctolib, Zocdoc), **patients should never be confused by a generic "Login" button** in the top navigation bar, as patients do not need passwords to book consultations. A prominent login button increases cognitive friction and causes patients to falsely assume they must register an account before booking.

### 2.2 Three Discrete Access Channels for Internal Staff

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        DISCRETE INTERNAL ACCESS MECHANISMS                             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. DIRECT SECURE URL:                                                                  │
│    • Staff navigates directly to `https://orthobud.in/admin` (or `/portal`).          │
│    • Bookmarked on Doctor's phone/tablet and clinic reception reception PCs.           │
│                                                                                        │
│ 2. DISCREET FOOTER ENTRY LINK:                                                         │
│    • In the bottom copyright strip (Footer.tsx), alongside Privacy/Terms:             │
│      "© 2025 Orthobud · Dr. Deep Chakraborty · [Staff Access 🔒]"                      │
│    • Low visual prominence for patients, but 100% accessible to staff from any device. │
│                                                                                        │
│ 3. GLOBAL KEYBOARD SHORTCUT:                                                           │
│    • Pressing `Ctrl + Shift + L` (Windows) or `Cmd + Shift + L` (Mac) from any public  │
│      page triggers a modal password prompt that routes to the internal portal.         │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Role-Based Access Control (RBAC) & Permission Limits

The internal system enforces **three distinct user roles** with strict boundaries defined at the database level using Supabase Row-Level Security (RLS).

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          INTERNAL ROLE HIERARCHY & CAPABILITIES                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  👑 ROLE 1: SYSTEM / CLINIC ADMIN (Practice Manager)                                   │
│  • Website Settings: Update clinic locations, addresses, phone numbers, Google Map URLs │
│  • Schedule Master: Define default clinic hours (e.g., Salt Lake 5–8 PM, Alipore 11–1) │
│  • User Management: Invite & create accounts for Receptionists; assign clinic branches │
│  • Global Analytics: View total bookings, cancellation rates, revenue summaries        │
│  • Master Override: Can edit or reassign any appointment across all clinics             │
│                                                                                        │
│  🩺 ROLE 2: DOCTOR (Dr. Deep Chakraborty)                                              │
│  • Multi-Clinic View: Live overview of all 3 clinic rosters (Salt Lake, Alipore, Newtown)│
│  • Clinical Workflow: View patient age, condition, notes; add private diagnosis notes  │
│  • Status Transitions: Mark `In Consultation`, `Completed`, `Follow-up Required`       │
│  • Emergency Schedule Manager: 1-click date blocker (surgeries, conferences, holidays) │
│  • Delay Broadcaster: Set delay notices (e.g., "Delayed 45m due to emergency surgery") │
│                                                                                        │
│  📋 ROLE 3: RECEPTIONIST / CLINIC COORDINATOR (Front Desk Staff)                       │
│  • Scoped Clinic View: Restricted strictly to their assigned branch (e.g., Salt Lake)  │
│  • Queue Management: Mark patient `Arrived (Checked In)`, `No Show`, or `Cancelled`   │
│  • Walk-in / Phone-in Intake: Manually book walk-in patients into open emergency slots  │
│  • Queue Operations: Print daily patient token sheet; resend WhatsApp confirmation     │
│  • RESTRICTIONS: Cannot view doctor's private clinical diagnosis notes; cannot modify  │
│    master clinic schedules; cannot edit website content; cannot delete appointments.   │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Granular Permission Matrix

| Capability / Action | System Admin 👑 | Doctor (Dr. Deep) 🩺 | Receptionist (Front Desk) 📋 | Public Patient 👤 |
| :--- | :---: | :---: | :---: | :---: |
| **Book an Appointment** |  Full |  Full |  (Scoped Branch) |  (Open Slots Only) |
| **View Live Patient Roster** |  (All Clinics) |  (All Clinics) |  (Assigned Branch Only) | ❌ Restricted |
| **Mark Patient Status (`Arrived`, `No-Show`)** |  Full |  Full |  (Assigned Branch) | ❌ Restricted |
| **Mark Status (`In Consultation`, `Completed`)** |  Full |  Full | ❌ Restricted (Doctor only) | ❌ Restricted |
| **Add / Edit Private Clinical Diagnosis Notes** | ❌ Restricted |  Full | ❌ Restricted (HIPAA/Confidential) | ❌ Restricted |
| **Block Doctor Leave / Emergency OT Blackout** |  Full |  Full | ❌ Restricted | ❌ Restricted |
| **Define Clinic Operating Hours & Master Slots** |  Full |  Review | ❌ Restricted | ❌ Restricted |
| **Create / Manage Receptionist Staff Accounts** |  Full |  Review | ❌ Restricted | ❌ Restricted |
| **View Patient Triage Info (Age, Concern)** |  Full |  Full |  (Assigned Branch) |  (Own Ref Only) |
| **Cancel / Reschedule Existing Appointment** |  Full |  Full |  (With Patient Consent) |  (Own Ref Only) |
| **Edit Website Content (Blog, About, Gallery)** |  Full |  Review | ❌ Restricted | ❌ Restricted |
| **Export Daily Queue to Print / CSV** |  Full |  Full |  (Assigned Branch) | ❌ Restricted |

---

## 4. Frontend System Specification

### 4.1 Complete Route Map

| Route | Component | Access Control | Key Functionality |
| :--- | :--- | :--- | :--- |
| `/` | `src/pages/Home.tsx` | Public | Hero, live counter stats, quick-booking widget, doctor intro, conditions grid, treatments preview, patient journey, reviews, FAQs, clinic strip. |
| `/about` | `src/pages/About.tsx` | Public | Full doctor biography, 2003–2023 career milestones, awards, hospital empanelments, media coverage, and verified credentials. |
| `/treatments` | `src/pages/Treatments.tsx` | Public | 6 category filters, 8 procedure cards with expandable symptoms & recovery drawer, and deep-linked booking actions. |
| `/patient-resources` | `src/pages/PatientResources.tsx` | Public | 4-tab knowledge base (Guides, Stories, FAQs, Downloads) with smooth CSS tab transitions and PDF downloads. |
| `/blog` | `src/pages/Blog.tsx` | Public | Real-time search filter, category pills, featured article, clinical insight cards with read times, newsletter subscription. |
| `/gallery` | `src/pages/Gallery.tsx` | Public | Masonry image grid with category filtering, full-screen lightbox modal viewer, and surgical outcome case studies. |
| `/contact` | `src/pages/Contact.tsx` | Public | 3 clinic cards (Salt Lake, Alipore, Newtown), quick contact bar (Call, WhatsApp, Email, Emergency), message enquiry form. |
| `/book-appointment` | `src/pages/BookAppointment.tsx` | Public | Dynamic 3-step booking wizard with real-time slot generation, clinical triage intake, and instant confirmation screen. |
| `/my-booking` | `src/pages/MyBooking.tsx` | Public (Token) | Patient self-service lookup by reference (`ORTHO-XXXXXX`), live status badge, GPS clinic directions, and `.ics` calendar export. |
| `/admin` | `src/pages/AdminDashboard.tsx` | Role-Based Auth | Staff login screen, role-specific navigation (Admin vs. Doctor vs. Receptionist), live patient queue, and schedule blocker. |

---

## 5. Backend & Database Specification (Supabase PostgreSQL)

### 5.1 Relational Schema & Role-Based Tables

```sql
-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 2. USER ROLES TABLE (Linked to Supabase auth.users)
CREATE TYPE user_role_type AS ENUM ('admin', 'doctor', 'receptionist');

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role_type NOT NULL DEFAULT 'receptionist',
  assigned_clinic_id UUID, -- NULL for Admin & Doctor; Specific UUID for Receptionist
  phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CLINICS TABLE
CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL,
  city TEXT DEFAULT 'Kolkata',
  landmark TEXT,
  phone TEXT NOT NULL,
  whatsapp_number TEXT,
  google_maps_url TEXT,
  operating_days INT[] NOT NULL, -- [1,2,3,4,5,6] (1=Mon, 7=Sun)
  slot_duration_minutes INT DEFAULT 30,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CLINIC OPERATING HOURS TABLE
CREATE TABLE clinic_operating_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL, -- 1=Monday .. 7=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_patients_per_slot INT DEFAULT 1,
  CONSTRAINT unique_clinic_day_slot UNIQUE(clinic_id, day_of_week, start_time)
);

-- 5. DOCTOR LEAVES & EMERGENCY BLOCKED DATES
CREATE TABLE doctor_blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE, -- NULL applies to all clinics
  blocked_date DATE NOT NULL,
  start_time TIME, -- NULL blocks entire day
  end_time TIME,
  reason TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. APPOINTMENTS TABLE
CREATE TYPE appointment_status AS ENUM (
  'pending', 'confirmed', 'arrived', 'in_consultation', 'completed', 'cancelled', 'no_show'
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference TEXT UNIQUE NOT NULL,
  clinic_id UUID REFERENCES clinics(id) ON DELETE RESTRICT,
  appointment_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  
  -- Patient Demographics & Contact
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_email TEXT,
  patient_age INT NOT NULL,
  patient_gender TEXT,
  first_visit BOOLEAN DEFAULT TRUE,
  
  -- Clinical Triage & Intake
  condition_reported TEXT NOT NULL,
  notes TEXT,
  insurance_provider TEXT,
  
  -- Clinical Workflow & Management
  status appointment_status DEFAULT 'confirmed',
  doctor_clinical_notes TEXT, -- Confidential: Doctor/Admin only
  cancellation_reason TEXT,
  created_by_staff BOOLEAN DEFAULT FALSE,
  
  -- Notification Audit
  whatsapp_confirmation_sent BOOLEAN DEFAULT FALSE,
  email_confirmation_sent BOOLEAN DEFAULT FALSE,
  reminder_sent BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Concurrency Exclusion Constraint: Mathematically eliminates double bookings
  CONSTRAINT no_overlapping_active_slots EXCLUDE USING gist (
    clinic_id WITH =,
    appointment_date WITH =,
    time_slot WITH =
  ) WHERE (status IN ('confirmed', 'pending', 'arrived', 'in_consultation'))
);

-- 7. PERFORMANCE INDEXES
CREATE INDEX idx_appointments_date_clinic ON appointments(appointment_date, clinic_id, status);
CREATE INDEX idx_appointments_ref ON appointments(booking_reference);
CREATE INDEX idx_appointments_phone ON appointments(patient_phone);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_operating_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Public can view active clinics and schedules
CREATE POLICY "Public Read Clinics" ON clinics FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public Read Operating Hours" ON clinic_operating_hours FOR SELECT USING (TRUE);
CREATE POLICY "Public Read Blocked Dates" ON doctor_blocked_dates FOR SELECT USING (TRUE);
CREATE POLICY "Public Read Appointment by Reference" ON appointments FOR SELECT USING (TRUE);

-- Authenticated Staff RLS
CREATE POLICY "Admin & Doctor Full Access" ON appointments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'doctor')
    )
  );

CREATE POLICY "Receptionist Clinic-Scoped Access" ON appointments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
        AND role = 'receptionist' 
        AND (assigned_clinic_id = appointments.clinic_id OR assigned_clinic_id IS NULL)
    )
  );
```

---

### 5.2 Concurrency Engine & Atomic Stored Procedures

#### 1. Atomic Booking Procedure (`book_appointment_atomic`)
Executes inside an ACID transaction to prevent race conditions:
1. Verifies doctor availability against `doctor_blocked_dates`.
2. Locks the target slot row (`FOR UPDATE`).
3. Validates slot capacity limits.
4. Inserts appointment and returns structured JSON with reference code `ORTHO-XXXXXX`.
5. Gracefully handles `23P01` unique exclusion collision with a friendly prompt.

#### 2. Dynamic Slot Generator (`get_available_clinic_slots`)
Calculates real-time slot availability for any date:
- Matches clinic operating hours for that day of the week.
- Subtracts doctor blackout leaves.
- Subtracts existing active bookings (`confirmed`, `pending`, `arrived`, `in_consultation`).
- Returns ordered array of slot times and boolean availability indicators.

---

## 6. Connection & Request Management Layer

### 6.1 TypeScript Service Layer (`src/services/appointmentService.ts`)

The frontend communicates with Supabase through typed service methods with a built-in local fallback mode for uninterrupted development and testing:

```typescript
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'doctor' | 'receptionist';
  assignedClinicId?: string;
}

export interface AppointmentPayload {
  clinicId: string;
  clinicName: string;
  date: string;
  timeSlot: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientAge: number;
  patientGender: string;
  condition: string;
  notes?: string;
  insurance?: string;
  firstVisit: boolean;
}
```

### 6.2 Request Processing Lifecycle

```
[Patient Selects Clinic & Date on Booking Wizard]
                  │
                  ├──► 1. `getAvailableSlots(clinicId, date)` invoked
                  │        └─► Calls Supabase `get_available_clinic_slots` RPC
                  │        └─► Disables booked slots; enables free slots
                  │
[Patient Enters Triage Details & Clicks Confirm]
                  │
                  ├──► 2. Client executes phone (10 digits), name, and condition validation
                  │
                  ├──► 3. `bookAppointment(payload)` executes atomic RPC
                  │        ├─► Success: Receives booking reference `ORTHO-XXXXXX`
                  │        │    ├─► Step 3 Confirmation view displayed
                  │        │    ├─► Appointment saved in localStorage cache
                  │        │    └─► Generates WhatsApp launch link & .ics calendar invite
                  │        │
                  │        └─► Collision (Race Condition):
                  │             └─► Displays: "Slot was just booked. Please pick an adjacent slot."
                  │             └─► Auto-refreshes slot matrix
```

---

## 7. Tooling Strategy: Primary (MVP Launch) vs. Backup (Phase 2)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PRIMARY TOOLS (LAUNCH MVP)                           │
│  • Hosting & Edge: Vercel (Hobby tier, global CDN, instant GitHub CI/CD)               │
│  • Database & Auth: Supabase PostgreSQL (AWS Mumbai ap-south-1, ACID transaction RPCs) │
│  • Patient Experience: Frictionless guest booking (Token tracking via /my-booking)     │
│  • Discrete Staff Access: Direct URL /admin + Footer link + Keyboard shortcut          │
│  • Staff Security: Supabase Auth (Email + Password) with RLS role enforcement          │
│  • Notifications: Instant WhatsApp Click-to-Chat pre-filled links + Resend Email Slip │
│  • Calendar: Client-side .ics download + Direct Google Calendar event URL generator    │
│  • Clinic Directions: Direct Google Maps navigation URL pins                           │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                            │
                                            ▼ Post-Launch / Scaling
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              BACKUP & PHASE 2 TOOLS (FUTURE ADDITIONS)                 │
│  • Automated Messaging: Meta WhatsApp Cloud API / Gupshup automated webhook delivery   │
│  • SMS Fallback: Fast2SMS / Twilio SMS gateway for non-WhatsApp patient numbers        │
│  • Map Experience: Interactive Google Maps JavaScript SDK with live traffic & routing  │
│  • Security / Verification: Phone OTP verification via Supabase Phone Auth / Twilio    │
│  • Patient Document Vault: Supabase Storage bucket for uploading prior MRI/X-ray PDFs   │
│  • Advanced Clinic Tools: Automated WhatsApp blast for doctor delays + PDF daily queue │
│  • Interactive Visuals: Before/After X-Ray image slider + Blog article modal reader   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Detailed Tooling Matrix

| Functional Area | Primary Tool (Launch MVP) | Backup / Phase 2 Tool (Future Addition) | Upgrade Rationale & Trigger |
| :--- | :--- | :--- | :--- |
| **Hosting & Deployment** | **Vercel** (Hobby Tier — $0/mo) | **Netlify** / **Cloudflare Pages** | Zero-config React/Vite builds and fast edge routing in India. |
| **Database & Concurrency** | **Supabase PostgreSQL** (Free Tier — $0/mo) | **Neon PostgreSQL** / **AWS RDS** | Built-in RLS, auth, and database RPCs without server management. |
| **Staff Authentication** | **Supabase Auth** (Email + Password on `/admin`) | **Supabase Magic Link / 2FA Authenticator** | Simple, robust, role-based security protecting the internal portal. |
| **Patient Identification** | **Frictionless Guest Booking + Reference Code** (`/my-booking?ref=...`) | **Phone OTP Verification** (Twilio / MSG91) | Avoids patient drop-off at launch; add OTP if spam bookings exceed 5%. |
| **Patient Confirmation** | **WhatsApp Click-to-Chat + Resend Email** | **Meta WhatsApp Cloud API (Automated Webhooks)** | Click-to-Chat requires $0 API costs at launch; upgrade to Cloud API as booking volume scales. |
| **Calendar Integration** | **Client-side `.ics` generator + Google Calendar Link** | **Google Calendar Bi-directional Sync API** | Instant, zero-latency calendar export with zero API keys required. |
| **Clinic Directions** | **Direct Google Maps Navigation URLs** | **Google Maps JavaScript API Embed** | Instant launch without requiring Google Cloud billing setup. |
| **Patient File Uploads** | **Pre-visit checklist instructions** ("Bring prior X-rays/MRI") | **Supabase Storage Bucket** (Encrypted PDF/DICOM upload) | Simplifies MVP; add digital uploads in Phase 2 for remote pre-op reviews. |

---

## 8. Doctor & Staff Admin Portal Specification (`/admin`)

### 8.1 Login Interface
- Route: `/admin`.
- Unauthenticated requests render a clean, branded staff login card (Email & Password).
- Validates credentials against Supabase Auth, retrieves user role from `user_profiles`, and redirects to the appropriate role-based dashboard view.

### 8.2 Role-Specific Views & Controls

#### 1. Doctor View (Dr. Deep Chakraborty):
- **Clinic Switcher Tabs:** `Salt Lake Clinic` | `Alipore Clinic` | `Newtown Clinic` | `All Clinics`.
- **Date Selector:** Quick toggle between Today, Tomorrow, and Custom Date.
- **Queue Overview:** Cards displaying patient name, age, phone, reported condition, first-visit tag, and arrival status.
- **Clinical Actions:**
  - `Mark In Consultation` / `Mark Completed` / `No-Show`.
  - Expandable **Clinical Notes Editor** to record private medical remarks.
- **Emergency Schedule Blocker:** Select date & clinic to block bookings instantly for conferences or urgent surgeries.

#### 2. Clinic Coordinator / Receptionist View:
- Scoped strictly to the receptionist's assigned clinic branch.
- **Quick Queue Actions:** `Mark Arrived (Checked In)` / `Mark No-Show` / `Resend WhatsApp Confirmation`.
- **Walk-in Booking Modal:** Fast intake form to register walk-in patients or telephone appointments into open slots.
- **Print Daily Roster:** Clean printable view with patient serial numbers, names, and contact details.

#### 3. System Admin View:
- Full access to all clinics, master schedule editor (adjusting operating hours), user management (inviting new receptionists), and platform audit logs.

---

## 9. Phased Implementation Roadmap

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               PHASED LAUNCH EXECUTION                                  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ STEP 1: Deploy Database Schema & Stored Procedures (Day 1)                             │
│ • Run `supabase_schema.sql` on Supabase to initialize tables, constraints, & RPCs.    │
│ • Seed clinic operating hours for Salt Lake, Alipore, and Newtown.                     │
│                                                                                        │
│ STEP 2: Implement Client Services & Concurrency Wrappers (Day 2)                       │
│ • Configure `src/lib/supabase.ts` and `src/services/appointmentService.ts`.            │
│ • Implement local offline fallback simulation for uninterrupted development.          │
│                                                                                        │
│ STEP 3: Connect Booking Wizard & Cross-Page Parameters (Day 3)                         │
│ • Wire `BookAppointment.tsx` to live slot generator RPCs.                             │
│ • Connect Home Quick Booking widget, Treatment cards, and Contact cards.               │
│ • Build Step 3 confirmation screen with `.ics` export & WhatsApp launcher.             │
│                                                                                        │
│ STEP 4: Build Patient Portal (`/my-booking`) & Staff Portal (`/admin`) (Day 4)         │
│ • Create `MyBooking.tsx` for self-service lookup, rescheduling, and cancellations.     │
│ • Create `AdminDashboard.tsx` with Supabase Auth, queue management, & leave blocker.   │
│                                                                                        │
│ STEP 5: Fix Frontend Visual Flaws & Production Launch on Vercel (Day 5)                │
│ • Fix `useReveal` tab animation bug in `PatientResources.tsx`.                         │
│ • Replace mismatched brain model and duplicate stock photos with authentic assets.     │
│ • Deploy project to Vercel and connect custom domain DNS.                              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Summary of Deliverables

1. **Discrete Staff Entry**: Staff access `/admin` seamlessly without confusing patients with a public login button.
2. **Clear Permission Boundaries**: Admin, Doctor, and Receptionist roles have explicitly defined viewing and editing limits.
3. **Guaranteed Concurrency**: PostgreSQL row locks and exclusion constraints eliminate double bookings.
4. **Pragmatic Tooling**: Primary zero-cost tools allow rapid launch on Vercel + Supabase, while backup tools provide a clear post-launch scaling roadmap.
