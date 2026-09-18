import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface ClinicSchedule {
  startHour: number
  startMin: number
  endHour: number
  endMin: number
}

export interface Clinic {
  id: string
  name: string
  slug: string
  address: string
  landmark: string
  phone: string
  whatsappNumber: string
  googleMapsUrl: string
  operatingDays: number[] // 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 7=Sun
  slotDurationMinutes: number
  hoursDescription: string
  daySchedules?: Record<number, ClinicSchedule>
}

export interface SlotInfo {
  time: string
  available: boolean
}

export interface SlotResponse {
  isOpen: boolean
  reason: string | null
  slots: SlotInfo[]
}

export interface AppointmentPayload {
  clinicId: string
  clinicName: string
  date: string
  timeSlot: string
  patientName: string
  patientPhone: string
  patientEmail?: string
  patientAge: number
  patientGender: string
  condition: string
  notes?: string
  insurance?: string
  firstVisit: boolean
  allowOverbook?: boolean
}

export interface AppointmentRecord extends AppointmentPayload {
  id: string
  bookingReference: string
  status: 'pending' | 'confirmed' | 'arrived' | 'in_consultation' | 'completed' | 'cancelled' | 'no_show'
  doctorClinicalNotes?: string
  cancellationReason?: string
  createdAt: string
}

export interface BlockedDate {
  id: string
  clinicId: string | null // null means all clinics
  blockedDate: string
  reason: string
}

