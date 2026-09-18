-- ==============================================================================
-- SQL MIGRATION: UPDATE CLINIC NETWORK TO 6 LOCATIONS & SCHEDULES
-- Run this in the Supabase SQL Editor to update existing clinic records & hours.
-- ==============================================================================

-- 1. Upsert the 6 clinics into the clinics table
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
  operating_days = EXCLUDED.operating_days,
  slot_duration_minutes = EXCLUDED.slot_duration_minutes,
  is_active = TRUE;

-- 2. Clear old operating hours for these 6 clinics and replace with updated schedules
DELETE FROM clinic_operating_hours 
WHERE clinic_id IN (
  'c1111111-1111-1111-1111-111111111111',
  'c2222222-2222-2222-2222-222222222222',
  'c3333333-3333-3333-3333-333333333333',
  'c4444444-4444-4444-4444-444444444444',
  'c5555555-5555-5555-5555-555555555555',
  'c6666666-6666-6666-6666-666666666666'
);

-- 3. Insert fresh operating hours
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
