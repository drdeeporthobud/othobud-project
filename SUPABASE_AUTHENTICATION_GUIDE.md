# Orthobud Clinic: Supabase Staff Authentication & Role Isolation System

This guide explains the architecture, security model, features, setup instructions, and workflows for the Orthobud Clinic Staff Authentication and Management system.

---

## 1. System Architecture & How It Works

The authentication system is built on **Supabase (PostgreSQL)** and follows modern healthcare security standards by dividing user data into two distinct layers:

```
                                      ┌─────────────────────────────────────────────────────────────┐
                                      │                     SUPABASE DATABASE                       │
                                      ├──────────────────────────────┬──────────────────────────────┤
                                      │  auth schema (SECURE AUTH)   │    public schema (TABLES)    │
                                      ├──────────────────────────────┼──────────────────────────────┤
                                      │                              │                              │
Staff Member                          │  auth.users                  │  public.user_profiles        │
Logs in with:                         │  • id (UUID)                 │  • id (references auth.users)│
Username + Password ────────────────► │  • email (internal mapping)  │  • username ("drdeep")       │
                                      │  • encrypted_password        │  • full_name                 │
                                      │    (bcrypt hash - one way)   │  • role (doctor/admin/rec)   │
                                      │                              │  • assigned_clinic_id        │
                                      │                              │  • is_active (boolean)       │
                                      └──────────────────────────────┴──────────────────────────────┘
```

### A. Two-Tier Data Separation
1. **`auth.users` (Protected Internal Supabase Auth Engine)**:
   - Supabase's native authentication table.
   - **Passwords are never stored in plain text**. They are cryptographically hashed using **bcrypt** (`crypt(password, gen_salt('bf'))`).
   - Requires an email format. Our system automatically maps any short username (e.g. `drdeep`) to an internal system email: `<username>@orthobud.internal`.
2. **`public.user_profiles` (Staff Clinical Profile & Permissions)**:
   - Stores clinical metadata: staff username, full name, role (`doctor`, `receptionist`, `admin`), active status, and clinic branch assignment.
   - Links 1-to-1 with `auth.users` via the unique User ID (`id UUID`).

---

## 2. Key Points You Need to Know

### 1. Auto-Role Detection (No Role Dropdown Needed on Login)
- Staff do not have to guess or manually choose their role when logging in.
- Staff simply enter their **Username & Password**.
- The backend identifies their profile, validates credentials, checks that the account is active, and automatically routes them to their authorized view.

### 2. Admin User Creation Without Session Termination
- In standard Supabase, calling `supabase.auth.signUp()` immediately signs in the newly registered user in the browser, which would log the Admin out.
- To prevent this, we use a PostgreSQL **`SECURITY DEFINER` RPC function** (`admin_create_staff_user`).
- When the Admin adds a new receptionist or doctor from the dashboard, this SQL function writes directly into `auth.users` and `public.user_profiles` inside PostgreSQL.
- **The Admin remains logged in continuously**, and the new credentials are immediately active.

### 3. Clinic Branch Locking for Receptionists
- Receptionists are strictly bound to their assigned branch (e.g. Salt Lake, New Town, or Lake Town).
- Upon login, their dashboard locks `selectedClinicId` to their assigned branch.
- They cannot see or alter other clinics' patient queues, tokens, or slot matrices.

### 4. Workstation Session Security (`sessionStorage`)
- Staff sessions are maintained in `sessionStorage`.
- **Page refreshes**: Staff stay logged in so they don't lose active patient queues during clinic hours.
- **Closing the browser tab**: Immediately destroys the session, preventing unauthorized access on shared front-desk computers.

