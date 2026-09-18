-- ==============================================================================
-- ORTHOBUD CLINIC DATABASE SCHEMA & CONCURRENCY CONTROL ENGINE
-- Doctor: Dr. Deep Chakraborty (Orthopedic Surgeon)
-- Clinics: Salt Lake, Alipore, Newtown (Kolkata)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 2. ROLE ENUM
DO $$ BEGIN
  CREATE TYPE user_role_type AS ENUM ('admin', 'doctor', 'receptionist');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. CLINICS TABLE (created BEFORE user_profiles so FK reference is valid)
CREATE TABLE IF NOT EXISTS clinics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL,
  city TEXT DEFAULT 'Kolkata',
  landmark TEXT,
  phone TEXT NOT NULL,
  whatsapp_number TEXT,
  google_maps_url TEXT,
  operating_days INT[] NOT NULL, -- 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 7=Sun
  slot_duration_minutes INT DEFAULT 30,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER PROFILES TABLE (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role_type NOT NULL DEFAULT 'receptionist',
  assigned_clinic_id UUID REFERENCES clinics(id) ON DELETE SET NULL, -- NULL for Admin & Doctor; UUID for branch Receptionist
  phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CLINIC OPERATING HOURS TABLE
CREATE TABLE IF NOT EXISTS clinic_operating_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL, -- 1=Monday .. 7=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_patients_per_slot INT DEFAULT 1,
  CONSTRAINT unique_clinic_day_slot UNIQUE(clinic_id, day_of_week, start_time)
);

-- 6. DOCTOR LEAVES & BLOCKED DATES
CREATE TABLE IF NOT EXISTS doctor_blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE, -- NULL applies to all clinics
  blocked_date DATE NOT NULL,
  start_time TIME, -- NULL blocks entire day
  end_time TIME,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. APPOINTMENTS TABLE
DO $$ BEGIN
  CREATE TYPE appointment_status AS ENUM (
    'pending', 'confirmed', 'arrived', 'in_consultation', 'completed', 'cancelled', 'no_show'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS appointments (
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

-- 8. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_appointments_date_clinic ON appointments(appointment_date, clinic_id, status);
CREATE INDEX IF NOT EXISTS idx_appointments_ref ON appointments(booking_reference);
CREATE INDEX IF NOT EXISTS idx_appointments_phone ON appointments(patient_phone);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_operating_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 9.1 Helper Functions for RLS (Bypasses RLS recursion via SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    OR
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin' AND is_active = true
    )
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_doctor()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'doctor')
    OR
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'doctor') AND is_active = true
    )
  );
$$;

CREATE OR REPLACE FUNCTION public.is_receptionist()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'receptionist'
    OR
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'receptionist' AND is_active = true
    )
  );
$$;

CREATE OR REPLACE FUNCTION public.get_auth_user_clinic_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT assigned_clinic_id FROM public.user_profiles
  WHERE id = auth.uid() AND is_active = true
  LIMIT 1;
$$;

-- Allow public read access to clinics, hours, and leaves
DROP POLICY IF EXISTS "Public can view clinics" ON clinics;
CREATE POLICY "Public can view clinics" ON clinics FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view hours" ON clinic_operating_hours;
DROP POLICY IF EXISTS "Public can view operating hours" ON clinic_operating_hours;
CREATE POLICY "Public can view operating hours" ON clinic_operating_hours FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view blocked dates" ON doctor_blocked_dates;
CREATE POLICY "Public can view blocked dates" ON doctor_blocked_dates FOR SELECT USING (true);

DROP POLICY IF EXISTS "Doctors and admins can insert blocked dates" ON doctor_blocked_dates;
CREATE POLICY "Doctors and admins can insert blocked dates"
  ON doctor_blocked_dates FOR INSERT
  WITH CHECK (auth.uid() IS NULL OR public.is_admin_or_doctor());

DROP POLICY IF EXISTS "Doctors and admins can delete blocked dates" ON doctor_blocked_dates;
CREATE POLICY "Doctors and admins can delete blocked dates"
  ON doctor_blocked_dates FOR DELETE
  USING (auth.uid() IS NULL OR public.is_admin_or_doctor());

