import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { appointmentService, AppointmentRecord } from '@/services/appointmentService'
import { downloadICSFile, getGoogleCalendarUrl } from '@/utils/calendar'

export default function MyBooking() {
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [appointment, setAppointment] = useState<AppointmentRecord | null>(null)
  const [searched, setSearched] = useState(false)
  const [cancelModal, setCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelling, setCancelling] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null)

  // Auto-search if ref is present in URL
  useEffect(() => {
    const urlRef = searchParams.get('ref')
    if (urlRef) {
      setSearchQuery(urlRef)
      performLookup(urlRef)
    }
  }, [searchParams])

  const performLookup = async (query: string) => {
    const clean = query.trim()
    if (!clean) return

    setLoading(true)
    setSearched(true)
    setFeedbackMsg(null)

    try {
      const data = await appointmentService.getAppointmentByReference(clean)
      setAppointment(data)
    } catch (err) {
      console.error('Lookup error:', err)
      setAppointment(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performLookup(searchQuery)
  }

  const handleCancel = async () => {
    if (!appointment || !cancelReason.trim()) return

    setCancelling(true)
    try {
      const res = await appointmentService.cancelAppointment(
        appointment.bookingReference,
        cancelReason.trim()
      )
      if (res.success) {
        setAppointment((prev) => (prev ? { ...prev, status: 'cancelled', cancellationReason: cancelReason } : null))
        setCancelModal(false)
        setCancelReason('')
        setFeedbackMsg('Your appointment has been cancelled. The time slot has been freed up.')
      } else {
        alert(res.error || 'Failed to cancel appointment')
      }
    } catch (err) {
      console.error('Cancel error:', err)
    } finally {
      setCancelling(false)
    }
  }

  const statusColors: Record<AppointmentRecord['status'], { bg: string; text: string; label: string }> = {
    confirmed: { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-700', label: 'Confirmed' },
    arrived: { bg: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-700', label: 'Checked In / Waiting' },
    in_consultation: { bg: 'bg-purple-500/10 border-purple-500/30', text: 'text-purple-700', label: 'In Consultation' },
    completed: { bg: 'bg-teal/10 border-teal/30', text: 'text-teal', label: 'Completed' },
    cancelled: { bg: 'bg-red-500/10 border-red-500/30', text: 'text-red-700', label: 'Cancelled' },
    pending: { bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-700', label: 'Pending Confirmation' },
    no_show: { bg: 'bg-gray-500/10 border-gray-500/30', text: 'text-gray-700', label: 'No Show' },
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 bg-soft-gray pb-16 sm:pb-20">
      {/* Header */}
      <section className="bg-navy py-10 sm:py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="section-label text-xs sm:text-sm" style={{ color: '#0EA5E9' }}>
            Patient Portal
          </div>
          <h1 className="font-display font-800 text-2xl xs:text-3xl sm:text-4xl text-white mt-2 tracking-tight">
            Track Your Appointment
          </h1>
          <p className="text-white/70 mt-2 text-xs xs:text-sm max-w-md mx-auto leading-relaxed px-2">
            Enter your 6-digit Booking Reference or registered Phone Number to view, reschedule, or manage your consultation.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mt-6 sm:mt-7 flex flex-col sm:flex-row gap-2.5 sm:gap-2">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. ORTHO-9B4F1A or Phone Number"
                className="w-full bg-white text-navy px-4 py-3 sm:py-3.5 rounded-xl border border-white/20 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal shadow-xs placeholder:text-navy-700/50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal hover:bg-teal-dark active:scale-[0.98] text-white px-6 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-display font-700 whitespace-nowrap transition-all shadow-md shadow-teal/20 cursor-pointer disabled:opacity-60 shrink-0"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span>Lookup</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
        {feedbackMsg && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-xs sm:text-sm text-emerald-800 font-medium text-center animate-fade-up">
            {feedbackMsg}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-navy-700 font-medium">Looking up appointment record...</p>
          </div>
        )}

        {/* Appointment Card Found */}
        {!loading && appointment && (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 xs:p-6 sm:p-9 shadow-sm border border-border/50 animate-fade-up space-y-5 sm:space-y-6">
            {/* Status Header */}
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 border-b border-border/60 pb-4 sm:pb-5">
              <div>
                <span className="text-[11px] sm:text-xs text-navy-700 block font-medium">Booking Reference</span>
                <span className="font-display font-800 text-lg sm:text-xl text-navy tracking-tight">{appointment.bookingReference}</span>
              </div>
              <div
                className={`self-start xs:self-auto inline-flex items-center gap-1.5 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full border text-xs font-display font-700 ${
                  statusColors[appointment.status]?.bg || 'bg-gray-100'
                } ${statusColors[appointment.status]?.text || 'text-gray-700'}`}
              >
                <span className="w-2 h-2 rounded-full bg-current" />
                {statusColors[appointment.status]?.label || appointment.status}
              </div>
            </div>

            {/* Appointment Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="bg-soft-gray rounded-xl p-3.5 sm:p-4">
                <span className="text-navy-700 block text-[11px] sm:text-xs mb-0.5">Patient Name</span>
                <span className="font-display font-700 text-navy text-sm">{appointment.patientName}</span>
                <span className="text-navy-700/70 text-xs block mt-0.5">
                  Age: {appointment.patientAge} · {appointment.patientGender}
                </span>
              </div>

              <div className="bg-soft-gray rounded-xl p-3.5 sm:p-4">
                <span className="text-navy-700 block text-[11px] sm:text-xs mb-0.5">Clinic Location</span>
                <span className="font-display font-700 text-navy text-sm">{appointment.clinicName}</span>
                <span className="text-navy-700/70 text-xs block mt-0.5">Dr. Deep Chakraborty</span>
              </div>

              <div className="bg-soft-gray rounded-xl p-3.5 sm:p-4">
                <span className="text-navy-700 block text-[11px] sm:text-xs mb-0.5">Scheduled Date & Time</span>
                <span className="font-display font-700 text-teal text-sm">
                  {appointment.date} at {appointment.timeSlot}
                </span>
              </div>

              <div className="bg-soft-gray rounded-xl p-3.5 sm:p-4">
                <span className="text-navy-700 block text-[11px] sm:text-xs mb-0.5">Reported Concern</span>
                <span className="font-display font-700 text-navy text-sm">{appointment.condition}</span>
                <span className="text-navy-700/70 text-xs block mt-0.5">
                  {appointment.firstVisit ? 'First Visit Consultation' : 'Follow-up Consultation'}
                </span>
              </div>
            </div>

            {/* Doctor Remarks / Notes if Completed */}
            {appointment.doctorClinicalNotes && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3.5 sm:p-4 text-xs">
                <strong className="text-purple-900 block mb-1 font-semibold">Doctor Clinical Remarks:</strong>
                <p className="text-purple-800 leading-relaxed">{appointment.doctorClinicalNotes}</p>
              </div>
            )}

            {/* Pre-Visit Instructions */}
            {appointment.status === 'confirmed' && (
              <div className="bg-teal/8 border border-teal/20 rounded-xl p-3.5 sm:p-4 text-xs text-navy-700 space-y-1.5 leading-relaxed">
                <strong className="text-navy block font-display font-700">Checklist for Your Consultation:</strong>
                <p>1. Please arrive 10 minutes prior to your time slot ({appointment.timeSlot}).</p>
                <p>2. Bring prior X-rays, MRI scans, previous orthopedic prescriptions, and valid ID.</p>
              </div>
            )}

            {/* Action Buttons */}
            {appointment.status !== 'cancelled' && (
              <div className="pt-2 border-t border-border/60 space-y-2.5 sm:space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      downloadICSFile({
                        title: `Orthopedic Consultation with Dr. Deep Chakraborty`,
                        description: `Ref: ${appointment.bookingReference}. Condition: ${appointment.condition}`,
                        location: appointment.clinicName,
                        startDate: appointment.date,
                        timeSlot: appointment.timeSlot,
                      })
                    }
                    className="min-h-[44px] py-2.5 px-3.5 rounded-xl border border-border/80 bg-white hover:bg-soft-gray active:bg-gray-100 text-navy hover:text-teal font-display font-600 text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-xs w-full"
                  >
                    <img src="/icons/svg/calendar-plus.svg" alt="Add to Calendar" className="w-4 h-4 text-navy shrink-0" />
                    <span>Add to Calendar (.ics)</span>
                  </button>
                  <a
                    href={getGoogleCalendarUrl({
                      title: `Orthopedic Consultation with Dr. Deep Chakraborty`,
                      description: `Ref: ${appointment.bookingReference}. Condition: ${appointment.condition}`,
                      location: appointment.clinicName,
                      startDate: appointment.date,
                      timeSlot: appointment.timeSlot,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] py-2.5 px-3.5 rounded-xl border border-border/80 bg-white hover:bg-soft-gray active:bg-gray-100 text-navy hover:text-teal font-display font-600 text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-xs w-full"
                  >
                    <img src="/icons/svg/google-calendar.svg" alt="Google Calendar" className="w-4 h-4 shrink-0" />
                    <span>Google Calendar</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <Link
                    to={`/book-appointment?clinic=${appointment.clinicId}&condition=${encodeURIComponent(
                      appointment.condition
                    )}`}
                    className="min-h-[44px] py-2.5 px-3.5 rounded-xl border border-border/80 bg-white hover:bg-soft-gray active:bg-gray-100 text-navy hover:text-teal font-display font-600 text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs w-full text-center"
                  >
                    <span>Reschedule (Book New Slot)</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setCancelModal(true)}
                    className="min-h-[44px] py-2.5 px-3.5 rounded-xl border border-red-200/80 bg-red-50/50 hover:bg-red-100/60 active:bg-red-200/60 text-red-600 font-display font-600 text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs w-full"
                  >
                    <span>Cancel Appointment</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Not Found View */}
        {!loading && searched && !appointment && (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 xs:p-8 sm:p-10 shadow-sm border border-border/50 text-center animate-fade-up">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-soft-gray flex items-center justify-center mx-auto mb-4 text-xl sm:text-2xl">
              🔍
            </div>
            <h3 className="font-display font-700 text-navy text-lg sm:text-xl">No Booking Found</h3>
            <p className="text-navy-700 text-xs sm:text-sm mt-2 max-w-sm mx-auto leading-relaxed">
              We couldn't find an appointment matching "<strong>{searchQuery}</strong>". Please verify your booking reference or phone number.
            </p>
            <div className="mt-6 flex justify-center">
              <Link to="/book-appointment" className="btn-primary text-xs sm:text-sm px-6 py-3 w-full sm:w-auto">
                Book a New Appointment
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-5 sm:p-8 shadow-2xl border border-border/50 animate-fade-up">
            <h3 className="font-display font-700 text-navy text-lg sm:text-xl">Cancel Appointment?</h3>
            <p className="text-navy-700 text-xs sm:text-sm mt-2 leading-relaxed">
              Are you sure you want to cancel your consultation for <strong>{appointment?.date}</strong> at <strong>{appointment?.timeSlot}</strong>?
            </p>

            <div className="mt-4">
              <label className="text-xs font-display font-700 text-navy block mb-1">
                Reason for Cancellation (Required)
              </label>
              <textarea
                rows={2}
                required
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Schedule conflict, feeling better, relocated..."
                className="w-full border-2 border-border/60 rounded-xl p-3 text-xs text-navy focus:outline-none focus:border-teal resize-none"
              />
            </div>

            <div className="flex gap-3 mt-5 sm:mt-6">
              <button
                type="button"
                onClick={() => setCancelModal(false)}
                className="flex-1 py-2.5 sm:py-3 rounded-xl border border-border text-navy text-xs font-display font-600"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                disabled={!cancelReason.trim() || cancelling}
                onClick={handleCancel}
                className="flex-1 py-2.5 sm:py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-display font-700 disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