### 5. Resilient Offline / Local Fallback
- If Supabase environment variables are missing or if the database schema has not yet been executed in the cloud, [`src/services/staffAuthService.ts`](file:///c:/Users/soham/coding/various/Multi-page%20Orthopedic%20Website/src/services/staffAuthService.ts) automatically falls back to local storage seeded accounts.
- This ensures your website, UI testing, and presentation are never interrupted by network outages or pending cloud setups.

---

## 3. Features & Capabilities

| Feature | Description | Where It Lives |
| :--- | :--- | :--- |
| **Gateway Sign-In** | Minimal, high-contrast dark navy login console with Caps-Lock detection and show/hide password toggle. | [`src/components/AdminLogin.tsx`](file:///c:/Users/soham/coding/various/Multi-page%20Orthopedic%20Website/src/components/AdminLogin.tsx) |
| **1-Click Test Credentials** | Helper drawer allowing 1-click test credential population for Doctor, Front Desk, and Admin. | Bottom of the Login card |
| **Staff Directory Table** | Complete list of all staff with names, usernames, role badges, branch assignments, and status toggles. | Admin Dashboard → **Staff & Access Management** |
| **Add New Staff Member** | Modal to register new staff with automatic alphanumeric username formatting, role selection, branch binding, and password generator. | Staff Management → `[Add New Staff Member]` |
| **1-Click Credential Card** | Instant modal displaying new credentials with a `[Copy Login Details]` button to share with staff. | Pops up immediately upon staff creation |
| **Password Reset** | Admin can reset any staff member's password on the spot with a custom or auto-generated password. | Staff Directory → `[Reset Password]` action |
| **Account Suspend / Reactivate** | Instantly deactivate a staff member's login access without deleting historical appointment records. | Staff Directory → `[Deactivate / Reactivate]` button |
| **Perimeter Role Guard** | Unauthenticated visitors to `/admin` are gated by the login screen. No unauthorized view-switching is permitted. | [`src/pages/AdminDashboard.tsx`](file:///c:/Users/soham/coding/various/Multi-page%20Orthopedic%20Website/src/pages/AdminDashboard.tsx) |

---

## 4. Default Seed Accounts (Out-of-the-Box)

The following default accounts are seeded in the database:

| Role | Username | Password | Default Clinic Context | Access Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin2026` | All Clinics | Complete Practice Overview, Doctor Operating Schedules, Staff & Access Management |
| **Doctor** | `drdeep` | `ortho2026` | Multi-Clinic (Doctor Roster) | Clinical Consultation Queue, Diagnosis Notes, Delay Broadcaster, OT Leave Blocker |
| **Receptionist** | `reception_saltlake` | `clinic123` | Salt Lake Sector 1 Clinic | Pending Request Review, Live Token Check-In, Slot Capacity Matrix, Walk-In Registration |

---

## 5. Should You Re-Run the SQL File in Supabase?

### A. If you have **NOT** run `supabase_schema.sql` yet:
👉 **YES, run the entire file once.**
1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard) and select your project.
2. In the left sidebar, click the **SQL Editor** icon (`>_`).
3. Click **New query**.
4. Copy all content from [`supabase_schema.sql`](file:///c:/Users/soham/coding/various/Multi-page%20Orthopedic%20Website/supabase_schema.sql) and paste it into the editor.
5. Click **Run** (green button).
6. Result: All tables, functions, and seed accounts (`admin`, `drdeep`, `reception_saltlake`) will be created in your cloud database!

### B. If you **ALREADY** ran `supabase_schema.sql` earlier:
You do **NOT** need to recreate all tables. However:
1. Re-running the entire file is **100% safe and idempotent** (it uses `CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`, and `CREATE OR REPLACE FUNCTION`).
2. If you want to update the Admin account name from `"Practice Administrator"` to `"Admin"` in your already-seeded Supabase database, simply run this quick 1-line query in the SQL Editor:
   ```sql
   UPDATE public.user_profiles
   SET full_name = 'Admin'
   WHERE username = 'admin';
   ```

---

## 6. How the Frontend Code Connects to Supabase

| File Path | Purpose | Key Responsibilities |
| :--- | :--- | :--- |
| [`src/lib/supabase.ts`](file:///c:/Users/soham/coding/various/Multi-page%20Orthopedic%20Website/src/lib/supabase.ts) | Client Initializer | Reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `.env` and exports the singleton `supabase` client. |
| [`src/services/staffAuthService.ts`](file:///c:/Users/soham/coding/various/Multi-page%20Orthopedic%20Website/src/services/staffAuthService.ts) | Auth & Staff Service | Calls `get_staff_profile_by_username`, executes `signInWithPassword`, manages `sessionStorage`, handles user creation via RPC, and provides local fallback. |
| [`src/components/AdminLogin.tsx`](file:///c:/Users/soham/coding/various/Multi-page%20Orthopedic%20Website/src/components/AdminLogin.tsx) | Login UI Component | Collects username & password, shows loading/error states, and triggers role routing upon successful verification. |
| [`src/components/StaffManagement.tsx`](file:///c:/Users/soham/coding/various/Multi-page%20Orthopedic%20Website/src/components/StaffManagement.tsx) | Staff Management UI | Interactive Staff Directory, Add Staff Modal, Password Reset Modal, and 1-click Credential Copy Card. |
| [`src/pages/AdminDashboard.tsx`](file:///c:/Users/soham/coding/various/Multi-page%20Orthopedic%20Website/src/pages/AdminDashboard.tsx) | Portal Gatekeeper & Router | Enforces authentication, displays active staff badge, locks receptionists to clinic branches, and renders Doctor, Receptionist, or Admin views. |

---

## 7. How to Verify Everything Live

1. Open `http://localhost:8443/admin`.
2. Enter `admin` and `admin2026` → Click **Authenticate**.
3. You will land in the Admin portal with your profile showing **Admin** and `@admin`.
4. Click on the **Staff & Access Management** tab.
5. Click **Add New Staff Member**:
   - Name: `Pooja Roy`
   - Username: `pooja_saltlake`
   - Role: `Receptionist`
   - Branch: `Salt Lake Sector 1 Clinic`
   - Password: `poojapass123`
6. Click **Create Staff Member** → Copy the credentials from the popup.
7. Click **Sign Out** in the top navigation bar.
8. Log in with `pooja_saltlake` and `poojapass123`.
9. Notice that Pooja is automatically logged into the **Receptionist Dashboard** and strictly locked to **Salt Lake Clinic**!