-- user_profiles: Authenticated staff can read their own profile
DROP POLICY IF EXISTS "Staff can view own profile" ON user_profiles;
CREATE POLICY "Staff can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- user_profiles: Admins can read all profiles (uses SECURITY DEFINER helper to prevent recursion)
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  USING (public.is_admin());

-- Appointments: public can insert (patients booking online)
DROP POLICY IF EXISTS "Public can insert appointments" ON appointments;
CREATE POLICY "Public can insert appointments" ON appointments FOR INSERT WITH CHECK (true);

-- Appointments: role-aware SELECT (unauthenticated, admin/doctor see all, receptionist sees assigned clinic)
DROP POLICY IF EXISTS "Public can view appointments" ON appointments;
DROP POLICY IF EXISTS "Appointment access by role" ON appointments;
CREATE POLICY "Appointment access by role" ON appointments FOR SELECT
  USING (
    auth.uid() IS NULL
    OR
    public.is_admin_or_doctor()
    OR
    (public.is_receptionist() AND clinic_id = public.get_auth_user_clinic_id())
  );

-- Appointments: role-aware UPDATE (unauthenticated for reference cancel, admin/doctor all, receptionist assigned clinic)
DROP POLICY IF EXISTS "Public can update appointments" ON appointments;
DROP POLICY IF EXISTS "Appointment updates by role" ON appointments;
CREATE POLICY "Appointment updates by role" ON appointments FOR UPDATE
  USING (
    auth.uid() IS NULL
    OR
    public.is_admin_or_doctor()
    OR
    (public.is_receptionist() AND clinic_id = public.get_auth_user_clinic_id())
  );

-- 10. SEED CLINIC DATA
INSERT INTO clinics (id, name, slug, address, landmark, phone, whatsapp_number, google_maps_url, operating_days, slot_duration_minutes)
VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Alexa Newtown', 'alexa-newtown', 'Snehodiya, Street No 165, BC Block, Action Area I, Newtown, Kolkata 700163', 'Near Snehodiya Senior Living, Action Area I', '+91 79801 44046', '917980144046', 'https://maps.google.com/?q=Snehodiya+Street+165+BC+Block+Action+Area+I+Newtown+Kolkata+700163', ARRAY[1,2,3,4,5,6], 30),
  ('c2222222-2222-2222-2222-222222222222', 'Manipal Hospital Broadway', 'manipal-broadway', 'JC-16 & 17, No. 3A, Broadway Road, Sector 3, Bidhannagar, Salt Lake, Kolkata 700106', 'Broadway Road, Sector 3, Salt Lake', '+91 79801 44046', '917980144046', 'https://maps.google.com/?q=Manipal+Hospital+Broadway+Salt+Lake+Kolkata+700106', ARRAY[1,5], 30),
  ('c3333333-3333-3333-3333-333333333333', 'Narayana Barasat', 'narayana-barasat', '78, Jessore Road (South), Barasat, North 24 Parganas, Kolkata 700127', 'Jessore Road (South), Barasat', '+91 79801 44046', '917980144046', 'https://maps.google.com/?q=Narayana+Multispeciality+Hospital+Barasat+Jessore+Road+Kolkata+700127', ARRAY[3,6], 30),
  ('c4444444-4444-4444-4444-444444444444', 'Fortis', 'fortis', '730, Eastern Metropolitan Bypass, Anandapur, East Kolkata Township, Kolkata 700107', 'EM Bypass, Anandapur', '+91 79801 44046', '917980144046', 'https://maps.google.com/?q=Fortis+Hospital+EM+Bypass+Anandapur+Kolkata+700107', ARRAY[6], 30),
  ('c5555555-5555-5555-5555-555555555555', 'Daffodil Laketown', 'daffodil-laketown', '276, Canal Street, Sreebhumi, Lake Town, South Dumdum, Kolkata 700048', 'Canal Street, Sreebhumi', '+91 79801 44046', '917980144046', 'https://maps.google.com/?q=Daffodil+Hospital+Lake+Town+Canal+Street+Kolkata+700048', ARRAY[3,6], 30),
  ('c6666666-6666-6666-6666-666666666666', 'Apollo Clinic Newtown', 'apollo-newtown', 'The Galleria, 1B, Street Number 124, BG Block, Action Area I, Newtown, Kolkata 700163', 'The Galleria, Action Area I', '+91 79801 44046', '917980144046', 'https://maps.google.com/?q=Apollo+Clinic+The+Galleria+Street+124+BG+Block+Newtown+Kolkata+700163', ARRAY[2,4,5,7], 30)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  address = EXCLUDED.address,
  landmark = EXCLUDED.landmark,
  phone = EXCLUDED.phone,
  whatsapp_number = EXCLUDED.whatsapp_number,
  google_maps_url = EXCLUDED.google_maps_url,
  operating_days = EXCLUDED.operating_days;