// -----------------------------------------------------------------------------
// DEFAULT HARDWARE SEED DATA
// -----------------------------------------------------------------------------
export const DEFAULT_CLINICS: Clinic[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    name: 'Alexa Newtown',
    slug: 'alexa-newtown',
    address: 'Snehodiya, Street No 165, BC Block, Action Area I, Newtown, Kolkata 700163',
    landmark: 'Near Snehodiya Senior Living, Action Area I',
    phone: '+91 79801 44046',
    whatsappNumber: '917980144046',
    googleMapsUrl: 'https://maps.google.com/?q=Snehodiya+Street+165+BC+Block+Action+Area+I+Newtown+Kolkata+700163',
    operatingDays: [1, 2, 3, 4, 5, 6], // Mon-Sat
    slotDurationMinutes: 30,
    hoursDescription: 'Mon–Sat: 6:00 PM – 8:00 PM',
    daySchedules: {
      1: { startHour: 18, startMin: 0, endHour: 20, endMin: 0 },
      2: { startHour: 18, startMin: 0, endHour: 20, endMin: 0 },
      3: { startHour: 18, startMin: 0, endHour: 20, endMin: 0 },
      4: { startHour: 18, startMin: 0, endHour: 20, endMin: 0 },
      5: { startHour: 18, startMin: 0, endHour: 20, endMin: 0 },
      6: { startHour: 18, startMin: 0, endHour: 20, endMin: 0 },
    },
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    name: 'Manipal Hospital Broadway',
    slug: 'manipal-broadway',
    address: 'JC-16 & 17, No. 3A, Broadway Road, Sector 3, Bidhannagar, Salt Lake, Kolkata 700106',
    landmark: 'Broadway Road, Sector 3, Salt Lake',
    phone: '+91 79801 44046',
    whatsappNumber: '917980144046',
    googleMapsUrl: 'https://maps.google.com/?q=Manipal+Hospital+Broadway+Salt+Lake+Kolkata+700106',
    operatingDays: [1, 5], // Mon, Fri
    slotDurationMinutes: 30,
    hoursDescription: 'Mon & Fri: 4:00 PM – 5:00 PM',
    daySchedules: {
      1: { startHour: 16, startMin: 0, endHour: 17, endMin: 0 },
      5: { startHour: 16, startMin: 0, endHour: 17, endMin: 0 },
    },
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Narayana Barasat',
    slug: 'narayana-barasat',
    address: '78, Jessore Road (South), Barasat, North 24 Parganas, Kolkata 700127',
    landmark: 'Jessore Road South, Barasat',
    phone: '+91 79801 44046',
    whatsappNumber: '917980144046',
    googleMapsUrl: 'https://maps.google.com/?q=Narayana+Multispeciality+Hospital+Barasat+Jessore+Road+Kolkata+700127',
    operatingDays: [3, 6], // Wed, Sat
    slotDurationMinutes: 30,
    hoursDescription: 'Wed & Sat: 12:00 PM – 2:00 PM',
    daySchedules: {
      3: { startHour: 12, startMin: 0, endHour: 14, endMin: 0 },
      6: { startHour: 12, startMin: 0, endHour: 14, endMin: 0 },
    },
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    name: 'Fortis',
    slug: 'fortis',
    address: '730, Eastern Metropolitan Bypass, Anandapur, East Kolkata Township, Kolkata 700107',
    landmark: 'EM Bypass, Anandapur',
    phone: '+91 79801 44046',
    whatsappNumber: '917980144046',
    googleMapsUrl: 'https://maps.google.com/?q=Fortis+Hospital+EM+Bypass+Anandapur+Kolkata+700107',
    operatingDays: [6], // Sat
    slotDurationMinutes: 30,
    hoursDescription: 'Sat: 3:00 PM – 5:00 PM',
    daySchedules: {
      6: { startHour: 15, startMin: 0, endHour: 17, endMin: 0 },
    },
  },
  {
    id: 'c5555555-5555-5555-5555-555555555555',
    name: 'Daffodil Laketown',
    slug: 'daffodil-laketown',
    address: '276, Canal Street, Sreebhumi, Lake Town, South Dumdum, Kolkata 700048',
    landmark: 'Canal Street, Sreebhumi',
    phone: '+91 79801 44046',
    whatsappNumber: '917980144046',
    googleMapsUrl: 'https://maps.google.com/?q=Daffodil+Hospital+Lake+Town+Canal+Street+Kolkata+700048',
    operatingDays: [3, 6], // Wed, Sat
    slotDurationMinutes: 30,
    hoursDescription: 'Wed: 7:30 PM – 9:00 PM | Sat: 10:30 AM – 11:30 AM',
    daySchedules: {
      3: { startHour: 19, startMin: 30, endHour: 21, endMin: 0 },
      6: { startHour: 10, startMin: 30, endHour: 11, endMin: 30 },
    },
  },
  {
    id: 'c6666666-6666-6666-6666-666666666666',
    name: 'Apollo Clinic Newtown',
    slug: 'apollo-newtown',
    address: 'The Galleria, 1B, Street Number 124, BG Block, Action Area I, Newtown, Kolkata 700163',
    landmark: 'The Galleria, Action Area I',
    phone: '+91 79801 44046',
    whatsappNumber: '917980144046',
    googleMapsUrl: 'https://maps.google.com/?q=Apollo+Clinic+The+Galleria+Street+124+BG+Block+Newtown+Kolkata+700163',
    operatingDays: [2, 4, 5, 7], // Tue, Thu, Fri, Sun
    slotDurationMinutes: 30,
    hoursDescription: 'Tue, Thu, Fri, Sun: 4:30 PM – 6:00 PM',
    daySchedules: {
      2: { startHour: 16, startMin: 30, endHour: 18, endMin: 0 },
      4: { startHour: 16, startMin: 30, endHour: 18, endMin: 0 },
      5: { startHour: 16, startMin: 30, endHour: 18, endMin: 0 },
      7: { startHour: 16, startMin: 30, endHour: 18, endMin: 0 },
    },
  },
]

// -----------------------------------------------------------------------------
// LOCAL FALLBACK STORAGE HELPERS
// -----------------------------------------------------------------------------
const STORAGE_KEYS = {
  APPOINTMENTS: 'orthobud_appointments',
  BLOCKED_DATES: 'orthobud_blocked_dates',
  CLINICS: 'orthobud_clinics',
}

function getLocalAppointments(): AppointmentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalAppointments(list: AppointmentRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list))
  } catch (e) {
    console.error('LocalStorage write failed:', e)
  }
}

function getLocalBlockedDates(): BlockedDate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BLOCKED_DATES)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalBlockedDates(list: BlockedDate[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.BLOCKED_DATES, JSON.stringify(list))
  } catch (e) {
    console.error('LocalStorage write failed:', e)
  }
}

