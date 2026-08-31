import { supabase, isSupabaseConfigured } from '@/lib/supabase'

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
    name: 'Salt Lake Clinic',
    slug: 'salt-lake',
    address: 'Block EC, Sector 1, Salt Lake City, Kolkata - 700064',
    landmark: 'Near City Centre 1',
    phone: '+91 98300 12345',
    whatsappNumber: '919830012345',
    googleMapsUrl: 'https://maps.google.com/?q=Salt+Lake+City+Sector+1+Kolkata',
    operatingDays: [1, 2, 3, 4, 5, 6], // Mon-Sat
    slotDurationMinutes: 30,
    hoursDescription: 'Mon–Sat: 5:00 PM – 8:00 PM',
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    name: 'Alipore Clinic',
    slug: 'alipore',
    address: '24B, Alipore Road, Woodlands Hospital Complex, Kolkata - 700027',
    landmark: 'Near National Library',
    phone: '+91 98300 23456',
    whatsappNumber: '919830023456',
    googleMapsUrl: 'https://maps.google.com/?q=Woodlands+Hospital+Alipore+Kolkata',
    operatingDays: [1, 3, 5], // Mon, Wed, Fri
    slotDurationMinutes: 30,
    hoursDescription: 'Mon, Wed, Fri: 11:00 AM – 1:00 PM',
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Newtown Clinic',
    slug: 'newtown',
    address: 'Action Area 1, Major Arterial Road, Newtown, Kolkata - 700156',
    landmark: 'Near Axis Mall',
    phone: '+91 98300 34567',
    whatsappNumber: '919830034567',
    googleMapsUrl: 'https://maps.google.com/?q=Axis+Mall+Newtown+Kolkata',
    operatingDays: [2, 4], // Tue, Thu
    slotDurationMinutes: 30,
    hoursDescription: 'Tue, Thu: 6:00 PM – 9:00 PM',
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

  // 3. Generate time slot intervals based on clinic
  let startHour = 17
  let startMin = 0
  let endHour = 20
  let endMin = 0

  if (clinic.slug === 'alipore') {
    startHour = 11
    startMin = 0
    endHour = 13
    endMin = 0
  } else if (clinic.slug === 'newtown') {
    startHour = 18
    startMin = 0
    endHour = 21
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
          return data.map((d) => ({
            id: d.id,
            name: d.name,
            slug: d.slug,
            address: d.address,
            landmark: d.landmark || '',
            phone: d.phone,
            whatsappNumber: d.whatsapp_number || '',
            googleMapsUrl: d.google_maps_url || '',
            operatingDays: d.operating_days || [1, 2, 3, 4, 5, 6],
            slotDurationMinutes: d.slot_duration_minutes || 30,
            hoursDescription:
              d.slug === 'alipore'
                ? 'Mon, Wed, Fri: 11:00 AM – 1:00 PM'
                : d.slug === 'newtown'
                ? 'Tue, Thu: 6:00 PM – 9:00 PM'
                : 'Mon–Sat: 5:00 PM – 8:00 PM',
          }))
        }
      } catch (err) {
        console.warn('Supabase getClinics error, using fallback:', err)
      }
    }
    return DEFAULT_CLINICS
  },

  /**
   * Get dynamic slots for a clinic on a specific date
   */
  async getAvailableSlots(clinicId: string, dateStr: string): Promise<SlotResponse> {
    if (!clinicId || !dateStr) {
      return { isOpen: false, reason: 'Select clinic and date', slots: [] }
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.rpc('get_available_clinic_slots', {
          p_clinic_id: clinicId,
          p_date: dateStr,
        })
        if (!error && data) {
          return {
            isOpen: data.is_open,
            reason: data.reason,
            slots: data.slots || [],
          }
        }
      } catch (err) {
        console.warn('Supabase get_available_clinic_slots RPC failed, using fallback:', err)
      }
    }

    // Local Fallback Calculation
    const clinic = DEFAULT_CLINICS.find((c) => c.id === clinicId || c.name === clinicId) || DEFAULT_CLINICS[0]
    return generateLocalSlots(clinic, dateStr)
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
          // Cache in local storage for instantaneous offline reference lookup
          const newRecord: AppointmentRecord = {
            ...payload,
            id: data.appointment_id,
            bookingReference: data.booking_reference,
            status: 'confirmed',
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

    const randomRef = 'ORTHO-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    const newId = 'app-' + Date.now()
    const newRecord: AppointmentRecord = {
      ...payload,
      id: newId,
      bookingReference: randomRef,
      status: 'confirmed',
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
        const { data, error } = await supabase
          .from('appointments')
          .select('*, clinics(name, address, google_maps_url, phone)')
          .or(`booking_reference.eq.${cleanRef},patient_phone.eq.${cleanRef}`)
          .single()

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
    clinicalNotes?: string
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
          }
        : a
    )
    saveLocalAppointments(updated)
    return { success: true }
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
}