-- 11. SEED OPERATING HOURS
INSERT INTO clinic_operating_hours (clinic_id, day_of_week, start_time, end_time)
VALUES
  -- 1. Alexa Newtown: Mon–Sat: 6:00 PM – 8:00 PM (18:00 - 20:00)
  ('c1111111-1111-1111-1111-111111111111', 1, '18:00', '20:00'),
  ('c1111111-1111-1111-1111-111111111111', 2, '18:00', '20:00'),
  ('c1111111-1111-1111-1111-111111111111', 3, '18:00', '20:00'),
  ('c1111111-1111-1111-1111-111111111111', 4, '18:00', '20:00'),
  ('c1111111-1111-1111-1111-111111111111', 5, '18:00', '20:00'),
  ('c1111111-1111-1111-1111-111111111111', 6, '18:00', '20:00'),
  
  -- 2. Manipal Hospital Broadway: Mon & Fri: 4:00 PM – 5:00 PM (16:00 - 17:00)
  ('c2222222-2222-2222-2222-222222222222', 1, '16:00', '17:00'),
  ('c2222222-2222-2222-2222-222222222222', 5, '16:00', '17:00'),
  
  -- 3. Narayana Barasat: Wed & Sat: 12:00 PM – 2:00 PM (12:00 - 14:00)
  ('c3333333-3333-3333-3333-333333333333', 3, '12:00', '14:00'),
  ('c3333333-3333-3333-3333-333333333333', 6, '12:00', '14:00'),
  
  -- 4. Fortis: Sat: 3:00 PM – 5:00 PM (15:00 - 17:00)
  ('c4444444-4444-4444-4444-444444444444', 6, '15:00', '17:00'),
  
  -- 5. Daffodil Laketown: Wed: 7:30 PM – 9:00 PM | Sat: 10:30 AM – 11:30 AM
  ('c5555555-5555-5555-5555-555555555555', 3, '19:30', '21:00'),
  ('c5555555-5555-5555-5555-555555555555', 6, '10:30', '11:30'),
  
  -- 6. Apollo Clinic Newtown: Tue, Thu, Fri, Sun: 4:30 PM – 6:00 PM (16:30 - 18:00)
  ('c6666666-6666-6666-6666-666666666666', 2, '16:30', '18:00'),
  ('c6666666-6666-6666-6666-666666666666', 4, '16:30', '18:00'),
  ('c6666666-6666-6666-6666-666666666666', 5, '16:30', '18:00'),
  ('c6666666-6666-6666-6666-666666666666', 7, '16:30', '18:00')
ON CONFLICT (clinic_id, day_of_week, start_time) DO NOTHING;