// -----------------------------------------------------------------------------
// LOCAL SLOT GENERATOR LOGIC (Mimics PostgreSQL get_available_clinic_slots RPC)
// -----------------------------------------------------------------------------
function generateLocalSlots(clinic: Clinic, dateStr: string): SlotResponse {
  const parts = dateStr.split('-').map(Number)
  if (parts.length !== 3) {
    return { isOpen: false, reason: 'Invalid date format', slots: [] }
  }
  const dateObj = new Date(parts[0], parts[1] - 1, parts[2])
  const jsDay = dateObj.getDay() // 0=Sun, 1=Mon .. 6=Sat
  const isoDay = jsDay === 0 ? 7 : jsDay // Map to 1=Mon .. 7=Sun

  // 1. Check if clinic is open on this day of the week
  if (!clinic.operatingDays.includes(isoDay)) {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const openDayNames = clinic.operatingDays.map((d) => dayNames[d - 1]).join(', ')
    return {
      isOpen: false,
      reason: `${clinic.name} is closed on this day. Open on: ${openDayNames}.`,
      slots: [],
    }
  }

  // 2. Check if doctor blocked this date
  const blockedDates = getLocalBlockedDates()
  const blocked = blockedDates.find(
    (b) => b.blockedDate === dateStr && (b.clinicId === clinic.id || b.clinicId === null)
  )
  if (blocked) {
    return {
      isOpen: false,
      reason: `Doctor is unavailable on this date (${blocked.reason || 'Emergency surgery/leave'}).`,
      slots: [],
    }
  }

  // 3. Generate time slot intervals based on clinic schedule
  let startHour = 18
  let startMin = 0
  let endHour = 20
  let endMin = 0

  if (clinic.daySchedules && clinic.daySchedules[isoDay]) {
    const sched = clinic.daySchedules[isoDay]
    startHour = sched.startHour
    startMin = sched.startMin
    endHour = sched.endHour
    endMin = sched.endMin
  } else if (clinic.slug === 'alexa-newtown') {
    startHour = 18
    startMin = 0
    endHour = 20
    endMin = 0
  } else if (clinic.slug === 'manipal-broadway') {
    startHour = 16
    startMin = 0
    endHour = 17
    endMin = 0
  } else if (clinic.slug === 'narayana-barasat') {
    startHour = 12
    startMin = 0
    endHour = 14
    endMin = 0
  } else if (clinic.slug === 'fortis') {
    startHour = 15
    startMin = 0
    endHour = 17
    endMin = 0
  } else if (clinic.slug === 'daffodil-laketown') {
    if (isoDay === 6) {
      startHour = 10
      startMin = 30
      endHour = 11
      endMin = 30
    } else {
      startHour = 19
      startMin = 30
      endHour = 21
      endMin = 0
    }
  } else if (clinic.slug === 'apollo-newtown') {
    startHour = 16
    startMin = 30
    endHour = 18
    endMin = 0
  }

  const slots: SlotInfo[] = []
  const current = new Date(dateObj)
  current.setHours(startHour, startMin, 0, 0)
  const end = new Date(dateObj)
  end.setHours(endHour, endMin, 0, 0)

  const appointments = getLocalAppointments().filter(
    (a) =>
      a.clinicId === clinic.id &&
      a.date === dateStr &&
      ['confirmed', 'pending', 'arrived', 'in_consultation'].includes(a.status)
  )

  while (current < end) {
    let h = current.getHours()
    const m = current.getMinutes()
    const ampm = h >= 12 ? 'PM' : 'AM'
    h = h % 12
    if (h === 0) h = 12
    const timeFormatted = `${h}:${m < 10 ? '0' : ''}${m} ${ampm}`

    const isBooked = appointments.some((a) => a.timeSlot === timeFormatted)

    slots.push({
      time: timeFormatted,
      available: !isBooked,
    })

    current.setMinutes(current.getMinutes() + clinic.slotDurationMinutes)
  }

  return {
    isOpen: true,
    reason: null,
    slots,
  }
}

