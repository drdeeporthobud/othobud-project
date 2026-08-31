-- ==============================================================================
-- ORTHOBUD CLINIC DATABASE SCHEMA & CONCURRENCY CONTROL ENGINE
-- Doctor: Dr. Deep Chakraborty (Orthopedic Surgeon)
-- Clinics: Salt Lake, Alipore, Newtown (Kolkata)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 2. USER PROFILES TABLE (Linked to Supabase Auth)
DO $$ BEGIN
  CREATE TYPE user_role_type AS ENUM ('admin', 'doctor', 'receptionist');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role_type NOT NULL DEFAULT 'receptionist',
  assigned_clinic_id UUID, -- NULL for Admin & Doctor; UUID for branch Receptionist
  phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CLINICS TABLE
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

-- 4. CLINIC OPERATING HOURS TABLE
CREATE TABLE IF NOT EXISTS clinic_operating_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL, -- 1=Monday .. 7=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_patients_per_slot INT DEFAULT 1,
  CONSTRAINT unique_clinic_day_slot UNIQUE(clinic_id, day_of_week, start_time)
);

-- 5. DOCTOR LEAVES & BLOCKED DATES
CREATE TABLE IF NOT EXISTS doctor_blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE, -- NULL applies to all clinics
  blocked_date DATE NOT NULL,
  start_time TIME, -- NULL blocks entire day
  end_time TIME,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. APPOINTMENTS TABLE
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

-- 7. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_appointments_date_clinic ON appointments(appointment_date, clinic_id, status);
CREATE INDEX IF NOT EXISTS idx_appointments_ref ON appointments(booking_reference);
CREATE INDEX IF NOT EXISTS idx_appointments_phone ON appointments(patient_phone);

-- 8. SEED CLINIC DATA
INSERT INTO clinics (id, name, slug, address, landmark, phone, whatsapp_number, google_maps_url, operating_days, slot_duration_minutes)
VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Salt Lake Clinic', 'salt-lake', 'Block EC, Sector 1, Salt Lake City, Kolkata - 700064', 'Near City Centre 1', '+91 98300 12345', '919830012345', 'https://maps.google.com/?q=Salt+Lake+City+Sector+1+Kolkata', ARRAY[1,2,3,4,5,6], 30),
  ('c2222222-2222-2222-2222-222222222222', 'Alipore Clinic', 'alipore', '24B, Alipore Road, Woodlands Hospital Complex, Kolkata - 700027', 'Near National Library', '+91 98300 23456', '919830023456', 'https://maps.google.com/?q=Alipore+Road+Kolkata', ARRAY[1,3,5], 30),
  ('c3333333-3333-3333-3333-333333333333', 'Newtown Clinic', 'newtown', 'Action Area 1, Major Arterial Road, Newtown, Kolkata - 700156', 'Near Axis Mall', '+91 98300 34567', '919830034567', 'https://maps.google.com/?q=Axis+Mall+Newtown+Kolkata', ARRAY[2,4], 30)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  operating_days = EXCLUDED.operating_days;

-- 9. SEED OPERATING HOURS
-- Salt Lake: Mon–Sat: 5:00 PM – 8:00 PM (30 min slots)
INSERT INTO clinic_operating_hours (clinic_id, day_of_week, start_time, end_time)
VALUES
  ('c1111111-1111-1111-1111-111111111111', 1, '17:00', '20:00'),
  ('c1111111-1111-1111-1111-111111111111', 2, '17:00', '20:00'),
  ('c1111111-1111-1111-1111-111111111111', 3, '17:00', '20:00'),
  ('c1111111-1111-1111-1111-111111111111', 4, '17:00', '20:00'),
  ('c1111111-1111-1111-1111-111111111111', 5, '17:00', '20:00'),
  ('c1111111-1111-1111-1111-111111111111', 6, '17:00', '20:00'),
  -- Alipore: Mon, Wed, Fri: 11:00 AM – 1:00 PM
  ('c2222222-2222-2222-2222-222222222222', 1, '11:00', '13:00'),
  ('c2222222-2222-2222-2222-222222222222', 3, '11:00', '13:00'),
  ('c2222222-2222-2222-2222-222222222222', 5, '11:00', '13:00'),
  -- Newtown: Tue, Thu: 6:00 PM – 9:00 PM
  ('c3333333-3333-3333-3333-333333333333', 2, '18:00', '21:00'),
  ('c3333333-3333-3333-3333-333333333333', 4, '18:00', '21:00')
ON CONFLICT (clinic_id, day_of_week, start_time) DO NOTHING;

-- 10. DYNAMIC SLOT GENERATION STORED PROCEDURE (RPC)
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
  -- 1=Sunday in PostgreSQL extract(DOW), let's map to 1=Mon .. 7=Sun
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
    -- Format time as hh:mm AM/PM (e.g. 5:00 PM)
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

-- 11. ATOMIC APPOINTMENT BOOKING PROCEDURE (RPC)
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
  v_ref TEXT;
  v_new_id UUID;
  v_is_blocked BOOLEAN;
BEGIN
  -- Verify doctor leave
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
      'confirmed'
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
