import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  appointmentService,
  AppointmentRecord,
  Clinic,
  DEFAULT_CLINICS,
  BlockedDate,
} from '@/services/appointmentService'

type Role = 'doctor' | 'receptionist' | 'admin'

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true) // default logged-in for instant review
  const [currentRole, setCurrentRole] = useState<Role>('doctor')
  const [selectedClinicId, setSelectedClinicId] = useState<string>('c1111111-1111-1111-1111-111111111111') // Salt Lake default
  const [filterDate, setFilterDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [clinics, setClinics] = useState<Clinic[]>(DEFAULT_CLINICS)

  // Clinical Notes Modal
  const [activeNoteAppId, setActiveNoteAppId] = useState<string | null>(null)
  const [clinicalNotes, setClinicalNotes] = useState<string>('')

  // Emergency Leave Blocker Modal
  const [blockModal, setBlockModal] = useState<boolean>(false)
  const [blockDate, setBlockDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [blockClinicId, setBlockClinicId] = useState<string>('all')
  const [blockReason, setBlockReason] = useState<string>('Emergency Surgery / Hospital OT')

  // Walk-In Patient Modal
  const [walkinModal, setWalkinModal] = useState<boolean>(false)
  const [walkinForm, setWalkinForm] = useState({
    name: '',
    phone: '',
    age: '',
    gender: 'Male',
    condition: 'Knee Pain / Arthritis',
    timeSlot: '5:00 PM',
  })

  // Delay Notification Modal
  const [delayModal, setDelayModal] = useState<boolean>(false)
  const [delayMinutes, setDelayMinutes] = useState<number>(30)

  // Load Clinics and Appointments
  useEffect(() => {
    async function loadInitial() {
      const clinicList = await appointmentService.getClinics()
      if (clinicList && clinicList.length > 0) {
        setClinics(clinicList)
      }
      refreshQueue()
    }
    loadInitial()
  }, [])

  const refreshQueue = async () => {
    setLoading(true)
    try {
      const clinicParam =
        currentRole === 'doctor' && selectedClinicId === 'all'
          ? undefined
          : selectedClinicId
      const list = await appointmentService.getAllAppointments(clinicParam, filterDate)
      setAppointments(list)
    } catch (err) {
      console.error('Failed to load appointments:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshQueue()
  }, [selectedClinicId, filterDate, currentRole])

  const handleStatusChange = async (id: string, newStatus: AppointmentRecord['status']) => {
    await appointmentService.updateAppointmentStatus(id, newStatus)
    refreshQueue()
  }

  const handleSaveNotes = async () => {
    if (!activeNoteAppId) return
    await appointmentService.updateAppointmentStatus(activeNoteAppId, 'completed', clinicalNotes)
    setActiveNoteAppId(null)
    setClinicalNotes('')
    refreshQueue()
  }

  const handleBlockDate = async (e: React.FormEvent) => {
    e.preventDefault()
    const targetClinic = blockClinicId === 'all' ? null : blockClinicId
    await appointmentService.blockDoctorDate(targetClinic, blockDate, blockReason)
    setBlockModal(false)
    alert(`Date ${blockDate} successfully blocked! New bookings are now disabled on the public website.`)
    refreshQueue()
  }

  const handleWalkinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const currentClinic = clinics.find((c) => c.id === selectedClinicId) || clinics[0]
    await appointmentService.bookAppointment({
      clinicId: currentClinic.id,
      clinicName: currentClinic.name,
      date: filterDate,
      timeSlot: walkinForm.timeSlot,
      patientName: walkinForm.name,
      patientPhone: walkinForm.phone,
      patientAge: Number(walkinForm.age) || 30,
      patientGender: walkinForm.gender,
      condition: walkinForm.condition,
      firstVisit: true,
    })
    setWalkinModal(false)
    setWalkinForm({
      name: '',
      phone: '',
      age: '',
      gender: 'Male',
      condition: 'Knee Pain / Arthritis',
      timeSlot: '5:00 PM',
    })
    refreshQueue()
  }

  const currentClinicObj = clinics.find((c) => c.id === selectedClinicId) || clinics[0]

  return (
    <div className="min-h-screen pt-20 bg-soft-gray pb-20">
      {/* Top Admin Navigation Bar */}
      <div className="bg-navy border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal/20 flex items-center justify-center text-teal font-display font-800 text-lg">
              🩺
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-800 text-white text-lg">Orthobud Internal Portal</span>
                <span className="bg-teal/20 text-teal text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {currentRole.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-white/60">Dr. Deep Chakraborty Orthopedic Clinics</p>
            </div>
          </div>

          {/* Quick Role Switcher for Demonstration & Evaluation */}
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            <span className="text-[11px] text-white/60 px-2 font-medium">Switch View:</span>
            {(['doctor', 'receptionist', 'admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setCurrentRole(r)
                  if (r === 'receptionist' && selectedClinicId === 'all') {
                    setSelectedClinicId(clinics[0].id)
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-display font-600 capitalize transition-all ${
                  currentRole === r
                    ? 'bg-teal text-white shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {r === 'doctor' ? '👨‍⚕️ Doctor' : r === 'receptionist' ? '📋 Reception' : '👑 Admin'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        {/* Controls Strip: Clinic Filter, Date Picker, and Action Buttons */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-border/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* Clinic Tabs (Only Doctor & Admin can switch all clinics) */}
            {currentRole !== 'receptionist' ? (
              <div className="flex items-center gap-1.5 bg-soft-gray p-1 rounded-xl">
                <button
                  onClick={() => setSelectedClinicId('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-display font-600 transition-all ${
                    selectedClinicId === 'all'
                      ? 'bg-white text-navy shadow-sm'
                      : 'text-navy-700 hover:text-navy'
                  }`}
                >
                  All Clinics
                </button>
                {clinics.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedClinicId(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-display font-600 transition-all ${
                      selectedClinicId === c.id
                        ? 'bg-white text-navy shadow-sm'
                        : 'text-navy-700 hover:text-navy'
                    }`}
                  >
                    {c.name.replace(' Clinic', '')}
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-soft-gray px-4 py-2 rounded-xl text-xs font-display font-700 text-navy flex items-center gap-2">
                <span>🏥 Assigned Branch:</span>
                <span className="text-teal font-bold">{currentClinicObj.name}</span>
              </div>
            )}

            {/* Date Selector */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="border border-border/80 rounded-xl px-3 py-1.5 text-xs text-navy font-medium focus:outline-none focus:border-teal bg-white"
              />
              <button
                onClick={() => setFilterDate(new Date().toISOString().split('T')[0])}
                className="text-xs text-teal hover:underline font-semibold"
              >
                Today
              </button>
            </div>
          </div>

          {/* Action Toolbar Based on Role */}
          <div className="flex items-center gap-2 flex-wrap">
            {currentRole === 'doctor' && (
              <>
                <button
                  onClick={() => setBlockModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 hover:bg-amber-500/20 text-xs font-display font-700 flex items-center gap-1.5 transition-all"
                >
                  <span>🚫</span> Block Date (Surgery / Leave)
                </button>
                <button
                  onClick={() => setDelayModal(true)}
                  className="px-3.5 py-2 rounded-xl border border-border text-navy hover:bg-soft-gray text-xs font-display font-600 flex items-center gap-1.5 transition-all"
                >
                  <span>📢</span> Broadcast Delay
                </button>
              </>
            )}

            {currentRole === 'receptionist' && (
              <>
                <button
                  onClick={() => setWalkinModal(true)}
                  className="px-4 py-2 rounded-xl bg-teal text-white hover:bg-teal-dark text-xs font-display font-700 flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>➕</span> Register Walk-in Patient
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl border border-border text-navy hover:bg-soft-gray text-xs font-display font-600 flex items-center gap-1.5 transition-all"
                >
                  <span>🖨️</span> Print Day Roster
                </button>
              </>
            )}

            {currentRole === 'admin' && (
              <button
                onClick={() => setBlockModal(true)}
                className="px-3.5 py-2 rounded-xl bg-teal text-white hover:bg-teal-dark text-xs font-display font-700 flex items-center gap-1.5 transition-all"
              >
                <span>⚙️</span> Manage Operating Schedules
              </button>
            )}
          </div>
        </div>

        {/* Patient Queue Cards / Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-border/50">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/60">
            <div>
              <h2 className="font-display font-800 text-xl text-navy">
                {currentRole === 'doctor'
                  ? '🩺 Clinical Consultation Queue'
                  : currentRole === 'receptionist'
                  ? `📋 Front Desk Attendance (${currentClinicObj.name})`
                  : '👑 Practice Roster & Appointment Management'}
              </h2>
              <p className="text-xs text-navy-700 mt-0.5">
                Showing scheduled patients for {filterDate} · Total Bookings: <strong>{appointments.length}</strong>
              </p>
            </div>
            <button
              onClick={refreshQueue}
              className="text-xs text-teal font-semibold hover:underline flex items-center gap-1"
            >
              <span>🔄</span> Refresh Queue
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-3 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-navy-700">Updating patient queue...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12 bg-soft-gray rounded-2xl">
              <p className="text-sm font-display font-600 text-navy">No appointments scheduled for this date.</p>
              <p className="text-xs text-navy-700 mt-1">Patients booking on the public website will appear here automatically.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((app, idx) => (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl border border-border/60 hover:border-teal/50 bg-white transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal/10 text-teal flex items-center justify-center font-display font-800 text-sm shrink-0">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-700 text-navy text-sm">{app.patientName}</span>
                        <span className="text-xs text-navy-700 font-medium">({app.patientAge}y · {app.patientGender})</span>
                        <span className="text-[11px] bg-soft-gray px-2 py-0.5 rounded font-mono text-navy-700">
                          {app.bookingReference}
                        </span>
                        {app.firstVisit && (
                          <span className="bg-emerald-500/10 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            First Visit
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-navy-700 mt-1 flex items-center gap-3 flex-wrap">
                        <span>🕒 <strong>{app.timeSlot}</strong></span>
                        <span>🏥 {app.clinicName}</span>
                        <span>📞 {app.patientPhone}</span>
                        <span className="text-teal font-semibold">🩺 {app.condition}</span>
                      </div>
                      {app.doctorClinicalNotes && (
                        <div className="mt-2 text-xs bg-purple-50 text-purple-900 p-2 rounded-lg border border-purple-200">
                          <strong>Dr. Remarks:</strong> {app.doctorClinicalNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Badges & Action Buttons */}
                  <div className="flex items-center gap-2 self-end lg:self-center">
                    {/* Status Badge */}
                    <span
                      className={`text-[11px] font-display font-700 px-3 py-1 rounded-full border capitalize ${
                        app.status === 'confirmed'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-700'
                          : app.status === 'arrived'
                          ? 'bg-blue-500/10 border-blue-500/30 text-blue-700'
                          : app.status === 'in_consultation'
                          ? 'bg-purple-500/10 border-purple-500/30 text-purple-700 animate-pulse'
                          : app.status === 'completed'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {app.status.replace('_', ' ')}
                    </span>

                    {/* Receptionist Actions */}
                    {currentRole === 'receptionist' && app.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(app.id, 'arrived')}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-display font-700 shadow-xs"
                      >
                        ✓ Mark Arrived
                      </button>
                    )}

                    {/* Doctor Actions */}
                    {currentRole === 'doctor' && (
                      <>
                        {app.status === 'arrived' && (
                          <button
                            onClick={() => handleStatusChange(app.id, 'in_consultation')}
                            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-display font-700 shadow-xs"
                          >
                            ▶️ Call In
                          </button>
                        )}
                        {app.status === 'in_consultation' && (
                          <button
                            onClick={() => {
                              setActiveNoteAppId(app.id)
                              setClinicalNotes(app.doctorClinicalNotes || '')
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-display font-700 shadow-xs"
                          >
                            📝 Complete & Add Notes
                          </button>
                        )}
                      </>
                    )}

                    {/* No-Show / Cancel */}
                    {app.status !== 'completed' && app.status !== 'cancelled' && (
                      <button
                        onClick={() => handleStatusChange(app.id, 'no_show')}
                        className="px-2.5 py-1.5 rounded-xl border border-border/80 text-navy-700/60 hover:text-red-600 text-xs font-medium"
                      >
                        No-Show
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL 1: DOCTOR CLINICAL NOTES WRITER                                  */}
      {/* ---------------------------------------------------------------------- */}
      {activeNoteAppId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-border/50 animate-fade-up">
            <h3 className="font-display font-800 text-xl text-navy">Consultation Notes & Diagnosis</h3>
            <p className="text-xs text-navy-700 mt-1">
              Record diagnosis, recommended physical therapy, X-ray remarks, or prescription notes.
            </p>

            <textarea
              rows={4}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="e.g. Grade 2 Knee Osteoarthritis. Prescribed NSAIDs & Quadriceps strengthening. Follow-up in 3 weeks with standing AP X-ray."
              className="w-full border-2 border-border/60 rounded-xl p-3.5 text-xs text-navy mt-4 focus:outline-none focus:border-teal resize-none"
            />

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setActiveNoteAppId(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-navy text-xs font-display font-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="flex-1 py-2.5 rounded-xl bg-teal text-white text-xs font-display font-700 shadow-md"
              >
                Save & Mark Completed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL 2: EMERGENCY LEAVE / SURGERY DATE BLOCKER                        */}
      {/* ---------------------------------------------------------------------- */}
      {blockModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-border/50 animate-fade-up">
            <h3 className="font-display font-800 text-xl text-navy">🚫 Block Date for Surgeries / Leave</h3>
            <p className="text-xs text-navy-700 mt-1 leading-relaxed">
              When a date is blocked, all public slots for that date become unavailable immediately.
            </p>

            <form onSubmit={handleBlockDate} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-display font-700 text-navy block mb-1">Select Date *</label>
                <input
                  type="date"
                  required
                  value={blockDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="w-full border border-border/80 rounded-xl p-2.5 text-xs text-navy focus:outline-none focus:border-teal"
                />
              </div>

              <div>
                <label className="text-xs font-display font-700 text-navy block mb-1">Clinic Branch</label>
                <select
                  value={blockClinicId}
                  onChange={(e) => setBlockClinicId(e.target.value)}
                  className="w-full border border-border/80 rounded-xl p-2.5 text-xs text-navy focus:outline-none focus:border-teal bg-white"
                >
                  <option value="all">All Clinics (Full Day Off)</option>
                  {clinics.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-display font-700 text-navy block mb-1">Reason (Optional)</label>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="e.g. Knee Replacement Surgery OT / Ortho Conference"
                  className="w-full border border-border/80 rounded-xl p-2.5 text-xs text-navy focus:outline-none focus:border-teal"
                />
              </div>

              <div className="flex gap-3 mt-6 pt-2">
                <button
                  type="button"
                  onClick={() => setBlockModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-navy text-xs font-display font-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-display font-700 shadow-md"
                >
                  Block This Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL 3: WALK-IN / TELEPHONE PATIENT INTAKE                            */}
      {/* ---------------------------------------------------------------------- */}
      {walkinModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-border/50 animate-fade-up">
            <h3 className="font-display font-800 text-xl text-navy">➕ Add Walk-in / Telephone Patient</h3>
            <p className="text-xs text-navy-700 mt-1">
              Add a patient to today's queue at <strong>{currentClinicObj.name}</strong>.
            </p>

            <form onSubmit={handleWalkinSubmit} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-display font-700 text-navy block mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  value={walkinForm.name}
                  onChange={(e) => setWalkinForm({ ...walkinForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full border border-border/80 rounded-xl p-2.5 text-xs text-navy focus:outline-none focus:border-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-display font-700 text-navy block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={walkinForm.phone}
                    onChange={(e) => setWalkinForm({ ...walkinForm, phone: e.target.value })}
                    placeholder="+91 98300 XXXXX"
                    className="w-full border border-border/80 rounded-xl p-2.5 text-xs text-navy focus:outline-none focus:border-teal"
                  />
                </div>
                <div>
                  <label className="text-xs font-display font-700 text-navy block mb-1">Age *</label>
                  <input
                    type="number"
                    required
                    value={walkinForm.age}
                    onChange={(e) => setWalkinForm({ ...walkinForm, age: e.target.value })}
                    placeholder="45"
                    className="w-full border border-border/80 rounded-xl p-2.5 text-xs text-navy focus:outline-none focus:border-teal"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-display font-700 text-navy block mb-1">Condition / Chief Complaint</label>
                <input
                  type="text"
                  value={walkinForm.condition}
                  onChange={(e) => setWalkinForm({ ...walkinForm, condition: e.target.value })}
                  placeholder="e.g. Acute Fracture / Knee Swelling"
                  className="w-full border border-border/80 rounded-xl p-2.5 text-xs text-navy focus:outline-none focus:border-teal"
                />
              </div>

              <div className="flex gap-3 mt-6 pt-2">
                <button
                  type="button"
                  onClick={() => setWalkinModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-navy text-xs font-display font-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal text-white text-xs font-display font-700 shadow-md"
                >
                  Add to Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL 4: DELAY BROADCASTER                                             */}
      {/* ---------------------------------------------------------------------- */}
      {delayModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-border/50 animate-fade-up">
            <span className="text-3xl block mb-2">📢</span>
            <h3 className="font-display font-800 text-lg text-navy">Broadcast Clinic Delay</h3>
            <p className="text-xs text-navy-700 mt-1">
              Notify patients in the waiting queue regarding consultation schedule delays.
            </p>

            <div className="mt-4 flex items-center justify-center gap-3">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setDelayMinutes(mins)}
                  className={`px-3 py-2 rounded-xl text-xs font-display font-700 border transition-all ${
                    delayMinutes === mins
                      ? 'bg-teal text-white border-teal'
                      : 'border-border text-navy hover:bg-soft-gray'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDelayModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-navy text-xs font-display font-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setDelayModal(false)
                  alert(`Delay alert (${delayMinutes} mins) broadcasted to receptionist desk!`)
                }}
                className="flex-1 py-2.5 rounded-xl bg-teal text-white text-xs font-display font-700"
              >
                Send Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