-- 12. DYNAMIC SLOT GENERATION STORED PROCEDURE (RPC)
CREATE OR REPLACE FUNCTION get_available_clinic_slots(
  p_clinic_id UUID,
  p_date DATE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_day_of_week INT;
  v_operating_hours RECORD;
  v_slot_duration INT;
  v_curr_time TIME;
  v_end_time TIME;
  v_is_blocked BOOLEAN;
  v_block_reason TEXT;
  v_slots JSONB := '[]'::JSONB;
  v_is_booked BOOLEAN;
  v_time_formatted TEXT;
BEGIN
  v_day_of_week := EXTRACT(ISODOW FROM p_date);

  -- Check if entire date is blocked by doctor
  SELECT EXISTS(
    SELECT 1 FROM doctor_blocked_dates
    WHERE (clinic_id = p_clinic_id OR clinic_id IS NULL)
      AND blocked_date = p_date
      AND start_time IS NULL
  ), (
    SELECT reason FROM doctor_blocked_dates
    WHERE (clinic_id = p_clinic_id OR clinic_id IS NULL)
      AND blocked_date = p_date
      AND start_time IS NULL
    LIMIT 1
  ) INTO v_is_blocked, v_block_reason;

  IF v_is_blocked THEN
    RETURN jsonb_build_object(
      'is_open', FALSE,
      'reason', COALESCE(v_block_reason, 'Doctor is on leave on this date'),
      'slots', '[]'::JSONB
    );
  END IF;

  -- Get clinic slot duration
  SELECT slot_duration_minutes INTO v_slot_duration
  FROM clinics WHERE id = p_clinic_id;
  IF v_slot_duration IS NULL THEN v_slot_duration := 30; END IF;

  -- Find operating hours for this day
  SELECT start_time, end_time INTO v_operating_hours
  FROM clinic_operating_hours
  WHERE clinic_id = p_clinic_id AND day_of_week = v_day_of_week;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'is_open', FALSE,
      'reason', 'Clinic is closed on this day of the week',
      'slots', '[]'::JSONB
    );
  END IF;

  -- Iterate and build slots
  v_curr_time := v_operating_hours.start_time;
  v_end_time := v_operating_hours.end_time;

  WHILE v_curr_time < v_end_time LOOP
    v_time_formatted := to_char(v_curr_time, 'FMHH12:MI AM');

    -- Check if booked
    SELECT EXISTS(
      SELECT 1 FROM appointments
      WHERE clinic_id = p_clinic_id
        AND appointment_date = p_date
        AND time_slot = v_time_formatted
        AND status IN ('confirmed', 'pending', 'arrived', 'in_consultation')
    ) INTO v_is_booked;

    v_slots := v_slots || jsonb_build_object(
      'time', v_time_formatted,
      'available', NOT v_is_booked
    );

    v_curr_time := v_curr_time + (v_slot_duration || ' minutes')::INTERVAL;
  END LOOP;

  RETURN jsonb_build_object(
    'is_open', TRUE,
    'reason', NULL,
    'slots', v_slots
  );
END;
$$;

-- 13. ATOMIC APPOINTMENT BOOKING PROCEDURE (RPC)
CREATE OR REPLACE FUNCTION book_appointment_atomic(
  p_clinic_id UUID,
  p_date DATE,
  p_time_slot TEXT,
  p_patient_name TEXT,
  p_patient_phone TEXT,
  p_patient_email TEXT,
  p_patient_age INT,
  p_patient_gender TEXT,
  p_condition TEXT,
  p_notes TEXT,
  p_insurance TEXT,
  p_first_visit BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_is_blocked BOOLEAN;
  v_ref TEXT;
  v_new_id UUID;
BEGIN
  -- Validate slot is not blocked
  SELECT EXISTS(
    SELECT 1 FROM doctor_blocked_dates
    WHERE (clinic_id = p_clinic_id OR clinic_id IS NULL)
      AND blocked_date = p_date
      AND (start_time IS NULL OR p_time_slot::TIME BETWEEN start_time AND end_time)
  ) INTO v_is_blocked;

  IF v_is_blocked THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', 'Doctor has blocked this time slot for urgent clinical duties.'
    );
  END IF;

  -- Generate human-friendly reference: ORTHO- + 6 alphanumeric chars
  v_ref := 'ORTHO-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 6));

  -- Insert with exclusion constraint check
  BEGIN
    INSERT INTO appointments (
      booking_reference,
      clinic_id,
      appointment_date,
      time_slot,
      patient_name,
      patient_phone,
      patient_email,
      patient_age,
      patient_gender,
      condition_reported,
      notes,
      insurance_provider,
      first_visit,
      status
    ) VALUES (
      v_ref,
      p_clinic_id,
      p_date,
      p_time_slot,
      p_patient_name,
      p_patient_phone,
      p_patient_email,
      p_patient_age,
      p_patient_gender,
      p_condition,
      p_notes,
      p_insurance,
      p_first_visit,
      'pending'
    )
    RETURNING id INTO v_new_id;

    RETURN jsonb_build_object(
      'success', TRUE,
      'booking_reference', v_ref,
      'appointment_id', v_new_id
    );
  EXCEPTION
    WHEN exclusion_violation THEN
      RETURN jsonb_build_object(
        'success', FALSE,
        'error', 'This slot was just booked by another patient. Please choose an adjacent slot.'
      );
  END;