// -----------------------------------------------------------------------------
// PUBLIC EXPORTED APPOINTMENT SERVICE API
// -----------------------------------------------------------------------------
export const appointmentService = {
  /**
   * Fetch all active clinics
   */
  async getClinics(): Promise<Clinic[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('clinics')
          .select('*')
          .eq('is_active', true)
        if (!error && data && data.length > 0) {
          const hasNewClinics = data.some(
            (d) =>
              d.slug === 'alexa-newtown' ||
              d.slug === 'manipal-broadway' ||
              d.slug === 'narayana-barasat' ||
              d.slug === 'daffodil-laketown' ||
              d.slug === 'apollo-newtown'
          )
          if (hasNewClinics) {
            return data.map((d) => {
              const fallbackClinic = DEFAULT_CLINICS.find((c) => c.slug === d.slug || c.id === d.id)
              return {
                id: d.id,
                name: d.name,
                slug: d.slug,
                address: d.address,
                landmark: d.landmark || fallbackClinic?.landmark || '',
                phone: d.phone,
                whatsappNumber: d.whatsapp_number || fallbackClinic?.whatsappNumber || '',
                googleMapsUrl: d.google_maps_url || fallbackClinic?.googleMapsUrl || '',
                operatingDays: d.operating_days || fallbackClinic?.operatingDays || [1, 2, 3, 4, 5, 6],
                slotDurationMinutes: d.slot_duration_minutes || fallbackClinic?.slotDurationMinutes || 30,
                hoursDescription:
                  fallbackClinic?.hoursDescription ||
                  (d.slug === 'alexa-newtown'
                    ? 'Mon–Sat: 6:00 PM – 8:00 PM'
                    : d.slug === 'manipal-broadway'
                    ? 'Mon & Fri: 4:00 PM – 5:00 PM'
                    : d.slug === 'narayana-barasat'
                    ? 'Wed & Sat: 12:00 PM – 2:00 PM'
                    : d.slug === 'fortis'
                    ? 'Sat: 3:00 PM – 5:00 PM'
                    : d.slug === 'daffodil-laketown'
                    ? 'Wed: 7:30 PM – 9:00 PM | Sat: 10:30 AM – 11:30 AM'
                    : d.slug === 'apollo-newtown'
                    ? 'Tue, Thu, Fri, Sun: 4:30 PM – 6:00 PM'
                    : 'Mon–Sat: 6:00 PM – 8:00 PM'),
                daySchedules: fallbackClinic?.daySchedules,
              }
            })
          }
        }
      } catch (err) {
        console.warn('Supabase getClinics error, using fallback:', err)
      }
    }
    return DEFAULT_CLINICS
  },

  /**
   * Get dynamic slots for a clinic on a specific date.
   *
   * The local DEFAULT_CLINICS schedule is ALWAYS the source of truth for which
   * days a clinic is open and what time slots are generated. Supabase is only
   * used as an overlay to check for existing bookings (mark slots as taken)
   * and doctor blocked dates.  This ensures the booking system works correctly
   * even when the Supabase database has not been migrated to the latest schema.
   */
  async getAvailableSlots(clinicId: string, dateStr: string): Promise<SlotResponse> {
    if (!clinicId || !dateStr) {
      return { isOpen: false, reason: 'Select clinic and date', slots: [] }
    }

    // 1. Always generate slots from the authoritative local schedule
    const clinic =
      DEFAULT_CLINICS.find((c) => c.id === clinicId || c.name === clinicId) ||
      DEFAULT_CLINICS[0]
    const result = generateLocalSlots(clinic, dateStr)

    // If clinic is closed on this day, return immediately (no DB check needed)
    if (!result.isOpen) {
      return result
    }

    // 2. When Supabase is configured, overlay booking & block data from the DB
    if (isSupabaseConfigured() && supabase) {
      try {
        // Check doctor blocked dates in Supabase
        const { data: blockedData } = await supabase
          .from('doctor_blocked_dates')
          .select('reason')
          .or(`clinic_id.eq.${clinicId},clinic_id.is.null`)
          .eq('blocked_date', dateStr)
          .limit(1)
          .maybeSingle()

        if (blockedData) {
          return {
            isOpen: false,
            reason: `Doctor is unavailable on this date (${blockedData.reason || 'Emergency surgery/leave'}).`,
            slots: [],
          }
        }

        // Check existing appointments in Supabase to mark slots as booked
        const { data: appointments } = await supabase
          .from('appointments')
          .select('time_slot')
          .eq('clinic_id', clinicId)
          .eq('appointment_date', dateStr)
          .in('status', ['confirmed', 'pending', 'arrived', 'in_consultation'])

        if (appointments && appointments.length > 0) {
          const bookedTimes = new Set(
            appointments.map((a: { time_slot: string }) => a.time_slot)
          )
          result.slots = result.slots.map((slot) => ({
            ...slot,
            available: slot.available && !bookedTimes.has(slot.time),
          }))
        }
      } catch (err) {
        console.warn('Supabase slot overlay check failed, using local schedule only:', err)
      }
    }

    return result
  },

  /**
   * Atomically book an appointment and eliminate race condition double-booking
   */
  async bookAppointment(
    payload: AppointmentPayload
  ): Promise<{ success: boolean; bookingReference?: string; appointmentId?: string; error?: string }> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.rpc('book_appointment_atomic', {
          p_clinic_id: payload.clinicId,
          p_date: payload.date,
          p_time_slot: payload.timeSlot,
          p_patient_name: payload.patientName,
          p_patient_phone: payload.patientPhone,
          p_patient_email: payload.patientEmail || null,
          p_patient_age: Number(payload.patientAge),
          p_patient_gender: payload.patientGender,
          p_condition: payload.condition,
          p_notes: payload.notes || null,
          p_insurance: payload.insurance || null,
          p_first_visit: payload.firstVisit,
        })

        if (error) {
          return { success: false, error: error.message }
        }
        if (data && data.success) {
          // Explicitly enforce status is 'pending' in Supabase in case database RPC has default 'confirmed'
          try {
            await supabase
              .from('appointments')
              .update({ status: 'pending' })
              .eq('id', data.appointment_id)
          } catch (updateErr) {
            console.warn('Could not enforce pending status on newly booked appointment:', updateErr)
          }

          // Cache in local storage for instantaneous offline reference lookup
          const newRecord: AppointmentRecord = {
            ...payload,
            id: data.appointment_id,
            bookingReference: data.booking_reference,
            status: 'pending',
            createdAt: new Date().toISOString(),
          }
          const existing = getLocalAppointments()
          saveLocalAppointments([newRecord, ...existing])

          return {
            success: true,
            bookingReference: data.booking_reference,
            appointmentId: data.appointment_id,
          }
        }
        return { success: false, error: data?.error || 'Failed to reserve appointment slot' }
      } catch (err: unknown) {
        console.warn('Supabase book_appointment_atomic failed, using fallback:', err)
      }
    }

    // Local Fallback Atomic Booking Simulation
    const existing = getLocalAppointments()
    const canOverbook = payload.allowOverbook || payload.timeSlot.includes('Fit-In') || payload.timeSlot.includes('Emergency')

    if (!canOverbook) {
      const isSlotTaken = existing.some(
        (a) =>
          a.clinicId === payload.clinicId &&
          a.date === payload.date &&
          a.timeSlot === payload.timeSlot &&
          ['confirmed', 'pending', 'arrived', 'in_consultation'].includes(a.status)
      )

      if (isSlotTaken) {
        return {
          success: false,
          error: 'This slot was just booked by another patient. Please choose an adjacent slot.',
        }
      }
    }

    const randomRef = 'ORTHO-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    const newId = 'app-' + Date.now()
    const newRecord: AppointmentRecord = {
      ...payload,
      id: newId,
      bookingReference: randomRef,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    saveLocalAppointments([newRecord, ...existing])

    return {
      success: true,
      bookingReference: randomRef,
      appointmentId: newId,
    }
  },

  /**
   * Find appointment by booking reference code (e.g. ORTHO-9B4F1A) or phone
   */
  async getAppointmentByReference(reference: string): Promise<AppointmentRecord | null> {
    const cleanRef = reference.trim().toUpperCase()
    if (!cleanRef) return null

    if (isSupabaseConfigured() && supabase) {
      try {
        // Try RPC first (SECURITY DEFINER)
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_appointment_by_ref', {
          p_query: cleanRef,
        })

        if (!rpcError && rpcData) {
          return {
            id: rpcData.id,
            bookingReference: rpcData.booking_reference,
            clinicId: rpcData.clinic_id,
            clinicName: rpcData.clinic_name || 'Orthopedic Clinic',
            date: rpcData.appointment_date,
            timeSlot: rpcData.time_slot,
            patientName: rpcData.patient_name,
            patientPhone: rpcData.patient_phone,
            patientEmail: rpcData.patient_email || undefined,
            patientAge: rpcData.patient_age,
            patientGender: rpcData.patient_gender || 'Other',
            condition: rpcData.condition_reported,
            notes: rpcData.notes || undefined,
            insurance: rpcData.insurance_provider || undefined,
            firstVisit: rpcData.first_visit,
            status: rpcData.status,
            doctorClinicalNotes: rpcData.doctor_clinical_notes || undefined,
            cancellationReason: rpcData.cancellation_reason || undefined,
            createdAt: rpcData.created_at,
          }
        }

        // Direct Table Query Fallback
        const { data, error } = await supabase
          .from('appointments')
          .select('*, clinics(name, address, google_maps_url, phone)')
          .or(`booking_reference.eq.${cleanRef},patient_phone.eq.${cleanRef}`)
          .limit(1)
          .maybeSingle()

        if (!error && data) {
          return {
            id: data.id,
            bookingReference: data.booking_reference,
            clinicId: data.clinic_id,
            clinicName: data.clinics?.name || 'Orthopedic Clinic',
            date: data.appointment_date,
            timeSlot: data.time_slot,
            patientName: data.patient_name,
            patientPhone: data.patient_phone,
            patientEmail: data.patient_email || undefined,
            patientAge: data.patient_age,
            patientGender: data.patient_gender || 'Other',
            condition: data.condition_reported,
            notes: data.notes || undefined,
            insurance: data.insurance_provider || undefined,
            firstVisit: data.first_visit,
            status: data.status,
            doctorClinicalNotes: data.doctor_clinical_notes || undefined,
            cancellationReason: data.cancellation_reason || undefined,
            createdAt: data.created_at,
          }
        }
      } catch (err) {
        console.warn('Supabase getAppointmentByReference error, checking local fallback:', err)
      }
    }

    const localList = getLocalAppointments()
    const match = localList.find(
      (a) =>
        a.bookingReference.toUpperCase() === cleanRef ||
        a.patientPhone.replace(/\D/g, '') === cleanRef.replace(/\D/g, '')
    )
    return match || null
  },

  /**
   * Cancel an appointment
   */
  async cancelAppointment(reference: string, reason: string): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('appointments')
          .update({
            status: 'cancelled',
            cancellation_reason: reason,
            updated_at: new Date().toISOString(),
          })
          .eq('booking_reference', reference)

        if (error) return { success: false, error: error.message }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        console.warn('Supabase cancelAppointment error:', err)
        return { success: false, error: message }
      }
    }

    const localList = getLocalAppointments()
    const updated = localList.map((a) =>
      a.bookingReference === reference
        ? { ...a, status: 'cancelled' as const, cancellationReason: reason }
        : a
    )
    saveLocalAppointments(updated)
    return { success: true }
  },

  /**
   * Update patient consultation status (Used by Doctor / Receptionist in /admin)
   */
  async updateAppointmentStatus(
    id: string,
    status: AppointmentRecord['status'],
    clinicalNotes?: string,
    cancellationReason?: string
  ): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const updateData: Record<string, unknown> = {
          status,
          updated_at: new Date().toISOString(),
        }
        if (clinicalNotes !== undefined) {
          updateData.doctor_clinical_notes = clinicalNotes
        }
        if (cancellationReason !== undefined) {
          updateData.cancellation_reason = cancellationReason
        }

        const { error } = await supabase
          .from('appointments')
          .update(updateData)
          .eq('id', id)

        if (error) return { success: false, error: error.message }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return { success: false, error: message }
      }
    }

    const localList = getLocalAppointments()
    const updated = localList.map((a) =>
      a.id === id
        ? {
            ...a,
            status,
            doctorClinicalNotes: clinicalNotes !== undefined ? clinicalNotes : a.doctorClinicalNotes,
            cancellationReason: cancellationReason !== undefined ? cancellationReason : a.cancellationReason,
          }
        : a
    )
    saveLocalAppointments(updated)
    return { success: true }
  },

  /**
   * Approve a pending booking (Receptionist action)
   */
  async approveAppointment(id: string): Promise<{ success: boolean; error?: string }> {
    return this.updateAppointmentStatus(id, 'confirmed')
  },

  /**
   * Decline a pending booking with reason (Receptionist action)
   */
  async declineAppointment(id: string, reason: string): Promise<{ success: boolean; error?: string }> {
    return this.updateAppointmentStatus(id, 'cancelled', undefined, reason)
  },

  /**
   * Block a date (Used by Doctor in /admin for leaves/conferences)
   */
  async blockDoctorDate(
    clinicId: string | null,
    dateStr: string,
    reason: string
  ): Promise<{ success: boolean; error?: string }> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('doctor_blocked_dates').insert({
          clinic_id: clinicId,
          blocked_date: dateStr,
          reason,
        })
        if (error) return { success: false, error: error.message }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return { success: false, error: message }
      }
    }

    const blockedList = getLocalBlockedDates()
    const newBlock: BlockedDate = {
      id: 'block-' + Date.now(),
      clinicId,
      blockedDate: dateStr,
      reason,
    }
    saveLocalBlockedDates([...blockedList, newBlock])
    return { success: true }
  },

  /**
   * Get all appointments for Admin / Doctor queue
   */
  async getAllAppointments(clinicId?: string, dateStr?: string): Promise<AppointmentRecord[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase
          .from('appointments')
          .select('*, clinics(name, address, google_maps_url, phone)')
          .order('appointment_date', { ascending: true })
          .order('time_slot', { ascending: true })

        if (clinicId) query = query.eq('clinic_id', clinicId)
        if (dateStr) query = query.eq('appointment_date', dateStr)

        const { data, error } = await query
        if (!error && data) {
          return data.map((d) => ({
            id: d.id,
            bookingReference: d.booking_reference,
            clinicId: d.clinic_id,
            clinicName: d.clinics?.name || 'Orthopedic Clinic',
            date: d.appointment_date,
            timeSlot: d.time_slot,
            patientName: d.patient_name,
            patientPhone: d.patient_phone,
            patientEmail: d.patient_email || undefined,
            patientAge: d.patient_age,
            patientGender: d.patient_gender || 'Other',
            condition: d.condition_reported,
            notes: d.notes || undefined,
            insurance: d.insurance_provider || undefined,
            firstVisit: d.first_visit,
            status: d.status,
            doctorClinicalNotes: d.doctor_clinical_notes || undefined,
            cancellationReason: d.cancellation_reason || undefined,
            createdAt: d.created_at,
          }))
        }
      } catch (err) {
        console.warn('Supabase getAllAppointments error, using local fallback:', err)
      }
    }

    let list = getLocalAppointments()
    if (clinicId) list = list.filter((a) => a.clinicId === clinicId)
    if (dateStr) list = list.filter((a) => a.date === dateStr)
    return list
  },

  /**
   * Get all blocked dates (used by Admin / Doctor)
   */
  async getBlockedDates(clinicId?: string): Promise<BlockedDate[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('doctor_blocked_dates').select('*')
        if (clinicId) query = query.or(`clinic_id.eq.${clinicId},clinic_id.is.null`)
        const { data, error } = await query
        if (!error && data) {
          return data.map((d) => ({
            id: d.id,
            clinicId: d.clinic_id,
            blockedDate: d.blocked_date,
            reason: d.reason,
          }))
        }
      } catch (err) {
        console.warn('Supabase getBlockedDates error, using fallback:', err)
      }
    }

    let list = getLocalBlockedDates()
    if (clinicId) {
      list = list.filter((b) => b.clinicId === clinicId || b.clinicId === null)
    }
    return list
  },
}
