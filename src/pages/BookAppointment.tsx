import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  appointmentService,
  Clinic,
  SlotInfo,
  DEFAULT_CLINICS,
} from '@/services/appointmentService'
import { downloadICSFile, getGoogleCalendarUrl } from '@/utils/calendar'
import { getWhatsAppConfirmationUrl } from '@/services/notificationService'

type Step = 1 | 2 | 3

const conditions = [
  'Knee Pain / Arthritis',
  'Hip Pain',
  'Shoulder Pain / Frozen Shoulder',
  'Sports Injury',
  'Back / Spine Pain',
  'Fracture / Trauma',
  'Post-Surgical Follow-up',
  'Second Opinion',
  'Pediatric Concern',
  'Other',
]

// Helper to get tomorrow's date formatted as YYYY-MM-DD
function getTomorrowDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

export default function BookAppointment() {
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState<Step>(1)
  const [clinics, setClinics] = useState<Clinic[]>(DEFAULT_CLINICS)
  const [selectedClinic, setSelectedClinic] = useState<Clinic>(DEFAULT_CLINICS[0])

  const [form, setForm] = useState({
    clinicId: DEFAULT_CLINICS[0].id,
    clinicName: DEFAULT_CLINICS[0].name,
    date: getTomorrowDate(),
    timeSlot: '',
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    condition: '',
    notes: '',
    insurance: '',
    firstVisit: 'yes',
  })

  const [slotData, setSlotData] = useState<{
    isOpen: boolean
    reason: string | null
    slots: SlotInfo[]
  }>({
    isOpen: true,
    reason: null,
    slots: [],
  })

  const [loadingSlots, setLoadingSlots] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [bookingRef, setBookingRef] = useState<string>('')

  // Load clinics on mount
  useEffect(() => {
    async function loadClinics() {
      const data = await appointmentService.getClinics()
      if (data && data.length > 0) {
        setClinics(data)

        // Check if clinic was passed in query params
        const urlClinic = searchParams.get('clinic')?.toLowerCase()
        const matched = data.find(
          (c) => c.slug.toLowerCase() === urlClinic || c.name.toLowerCase().includes(urlClinic || '')
        )
        const initialClinic = matched || data[0]
        setSelectedClinic(initialClinic)
        setForm((prev) => ({
          ...prev,
          clinicId: initialClinic.id,
          clinicName: initialClinic.name,
        }))
      }
    }
    loadClinics()
  }, [searchParams])

  // Check condition in query params
  useEffect(() => {
    const urlCondition = searchParams.get('condition')
    if (urlCondition) {
      const matchedCond = conditions.find((c) =>
        c.toLowerCase().includes(urlCondition.toLowerCase())
      )
      if (matchedCond) {
        setForm((prev) => ({ ...prev, condition: matchedCond }))
      }
    }
  }, [searchParams])

  // Fetch dynamic slots whenever clinic or date changes
  useEffect(() => {
    if (!form.clinicId || !form.date) return

    let isMounted = true
    setLoadingSlots(true)
    setSubmitError(null)

    appointmentService
      .getAvailableSlots(form.clinicId, form.date)
      .then((res) => {
        if (isMounted) {
          setSlotData(res)
          setLoadingSlots(false)
          // If current timeSlot is no longer available in the new date/clinic, reset it
          if (
            form.timeSlot &&
            (!res.isOpen || !res.slots.some((s) => s.time === form.timeSlot && s.available))
          ) {
            setForm((prev) => ({ ...prev, timeSlot: '' }))
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error loading slots:', err)
          setLoadingSlots(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [form.clinicId, form.date, form.timeSlot])

  const handleClinicChange = (clinic: Clinic) => {
    setSelectedClinic(clinic)
    setForm((prev) => ({
      ...prev,
      clinicId: clinic.id,
      clinicName: clinic.name,
      timeSlot: '',
    }))
  }

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const canProceed1 = form.clinicId && form.date && form.timeSlot && slotData.isOpen
  const canProceed2 =
    form.name.trim() &&
    form.age.trim() &&
    form.phone.trim().length >= 10 &&
    form.condition

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canProceed2 || submitting) return

    setSubmitting(true)
    setSubmitError(null)

    try {
      const res = await appointmentService.bookAppointment({
        clinicId: form.clinicId,
        clinicName: form.clinicName,
        date: form.date,
        timeSlot: form.timeSlot,
        patientName: form.name.trim(),
        patientPhone: form.phone.trim(),
        patientEmail: form.email.trim() || undefined,
        patientAge: Number(form.age),
        patientGender: form.gender || 'Other',
        condition: form.condition,
        notes: form.notes.trim() || undefined,
        insurance: form.insurance.trim() || undefined,
        firstVisit: form.firstVisit === 'yes',
      })

      if (res.success && res.bookingReference) {
        setBookingRef(res.bookingReference)
        setStep(3)
      } else {
        setSubmitError(
          res.error ||
            'Could not reserve this time slot. It may have just been booked. Please choose an adjacent time slot.'
        )
        // Refresh slots in background
        const refreshed = await appointmentService.getAvailableSlots(form.clinicId, form.date)
        setSlotData(refreshed)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred while booking. Please try again.'
      setSubmitError(message)
    } finally {
      setSubmitting(false)
    }
  }

  // Helper for calendar events
  const calendarEventData = {
    title: `Orthopedic Consultation with Dr. Deep Chakraborty`,
    description: `Appointment for ${form.name} (Ref: ${bookingRef}). Condition: ${form.condition}. Please bring prior X-rays & MRI scans.`,
    location: `${selectedClinic.name}, ${selectedClinic.address}`,
    startDate: form.date,
    timeSlot: form.timeSlot,
  }

  // ---------------------------------------------------------------------------
  // STEP 3: ENHANCED PRODUCTION CONFIRMATION SCREEN
  // ---------------------------------------------------------------------------
  if (step === 3) {
    return (
      <div className="min-h-screen pt-20 bg-soft-gray flex items-center justify-center px-6 py-12">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-border/50 text-center animate-fade-up">
          <div className="w-20 h-20 rounded-full bg-teal/15 flex items-center justify-center mx-auto mb-5">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <div className="inline-block bg-teal/10 text-teal text-xs font-display font-700 px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-2">
            Reference #{bookingRef}
          </div>

          <h2 className="font-display font-800 text-3xl text-navy">
            Appointment Confirmed!
          </h2>
          <p className="text-navy-700 mt-2 text-sm leading-relaxed">
            Thank you, <strong>{form.name}</strong>. Your slot with <strong>Dr. Deep Chakraborty</strong> has been locked in the system.
          </p>

          {/* Appointment Summary Box */}
          <div className="bg-soft-gray rounded-2xl p-5 mt-6 text-left space-y-3 border border-border/60">
            {[
              { label: 'Booking Reference', value: bookingRef },
              { label: 'Clinic Branch', value: form.clinicName },
              { label: 'Address', value: selectedClinic.address },
              { label: 'Date & Time', value: `${form.date} at ${form.timeSlot}` },
              { label: 'Condition', value: form.condition },
              { label: 'Patient Contact', value: form.phone },
            ].map((row) => (
              <div key={row.label} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm gap-1">
                <span className="text-navy-700">{row.label}</span>
                <span className="font-display font-600 text-navy text-right">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Action Row 1: Calendar Downloads */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <button
              type="button"
              onClick={() => downloadICSFile(calendarEventData)}
              className="py-2.5 px-3 rounded-xl border-2 border-border/60 hover:border-teal text-navy hover:text-teal font-display font-600 text-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>📥</span> Download iCal (.ics)
            </button>
            <a
              href={getGoogleCalendarUrl(calendarEventData)}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl border-2 border-border/60 hover:border-teal text-navy hover:text-teal font-display font-600 text-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>📅</span> Add to Google Calendar
            </a>
          </div>

          {/* Action Row 2: WhatsApp & Google Maps */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <a
              href={getWhatsAppConfirmationUrl({
                patientName: form.name,
                clinicName: form.clinicName,
                clinicAddress: selectedClinic.address,
                date: form.date,
                timeSlot: form.timeSlot,
                bookingReference: bookingRef,
                whatsappNumber: selectedClinic.whatsappNumber,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-600 text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>💬</span> Send to WhatsApp
            </a>
            <a
              href={selectedClinic.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl border-2 border-border/60 hover:border-teal text-navy hover:text-teal font-display font-600 text-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>📍</span> Google Maps Pin
            </a>
          </div>

          {/* Pre-Visit Instructions */}
          <div className="mt-5 bg-teal/8 rounded-xl p-4 text-xs text-navy-700 text-left border border-teal/20">
            <strong className="text-navy block mb-1">What to bring to your consultation:</strong>
            Prior X-rays, MRI scans, previous orthopedic prescriptions, list of current medications, and a valid photo ID.
          </div>

          {/* Self-service track link & Home button */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link to="/" className="flex-1 btn-outline justify-center text-xs" style={{ color: '#0F172A', borderColor: '#E2E8F0' }}>
              Return to Homepage
            </Link>
            <Link
              to={`/my-booking?ref=${bookingRef}`}
              className="flex-1 btn-primary justify-center text-xs"
            >
              Track / Manage Booking →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // MAIN WIZARD VIEW (STEPS 1 & 2)
  // ---------------------------------------------------------------------------
  const todayString = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="bg-navy py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="section-label" style={{ color: '#0EA5E9' }}>
            Schedule Visit
          </div>
          <h1 className="font-display font-800 text-4xl text-white mt-2">Book an Appointment</h1>
          <p className="text-white/70 mt-3 text-sm">
            Select your preferred clinic branch and date to view live availability.
          </p>

          {/* Progress */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {([1, 2] as const).map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-display font-700 text-sm transition-all ${
                    step >= s ? 'bg-teal text-white shadow-lg' : 'bg-white/10 text-white/40'
                  }`}
                >
                  {step > s ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    s
                  )}
                </div>
                <span className={`text-xs font-display font-600 hidden sm:block ${step >= s ? 'text-white' : 'text-white/30'}`}>
                  {s === 1 ? 'Choose Slot' : 'Your Details'}
                </span>
                {s < 2 && <div className="w-12 h-px bg-white/20 hidden sm:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 bg-soft-gray">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-border/50">

            {/* ---------------------------------------------------------------- */}
            {/* STEP 1: CLINIC, DATE & DYNAMIC TIME SLOT SELECTION                */}
            {/* ---------------------------------------------------------------- */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-up">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-700 text-navy text-2xl">Choose Your Slot</h2>
                  <span className="text-xs text-navy-700 bg-soft-gray px-3 py-1 rounded-full font-medium">
                    Live Schedule
                  </span>
                </div>

                {/* Clinic Selection Cards */}
                <div>
                  <label className="text-xs font-display font-700 text-navy uppercase tracking-wide block mb-2">
                    Select Clinic *
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {clinics.map((c) => {
                      const isSelected = form.clinicId === c.id
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleClinicChange(c)}
                          className={`text-left px-5 py-4 rounded-xl border-2 transition-all ${
                            isSelected
                              ? 'border-teal bg-teal/5 ring-2 ring-teal/20'
                              : 'border-border/60 hover:border-border'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-display font-600 text-navy text-sm">{c.name}</div>
                              <div className="text-xs text-navy-700 mt-0.5">{c.hoursDescription}</div>
                              <div className="text-[11px] text-navy-700/60 mt-0.5">{c.landmark}</div>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                isSelected ? 'border-teal' : 'border-border/60'
                              }`}
                            >
                              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-teal" />}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Date Picker */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-display font-700 text-navy uppercase tracking-wide">
                      Preferred Date *
                    </label>
                    <span className="text-xs text-teal font-medium">
                      Operating: {selectedClinic.hoursDescription.split(':')[0]}
                    </span>
                  </div>
                  <input
                    type="date"
                    value={form.date}
                    min={todayString}
                    onChange={(e) => update('date', e.target.value)}
                    className="w-full border-2 border-border/60 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:border-teal bg-white"
                  />
                </div>

                {/* Dynamic Slot List or Closed / Leave Alert */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-display font-700 text-navy uppercase tracking-wide">
                      Available Time Slots *
                    </label>
                    {loadingSlots && (
                      <span className="text-xs text-teal animate-pulse">Checking live slots...</span>
                    )}
                  </div>

                  {/* If Clinic is Closed or Doctor on Leave */}
                  {!slotData.isOpen && !loadingSlots && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm text-navy">
                      <div className="flex items-start gap-2.5">
                        <span className="text-base">⚠️</span>
                        <div>
                          <strong className="font-semibold block text-navy-800">
                            {slotData.reason || 'Clinic Closed on this date'}
                          </strong>
                          <span className="text-xs text-navy-700 mt-0.5 block">
                            Please select an active operating date from the calendar above.
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* If Open: Display Dynamic Slots */}
                  {slotData.isOpen && (
                    <>
                      {slotData.slots.length === 0 && !loadingSlots ? (
                        <div className="bg-soft-gray rounded-xl p-4 text-center text-xs text-navy-700">
                          No slots configured for this date.
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          {slotData.slots.map((slot) => {
                            const isSelected = form.timeSlot === slot.time
                            return (
                              <button
                                key={slot.time}
                                type="button"
                                disabled={!slot.available}
                                onClick={() => update('timeSlot', slot.time)}
                                className={`py-2.5 px-2 rounded-xl text-xs font-display font-600 border-2 transition-all relative ${
                                  !slot.available
                                    ? 'bg-border/30 border-border/40 text-navy-700/40 cursor-not-allowed line-through'
                                    : isSelected
                                    ? 'border-teal bg-teal text-white shadow-md'
                                    : 'border-border/60 text-navy hover:border-teal hover:text-teal'
                                }`}
                              >
                                {slot.time}
                                {!slot.available && (
                                  <span className="block text-[9px] no-underline font-normal text-red-500">
                                    Booked
                                  </span>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => canProceed1 && setStep(2)}
                  disabled={!canProceed1}
                  className={`w-full py-3.5 rounded-xl font-display font-700 text-sm transition-all ${
                    canProceed1
                      ? 'bg-teal text-white hover:bg-teal-dark shadow-md hover:shadow-lg'
                      : 'bg-border/50 text-navy-700/40 cursor-not-allowed'
                  }`}
                >
                  Continue to Patient Details →
                </button>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* STEP 2: PATIENT CLINICAL TRIAGE INTAKE                           */}
            {/* ---------------------------------------------------------------- */}
            {step === 2 && (
              <form onSubmit={handleBookingSubmit} className="space-y-5 animate-fade-up">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-8 h-8 rounded-lg bg-soft-gray flex items-center justify-center hover:bg-border/60 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2">
                      <line x1="19" y1="12" x2="5" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                  </button>
                  <h2 className="font-display font-700 text-navy text-2xl">Your Details</h2>
                </div>

                {/* Booking summary banner */}
                <div className="bg-teal/8 rounded-xl p-4 flex items-center gap-3 text-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <div>
                    <span className="font-display font-700 text-navy">{form.clinicName}</span>
                    <span className="text-navy-700 mx-2">·</span>
                    <span className="text-navy-700">{form.date}</span>
                    <span className="text-navy-700 mx-2">·</span>
                    <span className="text-teal font-semibold">{form.timeSlot}</span>
                  </div>
                </div>

                {/* Collision / Submission Error Banner */}
                {submitError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-xs text-red-700">
                    <strong>Booking Notice:</strong> {submitError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-display font-700 text-navy uppercase tracking-wide block mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      className="w-full border-2 border-border/60 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:border-teal"
                      placeholder="e.g. Sudipta Banerjee"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-display font-700 text-navy uppercase tracking-wide block mb-1.5">
                      Age *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="110"
                      value={form.age}
                      onChange={(e) => update('age', e.target.value)}
                      className="w-full border-2 border-border/60 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:border-teal"
                      placeholder="e.g. 45"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-display font-700 text-navy uppercase tracking-wide block mb-1.5">
                      Gender
                    </label>
                    <select
                      value={form.gender}
                      onChange={(e) => update('gender', e.target.value)}
                      className="w-full border-2 border-border/60 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:border-teal bg-white"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-display font-700 text-navy uppercase tracking-wide block mb-1.5">
                      Phone Number * (10 Digits)
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      className="w-full border-2 border-border/60 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:border-teal"
                      placeholder="+91 98300 XXXXX"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-display font-700 text-navy uppercase tracking-wide block mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      className="w-full border-2 border-border/60 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:border-teal"
                      placeholder="patient@example.com"
                    />
                  </div>
                </div>

                {/* Main Concern Chips */}
                <div>
                  <label className="text-xs font-display font-700 text-navy uppercase tracking-wide block mb-2">
                    Main Concern / Condition *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {conditions.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => update('condition', c)}
                        className={`text-left px-3 py-2.5 rounded-xl text-xs font-medium border-2 transition-all ${
                          form.condition === c
                            ? 'border-teal bg-teal/10 text-navy font-semibold ring-1 ring-teal/30'
                            : 'border-border/60 text-navy-700 hover:border-border'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="text-xs font-display font-700 text-navy uppercase tracking-wide block mb-1.5">
                    Symptoms or Previous Medical History (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => update('notes', e.target.value)}
                    className="w-full border-2 border-border/60 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:border-teal resize-none"
                    placeholder="Describe pain duration, prior joint surgery, or questions for Dr. Deep..."
                  />
                </div>

                {/* First Visit & Insurance */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-display font-700 text-navy uppercase tracking-wide block mb-1.5">
                      First Visit?
                    </label>
                    <div className="flex gap-2">
                      {['yes', 'no'].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => update('firstVisit', v)}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-display font-600 border-2 capitalize transition-all ${
                            form.firstVisit === v
                              ? 'border-teal bg-teal text-white'
                              : 'border-border/60 text-navy'
                          }`}
                        >
                          {v === 'yes' ? 'First Visit' : 'Follow-up'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-display font-700 text-navy uppercase tracking-wide block mb-1.5">
                      Insurance Provider
                    </label>
                    <input
                      type="text"
                      value={form.insurance}
                      onChange={(e) => update('insurance', e.target.value)}
                      className="w-full border-2 border-border/60 rounded-xl px-4 py-3 text-navy text-sm focus:outline-none focus:border-teal"
                      placeholder="e.g. Star Health / TPA (Optional)"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!canProceed2 || submitting}
                  className={`w-full py-3.5 rounded-xl font-display font-700 text-sm transition-all ${
                    canProceed2 && !submitting
                      ? 'bg-teal text-white hover:bg-teal-dark shadow-md hover:shadow-lg'
                      : 'bg-border/50 text-navy-700/40 cursor-not-allowed'
                  }`}
                >
                  {submitting ? 'Reserving Your Slot...' : 'Confirm Appointment Reservation →'}
                </button>

                <p className="text-xs text-navy-700/60 text-center leading-relaxed">
                  By submitting, your slot is locked in the clinic system. You will receive an instant reference number.
                </p>
              </form>
            )}
          </div>

          {/* Reassurance Badges */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            {[
              { icon: '🔒', text: 'Zero Double-Booking' },
              { icon: '🏥', text: '3 Kolkata Branches' },
              { icon: '⚡', text: 'Instant Reference ID' },
            ].map((item) => (
              <div key={item.text} className="bg-white rounded-xl p-3 border border-border/50">
                <div className="text-xl mb-1">{item.icon}</div>
                <div className="text-xs text-navy-700 font-medium">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