END;
$$;

-- 14. SECURE APPOINTMENT LOOKUP PROCEDURE (RPC)
CREATE OR REPLACE FUNCTION get_appointment_by_ref(
  p_query TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_record RECORD;
BEGIN
  SELECT 
    a.id,
    a.booking_reference,
    a.clinic_id,
    c.name AS clinic_name,
    c.address AS clinic_address,
    c.google_maps_url,
    c.phone AS clinic_phone,
    a.appointment_date,
    a.time_slot,
    a.patient_name,
    a.patient_phone,
    a.patient_email,
    a.patient_age,
    a.patient_gender,
    a.condition_reported,
    a.notes,
    a.insurance_provider,
    a.first_visit,
    a.status,
    a.doctor_clinical_notes,
    a.cancellation_reason,
    a.created_at
  INTO v_record
  FROM appointments a
  LEFT JOIN clinics c ON a.clinic_id = c.id
  WHERE UPPER(a.booking_reference) = UPPER(TRIM(p_query))
     OR a.patient_phone = TRIM(p_query)
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  RETURN to_jsonb(v_record);
END;
$$;

-- 15. STAFF AUTHENTICATION & MANAGEMENT RPCS

-- 15.1 Username Profile Lookup (Used by login to resolve username -> auth email and check active status)
-- Returns generic error for both "not found" and "deactivated" to prevent username enumeration
CREATE OR REPLACE FUNCTION get_staff_profile_by_username(
  p_username TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user RECORD;
BEGIN
  SELECT 
    up.id,
    up.username,
    up.email,
    up.full_name,
    up.role,
    up.assigned_clinic_id,
    c.name AS assigned_clinic_name,
    up.phone,
    up.is_active
  INTO v_user
  FROM user_profiles up
  LEFT JOIN clinics c ON up.assigned_clinic_id = c.id
  WHERE LOWER(up.username) = LOWER(TRIM(p_username))
  LIMIT 1;

  -- Generic error for both "not found" and "deactivated" (prevents username enumeration)
  IF NOT FOUND OR NOT v_user.is_active THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Invalid credentials.');
  END IF;

  RETURN jsonb_build_object(
    'success', TRUE,
    'user', to_jsonb(v_user)
  );
END;
$$;

-- 15.2 Admin User Creation (Creates user in auth.users, auth.identities, and user_profiles)
CREATE OR REPLACE FUNCTION admin_create_staff_user(
  p_username TEXT,
  p_password TEXT,
  p_full_name TEXT,
  p_role user_role_type,
  p_clinic_id UUID DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_email TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_user_id UUID;
  v_generated_email TEXT;
BEGIN
  -- Verify the caller is an authenticated admin
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Unauthorized: Admin access required.');
  END IF;

  p_username := LOWER(TRIM(p_username));
  IF p_email IS NOT NULL AND TRIM(p_email) <> '' THEN
    v_generated_email := LOWER(TRIM(p_email));
  ELSE
    v_generated_email := p_username || '@orthobud.internal';
  END IF;

  -- Validation
  IF p_username IS NULL OR LENGTH(p_username) < 3 THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Username must be at least 3 characters.');
  END IF;

  IF p_password IS NULL OR LENGTH(p_password) < 8 THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Password must be at least 8 characters.');
  END IF;

  IF EXISTS (SELECT 1 FROM user_profiles WHERE LOWER(username) = p_username) THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Username already exists. Please pick another.');
  END IF;

  IF EXISTS (SELECT 1 FROM user_profiles WHERE LOWER(email) = v_generated_email) THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Email address is already in use.');
  END IF;

  v_new_user_id := uuid_generate_v4();

  -- 1. Insert into auth.users with encrypted password
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_new_user_id,
    'authenticated',
    'authenticated',
    v_generated_email,
    crypt(p_password, gen_salt('bf', 10)),
    NOW(),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
    jsonb_build_object('full_name', p_full_name, 'username', p_username, 'role', p_role),
    NOW(),
    NOW(),
    '', '', '', ''
  );

  -- 2. Insert into auth.identities (prevents GoTrue "Database error loading user")
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    v_new_user_id,
    v_new_user_id,
    format('{"sub":"%s","email":"%s"}', v_new_user_id::text, v_generated_email)::jsonb,
    'email',
    v_new_user_id::text,
    NOW(),
    NOW(),
    NOW()
  );

  -- 3. Insert into public.user_profiles
  INSERT INTO public.user_profiles (
    id,
    username,
    email,
    full_name,
    role,
    assigned_clinic_id,
    phone,
    is_active
  ) VALUES (
    v_new_user_id,
    p_username,
    v_generated_email,
    p_full_name,
    p_role,
    p_clinic_id,
    p_phone,
    TRUE
  );

  RETURN jsonb_build_object(
    'success', TRUE,
    'user_id', v_new_user_id,
    'username', p_username,
    'email', v_generated_email,
    'role', p_role
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', FALSE, 'error', SQLERRM);
END;
$$;

-- 15.3 Reset Staff Password by Admin
CREATE OR REPLACE FUNCTION admin_reset_staff_password(
  p_user_id UUID,
  p_new_password TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify the caller is an authenticated admin
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Unauthorized: Admin access required.');
  END IF;

  IF p_new_password IS NULL OR LENGTH(p_new_password) < 8 THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Password must be at least 8 characters.');
  END IF;

  UPDATE auth.users
  SET encrypted_password = crypt(p_new_password, gen_salt('bf', 10)),
      updated_at = NOW()
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'User not found in auth system.');
  END IF;

  UPDATE user_profiles
  SET updated_at = NOW()
  WHERE id = p_user_id;

  RETURN jsonb_build_object('success', TRUE);
END;
$$;

-- 15.4 Toggle Staff Active Status by Admin
CREATE OR REPLACE FUNCTION admin_toggle_staff_active(
  p_user_id UUID,
  p_is_active BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify the caller is an authenticated admin
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Unauthorized: Admin access required.');
  END IF;

  UPDATE user_profiles
  SET is_active = p_is_active,
      updated_at = NOW()
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Staff user not found.');
  END IF;

  RETURN jsonb_build_object('success', TRUE, 'is_active', p_is_active);
END;
$$;

-- 15.5 Delete Staff User by Admin
CREATE OR REPLACE FUNCTION admin_delete_staff_user(
  p_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify the caller is an authenticated admin
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Unauthorized: Admin access required.');
  END IF;

  -- Prevent admin from deleting themselves
  IF p_user_id = auth.uid() THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Cannot delete your own admin account.');
  END IF;

  -- Delete from auth.identities first
  DELETE FROM auth.identities WHERE user_id = p_user_id;

  -- Delete from public.user_profiles
  DELETE FROM public.user_profiles WHERE id = p_user_id;

  -- Delete from auth.users
  DELETE FROM auth.users WHERE id = p_user_id;

  RETURN jsonb_build_object('success', TRUE);
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', FALSE, 'error', SQLERRM);
END;
$$;

-- NOTE: No seed bootstrap block. Admin account must be created via the
-- one-time bootstrap SQL in the Supabase SQL Editor. Doctor and receptionist
-- accounts are then created through the Staff Management UI.


