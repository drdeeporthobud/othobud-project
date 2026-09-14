import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  appointmentService,
  AppointmentRecord,
  Clinic,
  DEFAULT_CLINICS,
  BlockedDate,
} from '@/services/appointmentService'
import {
  ConciergeBell,
  Stethoscope,
  ShieldCheck,
  Building2,
  MapPin,
  Phone,
  Printer,
  Clock,
  CheckCircle2,
  BadgeCheck,
  ClipboardList,
  CalendarRange,
  Activity,
  Baby,
  Armchair,
  Bell,
  Globe,
  Plus,
  Search,
  RefreshCw,
  Calendar,
  Check,
  X,
  Ban,
  Megaphone,
  Settings,
  FileText,
  UserPlus,
  Play,
  LogOut,
  Users,
} from 'lucide-react'
import AdminLogin from '@/components/AdminLogin'
import StaffManagement from '@/components/StaffManagement'
import { staffAuthService, StaffSession } from '@/services/staffAuthService'
import { supabase } from '@/lib/supabase'

type Role = 'doctor' | 'receptionist' | 'admin'

function ConditionTag({ condition, className = '' }: { condition: string; className?: string }) {
  const isPediatric =
    condition.toLowerCase().includes('pediatric') ||
    condition.toLowerCase().includes('child') ||
    condition.toLowerCase().includes('infant')
  return (
    <span className={`inline-flex items-center gap-1 font-semibold ${isPediatric ? 'text-rose-600' : 'text-teal'} ${className}`}>
      {isPediatric ? (
        <Baby className="w-3.5 h-3.5 text-rose-500 shrink-0" />
      ) : (
        <Activity className="w-3.5 h-3.5 text-teal shrink-0" />
      )}
      <span>{condition}</span>
    </span>
  )
}

export default function AdminDashboard() {
  const [session, setSession] = useState<StaffSession | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const currentRole: Role = session ? (session.role as Role) : 'receptionist'

  const [selectedClinicId, setSelectedClinicId] = useState<string>(
    'c1111111-1111-1111-1111-111111111111' // Salt Lake default
  )
  const [filterDate, setFilterDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [clinics, setClinics] = useState<Clinic[]>(DEFAULT_CLINICS)

  // Receptionist Specific State
  const [receptionistTab, setReceptionistTab] = useState<'pending' | 'queue' | 'capacity'>('queue')
  const [receptionistSubFilter, setReceptionistSubFilter] = useState<'all' | 'waiting' | 'in_consult' | 'confirmed' | 'completed'>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Decline Request Modal State
  const [declineModalOpen, setDeclineModalOpen] = useState<boolean>(false)
  const [declineAppId, setDeclineAppId] = useState<string | null>(null)
  const [declineReasonPreset, setDeclineReasonPreset] = useState<string>('Doctor in Emergency Hospital Surgery / OT')
  const [declineCustomReason, setDeclineCustomReason] = useState<string>('')

  // Clinical Notes Modal (Doctor role)
  const [activeNoteAppId, setActiveNoteAppId] = useState<string | null>(null)
  const [clinicalNotes, setClinicalNotes] = useState<string>('')

  // Emergency Leave Blocker Modal (Doctor/Admin role)
  const [blockModal, setBlockModal] = useState<boolean>(false)
  const [blockDate, setBlockDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [blockClinicId, setBlockClinicId] = useState<string>('all')
  const [blockReason, setBlockReason] = useState<string>('Emergency Surgery / Hospital OT')
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])

  // Walk-In Patient Modal
  const [walkinModal, setWalkinModal] = useState<boolean>(false)
  const [walkinForm, setWalkinForm] = useState({
    name: '',
    phone: '',
    age: '',
    gender: 'Male',
    condition: 'Knee Pain / Arthritis',
    timeSlot: '',
  })

  // Delay Notification Modal
  const [delayModal, setDelayModal] = useState<boolean>(false)
  const [delayMinutes, setDelayMinutes] = useState<number>(30)

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 4000)
      return () => clearTimeout(t)
    }
  }, [toastMessage])

  // JWT-backed session initialization
  useEffect(() => {
    const initSession = async () => {
      try {
        const s = await staffAuthService.getSession()
        setSession(s)
        if (s?.role === 'receptionist' && s.assignedClinicId) {
          setSelectedClinicId(s.assignedClinicId)
        }
      } catch {
        setSession(null)
      } finally {
        setAuthLoading(false)
      }
    }
    initSession()

    // Listen for Supabase auth state changes (logout, token refresh, etc.)
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
        if (event === 'SIGNED_OUT') {
          setSession(null)
        } else if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
          const s = await staffAuthService.getSession()
          setSession(s)
        }
      })
      return () => subscription.unsubscribe()
    }
  }, [])

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

  const [allPendingList, setAllPendingList] = useState<AppointmentRecord[]>([])

  const refreshQueue = async () => {
    setLoading(true)
    try {
      const clinicParam =
        currentRole === 'doctor' && selectedClinicId === 'all'
          ? undefined
          : selectedClinicId
      const [list, bDates, allAppointmentsForBranch] = await Promise.all([
        appointmentService.getAllAppointments(clinicParam, filterDate),
        appointmentService.getBlockedDates(clinicParam === 'all' ? undefined : clinicParam),
        appointmentService.getAllAppointments(clinicParam),
      ])
      setAppointments(list)
      setBlockedDates(bDates)
      setAllPendingList(allAppointmentsForBranch.filter((a) => a.status === 'pending'))
    } catch (err) {
      console.error('Failed to load appointments:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshQueue()
  }, [selectedClinicId, filterDate, currentRole])

  const handleStatusChange = async (id: string, newStatus: AppointmentRecord['status'], cancelReason?: string) => {
    await appointmentService.updateAppointmentStatus(id, newStatus, undefined, cancelReason)
    refreshQueue()
  }

  const handleApprove = async (app: AppointmentRecord) => {
    await appointmentService.approveAppointment(app.id)
    setToastMessage(`Booking ${app.bookingReference} for ${app.patientName} has been approved.`)
    refreshQueue()
  }

  const handleOpenDeclineModal = (appId: string) => {
    setDeclineAppId(appId)
    setDeclineReasonPreset('Doctor in Emergency Hospital Surgery / OT')
    setDeclineCustomReason('')
    setDeclineModalOpen(true)
  }

  const handleConfirmDecline = async () => {
    if (!declineAppId) return
    const finalReason = declineCustomReason.trim() ? declineCustomReason : declineReasonPreset
    await appointmentService.declineAppointment(declineAppId, finalReason)
    setDeclineModalOpen(false)
    setDeclineAppId(null)
    setToastMessage(`Booking declined with reason: "${finalReason}"`)
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
    setToastMessage(`Date ${blockDate} successfully blocked. New bookings are now disabled on the public website.`)
    refreshQueue()
  }

  const currentClinicObj = clinics.find((c) => c.id === selectedClinicId) || clinics[0]

  // Standard Clinic Slots for Capacity Matrix
  const getStandardSlots = (clinicSlug: string): string[] => {
    if (clinicSlug === 'alipore') {
      return ['11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM']
    }
    if (clinicSlug === 'newtown') {
      return ['6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM']
    }
    return ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM']
  }

  const standardSlots = getStandardSlots(currentClinicObj.slug)

  // Operating Day & Blocked Date Calculations
  const dateParts = filterDate.split('-').map(Number)
  const filterDateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
  const jsDay = filterDateObj.getDay() // 0=Sun, 1=Mon ... 6=Sat
  const isoDay = jsDay === 0 ? 7 : jsDay
  const isOperatingDay = currentClinicObj.operatingDays.includes(isoDay)

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const selectedDayName = dayNames[jsDay]
  const operatingDayNames = currentClinicObj.operatingDays
    .map((d) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][d - 1])
    .join(', ')

  const activeBlockedDate = blockedDates.find(
    (b) => b.blockedDate === filterDate && (b.clinicId === currentClinicObj.id || b.clinicId === null)
  )

  // Filtering for Receptionist View
  const clinicAppointments = appointments.filter((a) => a.clinicId === selectedClinicId)
  const pendingAppointments = allPendingList.filter((a) => a.clinicId === selectedClinicId)
  const confirmedAppointments = clinicAppointments.filter((a) => a.status === 'confirmed')
  const arrivedAppointments = clinicAppointments.filter((a) => a.status === 'arrived')
  const inConsultAppointments = clinicAppointments.filter((a) => a.status === 'in_consultation')
  const completedAppointments = clinicAppointments.filter((a) => a.status === 'completed')

  // Helper to parse time string like "5:00 PM" into minutes from midnight for stable ordering
  const parseTimeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 9999
    if (timeStr.includes('Emergency') || timeStr.includes('Fit-In')) return 9998
    const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i)
    if (!match) return 9999
    let hours = parseInt(match[1], 10)
    const minutes = parseInt(match[2], 10)
    const isPM = match[3].toUpperCase() === 'PM'
    if (isPM && hours !== 12) hours += 12
    if (!isPM && hours === 12) hours = 0
    return hours * 60 + minutes
  }

  // Stable Token Map for Receptionist View (Never shifts when filtering or searching)
  const stableDayAppointments = [...clinicAppointments]
    .filter((a) => a.status !== 'cancelled')
    .sort((a, b) => {
      const diff = parseTimeToMinutes(a.timeSlot) - parseTimeToMinutes(b.timeSlot)
      if (diff !== 0) return diff
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })

  const stableTokenMap = new Map<string, number>()
  stableDayAppointments.forEach((app, idx) => {
    stableTokenMap.set(app.id, idx + 1)
  })

  // Stable Token Map for Practice / Doctor View (Across all appointments)
  const practiceStableAppointments = [...appointments]
    .filter((a) => a.status !== 'cancelled')
    .sort((a, b) => {
      const diff = parseTimeToMinutes(a.timeSlot) - parseTimeToMinutes(b.timeSlot)
      if (diff !== 0) return diff
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })

  const practiceTokenMap = new Map<string, number>()
  practiceStableAppointments.forEach((app, idx) => {
    practiceTokenMap.set(app.id, idx + 1)
  })

  // Open Walkin Modal with First Available Slot Pre-selected
  const handleOpenWalkinModal = (preselectedSlot?: string) => {
    let slotToSet = preselectedSlot
    if (!slotToSet) {
      const firstAvailable = standardSlots.find(
        (s) => !clinicAppointments.some((a) => a.timeSlot === s && a.status !== 'cancelled')
      )
      slotToSet = firstAvailable || 'Emergency Fit-In (Now)'
    }
    setWalkinForm({
      name: '',
      phone: '',
      age: '',
      gender: 'Male',
      condition: 'Knee Pain / Arthritis',
      timeSlot: slotToSet,
    })
    setWalkinModal(true)
  }

  const handleWalkinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const chosenSlot = walkinForm.timeSlot || standardSlots[0] || '5:00 PM'
    const isOverbookOrEmergency =
      chosenSlot.includes('Emergency') ||
      chosenSlot.includes('Fit-In') ||
      clinicAppointments.some((a) => a.timeSlot === chosenSlot && a.status !== 'cancelled')

    const booked = await appointmentService.bookAppointment({
      clinicId: currentClinicObj.id,
      clinicName: currentClinicObj.name,
      date: filterDate,
      timeSlot: chosenSlot,
      patientName: walkinForm.name,
      patientPhone: walkinForm.phone,
      patientAge: Number(walkinForm.age) || 30,
      patientGender: walkinForm.gender,
      condition: walkinForm.condition,
      firstVisit: true,
      allowOverbook: isOverbookOrEmergency,
    })

    if (booked.success && booked.appointmentId) {
      await appointmentService.updateAppointmentStatus(booked.appointmentId, 'arrived')
      setWalkinModal(false)
      setWalkinForm({
        name: '',
        phone: '',
        age: '',
        gender: 'Male',
        condition: 'Knee Pain / Arthritis',
        timeSlot: '',
      })
      setToastMessage(`Walk-in patient "${walkinForm.name}" registered and checked-in as Arrived.`)
      refreshQueue()
    } else {
      setToastMessage(`Failed to register walk-in: ${booked.error || 'Please try another slot.'}`)
    }
  }

  // Search filtered
  const filteredBySearch = clinicAppointments.filter((a) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      a.patientName.toLowerCase().includes(q) ||
      a.patientPhone.includes(q) ||
      a.bookingReference.toLowerCase().includes(q) ||
      a.condition.toLowerCase().includes(q)
    )
  })

  // Queue sub-filter
  const queueDisplayList = filteredBySearch.filter((a) => {
    if (receptionistSubFilter === 'waiting') return a.status === 'arrived'
    if (receptionistSubFilter === 'in_consult') return a.status === 'in_consultation'
    if (receptionistSubFilter === 'confirmed') return a.status === 'confirmed'
    if (receptionistSubFilter === 'completed') return a.status === 'completed'
    return a.status !== 'pending' && a.status !== 'cancelled' // 'all' active queue
  })

  const handleSignOut = async () => {
    await staffAuthService.logout()
    setSession(null)
    setToastMessage('Workstation signed out.')
  }

  // Gatekeeper: Show loading spinner while verifying JWT session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#070e1c] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-teal/30 border-t-teal rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm font-display">Verifying session...</p>
        </div>
      </div>
    )
  }

  // Gatekeeper: Render Login Screen if No Active Session
  if (!session) {
    return (
      <AdminLogin
        onLoginSuccess={(newSession) => {
          setSession(newSession)
          if (newSession.role === 'receptionist' && newSession.assignedClinicId) {
            setSelectedClinicId(newSession.assignedClinicId)
          }
        }}
      />
    )
  }

  /* =================================================================== */
  /* ENTERPRISE SYSTEM ADMINISTRATOR CONSOLE (Left Sidebar + Center Work)*/
  /* =================================================================== */
  if (currentRole === 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-navy">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-navy text-white px-5 py-3 rounded-2xl shadow-2xl border border-teal/40 flex items-center gap-3 animate-fade-up">
            <Bell className="w-4 h-4 text-teal shrink-0" />
            <span className="text-xs font-display font-600">{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-white/60 hover:text-white ml-2 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* =================================================================== */}
        {/* LEFT SIDEBAR (Enterprise Admin Management)                          */}
        {/* =================================================================== */}
        <aside className="w-full md:w-64 lg:w-72 bg-navy text-white shrink-0 flex flex-col justify-between border-r border-white/10 md:min-h-screen md:sticky md:top-0">
          <div>
            {/* Sidebar Brand Header */}
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal to-teal-dark flex items-center justify-center text-white shadow-md shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-display font-800 text-white text-base tracking-tight leading-tight">
                  Orthobud
                </div>
                <div className="text-[11px] text-white/60 font-medium flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                  <span>Admin Console</span>
                </div>
              </div>
            </div>

            {/* Navigation Section */}
            <div className="p-4 space-y-6">
              <div>
                <div className="text-[10px] font-display font-700 text-white/40 uppercase tracking-wider px-3 mb-2">
                  System Management
                </div>
                <nav className="space-y-1">
                  {/* Active: Staff Accounts */}
                  <button
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-display font-700 bg-teal/15 text-teal border border-teal/30 shadow-xs transition-all text-left cursor-default"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-teal" />
                      <span>Staff Accounts</span>
                    </div>
                    <span className="text-[10px] bg-teal/20 text-teal px-2 py-0.5 rounded-full font-mono font-bold">
                      Active
                    </span>
                  </button>

                  {/* Future Modules */}
                  <div className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-display font-600 text-white/40 select-none text-left">
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-4 h-4 text-white/30" />
                      <span>Clinics & Branches</span>
                    </div>
                    <span className="text-[9px] bg-white/5 text-white/40 px-1.5 py-0.5 rounded font-mono">
                      Soon
                    </span>
                  </div>

                  <div className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-display font-600 text-white/40 select-none text-left">
                    <div className="flex items-center gap-2.5">
                      <ClipboardList className="w-4 h-4 text-white/30" />
                      <span>Audit Logs</span>
                    </div>
                    <span className="text-[9px] bg-white/5 text-white/40 px-1.5 py-0.5 rounded font-mono">
                      Soon
                    </span>
                  </div>

                  <div className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-display font-600 text-white/40 select-none text-left">
                    <div className="flex items-center gap-2.5">
                      <Settings className="w-4 h-4 text-white/30" />
                      <span>System Settings</span>
                    </div>
                    <span className="text-[9px] bg-white/5 text-white/40 px-1.5 py-0.5 rounded font-mono">
                      Soon
                    </span>
                  </div>
                </nav>
              </div>
            </div>
          </div>

          {/* Sidebar Bottom: User Profile & Quick Actions */}
          <div className="p-4 border-t border-white/10 space-y-3 bg-navy-950/40">
            {/* Admin Profile Pill */}
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-xl bg-teal/20 text-teal flex items-center justify-center text-xs font-bold font-display shrink-0">
                {session.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-display font-700 text-white truncate">
                    {session.fullName}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                </div>
                <div className="text-[10px] text-white/50 font-mono truncate">
                  @{session.username} · Admin
                </div>
              </div>
            </div>

            {/* Links & Signout */}
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="flex-1 text-white/70 hover:text-white text-xs font-display font-600 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-1.5 transition-all"
                title="Return to public clinic website"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Website</span>
              </Link>

              <button
                onClick={handleSignOut}
                className="flex-1 text-rose-300 hover:text-white text-xs font-display font-600 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="Sign out of admin workstation"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* =================================================================== */}
        {/* MIDDLE CENTER WORKSPACE                                             */}
        {/* =================================================================== */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
          {/* Workspace Title Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-border/60 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-display font-600 text-teal mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Security & Access Registry</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-800 text-navy tracking-tight">
                Staff Accounts
              </h1>
              <p className="text-xs text-navy-700 mt-1 max-w-2xl leading-relaxed">
                Manage doctor, receptionist, and administrator credentials, permissions, and security across all Orthobud clinic branches.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-slate-100 text-navy-700 text-xs font-mono px-3 py-1.5 rounded-xl border border-border">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Supabase Connected
              </span>
            </div>
          </div>

          {/* Staff Accounts Management Component */}
          <StaffManagement
            clinics={clinics}
            onToast={(msg) => setToastMessage(msg)}
            currentAdminId={session.userId}
          />
        </main>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen pt-0 bg-soft-gray pb-20 print:hidden">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-navy text-white px-5 py-3 rounded-2xl shadow-2xl border border-teal/40 flex items-center gap-3 animate-fade-up">
            <Bell className="w-4 h-4 text-teal shrink-0" />
            <span className="text-xs font-display font-600">{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-white/60 hover:text-white ml-2">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Top Admin Navigation Bar */}
        <div className="bg-navy border-b border-white/10 px-6 py-3.5 sticky top-0 z-40 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal/20 flex items-center justify-center text-teal">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-800 text-white text-lg">Orthobud Portal</span>
                  <span className="bg-teal/20 text-teal text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {currentRole.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Authenticated Staff User Pill */}
              <div className="flex items-center gap-2.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-teal/20 text-teal flex items-center justify-center text-xs font-bold font-display">
                  {session.fullName.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-display font-700 text-white leading-none">
                      {session.fullName === 'Practice Administrator' ? 'Admin' : session.fullName}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <span className="text-[10px] text-white/50 font-mono">
                    {session.role === 'receptionist' && session.assignedClinicName
                      ? session.assignedClinicName
                      : `@${session.username}`}
                  </span>
                </div>
              </div>

              {/* Exit to Main Website link */}
              <Link
                to="/"
                className="text-white/70 hover:text-white text-xs font-display font-600 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition-all"
                title="Return to public clinic website"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Main Website</span>
              </Link>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="text-rose-300 hover:text-white text-xs font-display font-600 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                title="Sign out of staff workstation"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-6">
          {/* =================================================================== */}
          {/* RECEPTIONIST SPECIFIC DASHBOARD                                     */}
          {/* =================================================================== */}
          {currentRole === 'receptionist' ? (
            <div className="space-y-6">
              {/* 1. Branch Context & Operational Banner */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-border/60">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-border/60">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal/10 text-teal flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="font-display font-800 text-xl text-navy">{currentClinicObj.name}</h1>
                        {activeBlockedDate ? (
                          <span className="bg-amber-500/10 text-amber-800 text-xs font-display font-700 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            Doctor on Leave / OT
                          </span>
                        ) : !isOperatingDay ? (
                          <span className="bg-slate-200/80 text-slate-700 text-xs font-display font-700 px-2.5 py-0.5 rounded-full border border-slate-300 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-slate-400" />
                            Clinic Closed Today
                          </span>
                        ) : (
                          <span className="bg-emerald-500/10 text-emerald-700 text-xs font-display font-700 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Desk Online
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-navy-700 mt-1 flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-navy-700/70 shrink-0" /> {currentClinicObj.address}</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-navy-700/70 shrink-0" /> {currentClinicObj.hoursDescription}</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-navy-700/70 shrink-0" /> {currentClinicObj.phone}</span>
                      </p>
                    </div>
                  </div>

                  {/* Desk Controls: Branch Switcher & Date Selector */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Branch selector — Only show for admin/doctor, receptionist is locked to assigned clinic */}
                    {currentRole !== 'receptionist' && (
                      <div className="flex items-center gap-1.5 bg-soft-gray p-1 rounded-xl border border-border/50">
                        <span className="text-[11px] text-navy-700 px-2 font-medium">Switch Branch:</span>
                        <select
                          value={selectedClinicId}
                          onChange={(e) => setSelectedClinicId(e.target.value)}
                          className="text-xs font-display font-700 text-navy bg-white border border-border/80 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal"
                        >
                          {clinics.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Date Selector */}
                    <div className="flex items-center gap-2 bg-soft-gray p-1 rounded-xl border border-border/50">
                      <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="border border-border/80 rounded-lg px-2.5 py-1 text-xs text-navy font-medium focus:outline-none focus:border-teal bg-white"
                      />
                      <button
                        onClick={() => setFilterDate(new Date().toISOString().split('T')[0])}
                        className="px-2 py-1 text-xs font-semibold text-teal hover:underline"
                      >
                        Today
                      </button>
                    </div>

                    {/* Quick Walk-In Button */}
                    <button
                      onClick={() => handleOpenWalkinModal()}
                      className="px-4 py-2.5 rounded-xl bg-teal text-white hover:bg-teal-dark text-xs font-display font-700 flex items-center gap-2 shadow-sm transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Quick Walk-In</span>
                    </button>

                  {/* Print Roster */}
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2.5 rounded-xl border border-border bg-white text-navy hover:bg-soft-gray text-xs font-display font-600 flex items-center gap-1.5 transition-all shadow-xs"
                    title="Print Daily Token Roster"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Roster</span>
                  </button>
                </div>
              </div>

              {/* 2. Real-Time Front Desk Stat Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <button
                  onClick={() => setReceptionistTab('pending')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    receptionistTab === 'pending'
                      ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20'
                      : 'border-border/60 bg-soft-gray/60 hover:bg-soft-gray'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-display font-700 text-amber-900">Pending Review</span>
                    <Clock className="w-4 h-4 text-amber-700" />
                  </div>
                  <div className="font-display font-800 text-2xl text-amber-900 mt-2">
                    {pendingAppointments.length}
                  </div>
                  <p className="text-[11px] text-amber-700/80 mt-0.5">Needs reception approval</p>
                </button>

                <button
                  onClick={() => {
                    setReceptionistTab('queue')
                    setReceptionistSubFilter('confirmed')
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    receptionistTab === 'queue' && receptionistSubFilter === 'confirmed'
                      ? 'border-teal bg-teal/10 ring-2 ring-teal/20'
                      : 'border-border/60 bg-soft-gray/60 hover:bg-soft-gray'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-display font-700 text-navy">Confirmed Today</span>
                    <CheckCircle2 className="w-4 h-4 text-teal" />
                  </div>
                  <div className="font-display font-800 text-2xl text-navy mt-2">
                    {confirmedAppointments.length}
                  </div>
                  <p className="text-[11px] text-navy-700 mt-0.5">Expected to arrive</p>
                </button>

                <button
                  onClick={() => {
                    setReceptionistTab('queue')
                    setReceptionistSubFilter('waiting')
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    receptionistTab === 'queue' && receptionistSubFilter === 'waiting'
                      ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20'
                      : 'border-border/60 bg-soft-gray/60 hover:bg-soft-gray'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-display font-700 text-blue-900">In Waiting Area</span>
                    <Building2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="font-display font-800 text-2xl text-blue-900 mt-2">
                    {arrivedAppointments.length}
                  </div>
                  <p className="text-[11px] text-blue-700/80 mt-0.5">Marked arrived at desk</p>
                </button>

                <button
                  onClick={() => {
                    setReceptionistTab('queue')
                    setReceptionistSubFilter('completed')
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    receptionistTab === 'queue' && receptionistSubFilter === 'completed'
                      ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20'
                      : 'border-border/60 bg-soft-gray/60 hover:bg-soft-gray'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-display font-700 text-emerald-900">Completed</span>
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="font-display font-800 text-2xl text-emerald-900 mt-2">
                    {completedAppointments.length}
                  </div>
                  <p className="text-[11px] text-emerald-700/80 mt-0.5">Consultation finished</p>
                </button>
              </div>
            </div>

            {/* 3. Receptionist Navigation Tabs & Search Toolbar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Tab Navigation */}
              <div className="flex items-center gap-1.5 bg-soft-gray p-1 rounded-xl">
                <button
                  onClick={() => setReceptionistTab('queue')}
                  className={`px-4 py-2 rounded-lg text-xs font-display font-700 transition-all flex items-center gap-2 ${
                    receptionistTab === 'queue'
                      ? 'bg-white text-navy shadow-xs'
                      : 'text-navy-700 hover:text-navy'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <ClipboardList className="w-3.5 h-3.5 shrink-0" />
                    Today's OPD Queue
                  </span>
                  <span className="bg-navy/10 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    {clinicAppointments.filter((a) => a.status !== 'pending' && a.status !== 'cancelled').length}
                  </span>
                </button>

                <button
                  onClick={() => setReceptionistTab('pending')}
                  className={`px-4 py-2 rounded-lg text-xs font-display font-700 transition-all flex items-center gap-2 ${
                    receptionistTab === 'pending'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-navy-700 hover:text-navy'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    Pending Requests
                  </span>
                  {pendingAppointments.length > 0 && (
                    <span className="bg-white/30 text-white px-1.5 py-0.5 rounded text-[10px] font-bold animate-pulse">
                      {pendingAppointments.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setReceptionistTab('capacity')}
                  className={`px-4 py-2 rounded-lg text-xs font-display font-700 transition-all flex items-center gap-2 ${
                    receptionistTab === 'capacity'
                      ? 'bg-white text-navy shadow-xs'
                      : 'text-navy-700 hover:text-navy'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarRange className="w-3.5 h-3.5 shrink-0" />
                    Slot Capacity Matrix
                  </span>
                </button>
              </div>

              {/* Instant Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 text-navy-700/50 w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Search by name, phone, token..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-soft-gray border border-border/80 rounded-xl pl-8 pr-3 py-2 text-xs text-navy focus:outline-none focus:border-teal font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-navy-700/60 hover:text-navy"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 4. Tab Content Area */}
            {/* ------------------------------------------------------------- */}
            {/* TAB 1: PENDING REQUESTS QUEUE (Needs Receptionist Approval)   */}
            {/* ------------------------------------------------------------- */}
            {receptionistTab === 'pending' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-border/60">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-border/60">
                  <div>
                    <h2 className="font-display font-800 text-lg text-navy flex items-center gap-2">
                      <span className="inline-flex items-center gap-2">
                        <Clock className="w-5 h-5 text-amber-600" />
                        Incoming Patient Requests
                      </span>
                      <span className="bg-amber-500/10 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        {pendingAppointments.length} Action Needed
                      </span>
                    </h2>
                    <p className="text-xs text-navy-700 mt-0.5">
                      Review appointments requested online by patients. Approving moves the slot to Confirmed and sends automated WhatsApp instructions.
                    </p>
                  </div>
                  <button
                    onClick={refreshQueue}
                    className="text-xs text-teal font-semibold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-3 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-xs text-navy-700">Checking pending requests...</p>
                  </div>
                ) : pendingAppointments.length === 0 ? (
                  <div className="text-center py-12 bg-soft-gray/50 rounded-2xl border border-dashed border-border/80">
                    <BadgeCheck className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm font-display font-700 text-navy">All caught up! No pending requests.</p>
                    <p className="text-xs text-navy-700 mt-1">
                      New online booking requests submitted by patients will pop up here in real-time.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingAppointments.map((app) => (
                      <div
                        key={app.id}
                        className="p-5 rounded-2xl border-2 border-amber-500/20 bg-amber-500/[0.02] hover:border-amber-500/50 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-amber-500 text-white text-[11px] font-display font-700 px-2.5 py-0.5 rounded-full">
                              Pending Approval
                            </span>
                            <span className="font-display font-800 text-navy text-base">{app.patientName}</span>
                            <span className="text-xs text-navy-700 font-medium">({app.patientAge}y · {app.patientGender})</span>
                            <span className="text-xs font-mono bg-soft-gray px-2 py-0.5 rounded text-navy-700">
                              Ref: {app.bookingReference}
                            </span>
                            {app.firstVisit && (
                              <span className="bg-blue-500/10 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                New Patient
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-navy-700 flex-wrap">
                            <span className="bg-white px-2.5 py-1 rounded-lg border border-border font-medium inline-flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-navy-700/70" />
                              Requested Date: <strong className="text-navy">{app.date}</strong>
                            </span>
                            <span className="bg-white px-2.5 py-1 rounded-lg border border-border font-medium inline-flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-navy-700/70" />
                              Requested Slot: <strong className="text-navy">{app.timeSlot}</strong>
                            </span>
                            <span className="bg-white px-2.5 py-1 rounded-lg border border-border font-medium inline-flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-navy-700/70" />
                              <a href={`tel:${app.patientPhone}`} className="text-teal hover:underline font-semibold">{app.patientPhone}</a>
                            </span>
                            <span className="bg-white px-2.5 py-1 rounded-lg border border-border font-medium inline-flex items-center gap-1.5">
                              <ConditionTag condition={app.condition} />
                            </span>
                          </div>

                          {app.notes && (
                            <div className="text-xs text-navy-700 bg-white p-2.5 rounded-xl border border-border/60">
                              <span className="font-semibold text-navy">Patient Note:</span> {app.notes}
                            </div>
                          )}
                        </div>

                        {/* Receptionist Action Buttons */}
                        <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center">
                          <a
                            href={`tel:${app.patientPhone}`}
                            className="px-3.5 py-2 rounded-xl border border-border hover:bg-soft-gray text-navy text-xs font-display font-600 transition-all flex items-center gap-1.5"
                          >
                            <Phone className="w-3.5 h-3.5" /> Call
                          </a>

                          <button
                            onClick={() => handleOpenDeclineModal(app.id)}
                            className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-display font-700 transition-all flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" /> Decline
                          </button>

                          <button
                            onClick={() => handleApprove(app)}
                            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-display font-700 shadow-sm transition-all flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve & Confirm
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB 2: TODAY'S OPD ATTENDANCE QUEUE                           */}
            {/* ------------------------------------------------------------- */}
            {receptionistTab === 'queue' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-border/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-border/60">
                  <div>
                    <h2 className="font-display font-800 text-lg text-navy flex items-center gap-2">
                      <span className="inline-flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-teal" />
                        Front Desk Patient Attendance Roster
                      </span>
                      <span className="text-xs font-normal text-navy-700">({filterDate})</span>
                    </h2>
                    <p className="text-xs text-navy-700 mt-0.5">
                      Mark patients as <strong>Arrived</strong> when they reach the clinic desk so Dr. Deep sees them in the consultation room.
                    </p>
                  </div>

                  {/* Sub-Filter Badges */}
                  <div className="flex items-center gap-1.5 bg-soft-gray p-1 rounded-xl text-xs flex-wrap">
                    {[
                      { id: 'all', label: 'All Active' },
                      { id: 'confirmed', label: 'Expected' },
                      { id: 'waiting', label: 'In Waiting Area' },
                      { id: 'in_consult', label: 'With Doctor' },
                      { id: 'completed', label: 'Finished' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setReceptionistSubFilter(f.id as typeof receptionistSubFilter)}
                        className={`px-3 py-1.5 rounded-lg font-display font-600 capitalize transition-all ${
                          receptionistSubFilter === f.id
                            ? 'bg-white text-navy shadow-xs'
                            : 'text-navy-700 hover:text-navy'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-3 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-xs text-navy-700">Loading patient roster...</p>
                  </div>
                ) : queueDisplayList.length === 0 ? (
                  <div className="text-center py-12 bg-soft-gray/50 rounded-2xl border border-dashed border-border/80">
                    <p className="text-sm font-display font-700 text-navy">No patients in this queue for {filterDate}.</p>
                    <p className="text-xs text-navy-700 mt-1">
                      Use <strong>"+ Quick Walk-In"</strong> to check-in an arriving patient directly.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {queueDisplayList.map((app, idx) => (
                      <div
                        key={app.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                          app.status === 'arrived'
                            ? 'border-blue-500/40 bg-blue-500/[0.02]'
                            : app.status === 'in_consultation'
                            ? 'border-purple-500/50 bg-purple-500/[0.03]'
                            : 'border-border/60 bg-white hover:border-teal/40'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Token Number */}
                          <div className="w-12 h-12 rounded-2xl bg-teal/10 text-teal flex flex-col items-center justify-center font-display font-800 text-sm shrink-0 border border-teal/20">
                            <span className="text-[9px] uppercase tracking-wider text-navy-700">Token</span>
                            <span>#{stableTokenMap.get(app.id) ?? (idx + 1)}</span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-display font-700 text-navy text-base">{app.patientName}</span>
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
                              <span className="inline-flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-navy-700/70" />
                                Slot: <strong className="text-navy">{app.timeSlot}</strong>
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5 text-navy-700/70" />
                                <a href={`tel:${app.patientPhone}`} className="hover:underline">{app.patientPhone}</a>
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <ConditionTag condition={app.condition} />
                              </span>
                            </div>

                            {app.cancellationReason && (
                              <div className="mt-1 text-xs text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg">
                                <strong>Cancelled:</strong> {app.cancellationReason}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status Badges & Receptionist Actions */}
                        <div className="flex items-center gap-2 shrink-0 self-end lg:self-center flex-wrap">
                          {/* Status Badge */}
                          <span
                            className={`text-xs font-display font-700 px-3 py-1.5 rounded-xl border capitalize ${
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
                            {app.status === 'arrived' ? (
                              <span className="inline-flex items-center gap-1.5">
                                <Armchair className="w-3.5 h-3.5 shrink-0" />
                                Waiting in Lounge
                              </span>
                            ) : app.status === 'in_consultation' ? (
                              <span className="inline-flex items-center gap-1.5">
                                <Stethoscope className="w-3.5 h-3.5 shrink-0" />
                                With Doctor
                              </span>
                            ) : app.status === 'confirmed' ? (
                              <span className="inline-flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 shrink-0" />
                                Not Arrived
                              </span>
                            ) : (
                              app.status
                            )}
                          </span>

                          {/* Receptionist Mark Arrived */}
                          {app.status === 'confirmed' && (
                            <button
                              onClick={() => {
                                handleStatusChange(app.id, 'arrived')
                                setToastMessage(`Patient ${app.patientName} marked as Arrived at desk!`)
                              }}
                              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-display font-700 shadow-xs transition-all flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" /> Mark Arrived
                            </button>
                          )}

                          {/* Receptionist No-Show */}
                          {(app.status === 'confirmed' || app.status === 'arrived') && (
                            <button
                              onClick={() => {
                                if (confirm(`Mark ${app.patientName} as No-Show?`)) {
                                  handleStatusChange(app.id, 'no_show')
                                }
                              }}
                              className="px-3 py-2 rounded-xl border border-border text-navy-700 hover:text-red-600 hover:bg-red-50 text-xs font-medium transition-all"
                            >
                              No-Show
                            </button>
                          )}

                          {/* Call link */}
                          <a
                            href={`tel:${app.patientPhone}`}
                            className="px-3 py-2 rounded-xl border border-border hover:bg-soft-gray text-navy text-xs font-display font-600 transition-all flex items-center justify-center"
                            title="Call Patient"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TAB 3: CLINIC SLOT CAPACITY MATRIX                            */}
            {/* ------------------------------------------------------------- */}
            {receptionistTab === 'capacity' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-border/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-border/60">
                  <div>
                    <h2 className="font-display font-800 text-lg text-navy flex items-center gap-2">
                      <CalendarRange className="w-5 h-5 text-teal" />
                      <span>Slot Capacity Matrix — {currentClinicObj.name}</span>
                    </h2>
                    <p className="text-xs text-navy-700 mt-0.5">
                      Session Schedule for {filterDate} ({selectedDayName}) · 30-Minute Consultation Windows
                    </p>
                  </div>
                  {!activeBlockedDate && isOperatingDay && (
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Open Slot
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg">
                        <span className="w-2 h-2 rounded-full bg-amber-500" /> Booked / Occupied
                      </span>
                    </div>
                  )}
                </div>

                {activeBlockedDate ? (
                  <div className="bg-amber-500/[0.06] border-2 border-dashed border-amber-500/40 rounded-3xl p-8 sm:p-12 text-center my-4">
                    <Ban className="w-10 h-10 text-amber-700 mx-auto mb-3" />
                    <h3 className="font-display font-800 text-xl text-amber-950">
                      OPD Suspended — Dr. Deep Unavailable on {filterDate}
                    </h3>
                    <p className="text-xs text-amber-800 mt-2 max-w-lg mx-auto font-medium">
                      Reason: <strong>{activeBlockedDate.reason || 'Emergency Hospital Surgery / Medical Conference'}</strong>
                    </p>
                    <p className="text-xs text-amber-700/80 mt-1 max-w-md mx-auto">
                      All consultation slots for {currentClinicObj.name} are blocked for this date. Online patient bookings are disabled on the public website.
                    </p>
                  </div>
                ) : !isOperatingDay ? (
                  <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-8 sm:p-12 text-center my-4">
                    <Clock className="w-10 h-10 text-navy-700 mx-auto mb-3" />
                    <h3 className="font-display font-800 text-xl text-navy">
                      {currentClinicObj.name} is Closed on {selectedDayName}s
                    </h3>
                    <p className="text-xs text-navy-700 mt-2 max-w-lg mx-auto leading-relaxed">
                      Dr. Deep Chakraborty does not hold OPD consultations at this clinic branch on {selectedDayName}s.
                    </p>
                    <div className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-white rounded-xl border border-border text-xs font-semibold text-teal shadow-xs">
                      <Calendar className="w-3.5 h-3.5 text-teal shrink-0" />
                      <span>Operating Days: {operatingDayNames} · {currentClinicObj.hoursDescription}</span>
                    </div>
                    <p className="text-[11px] text-navy-700/70 mt-3">
                      Please select an active operating day from the date selector above to view or assign slots.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {standardSlots.map((slot) => {
                      const bookedPatients = clinicAppointments.filter(
                        (a) => a.timeSlot === slot && a.status !== 'cancelled'
                      )
                      const isOccupied = bookedPatients.length > 0
                      const hasPending = bookedPatients.some((a) => a.status === 'pending')

                      return (
                        <div
                          key={slot}
                          className={`p-5 rounded-2xl border transition-all ${
                            hasPending
                              ? 'border-amber-500 bg-amber-500/[0.04] ring-1 ring-amber-500/30'
                              : isOccupied
                              ? 'border-teal/40 bg-teal/[0.02]'
                              : 'border-border/80 bg-soft-gray/40 hover:border-teal/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-display font-800 text-base text-navy flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-teal shrink-0" />
                              <span>{slot}</span>
                            </span>
                            <span
                              className={`text-[10px] font-display font-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                hasPending
                                  ? 'bg-amber-500 text-white shadow-xs animate-pulse'
                                  : isOccupied
                                  ? 'bg-blue-500/10 text-blue-800 border border-blue-500/20'
                                  : 'bg-emerald-500/10 text-emerald-800 border border-emerald-500/20'
                              }`}
                            >
                              {hasPending ? (
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="w-3 h-3 shrink-0" />
                                  Pending Review
                                </span>
                              ) : isOccupied ? (
                                'Confirmed (1/1)'
                              ) : (
                                'Available (0/1)'
                              )}
                            </span>
                          </div>

                          {isOccupied ? (
                            <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                              {bookedPatients.map((p) => (
                                <div key={p.id} className="text-xs bg-white p-2.5 rounded-xl border border-border/60">
                                  <div className="flex items-center justify-between">
                                    <div className="font-display font-700 text-navy">{p.patientName}</div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      p.status === 'pending'
                                        ? 'bg-amber-100 text-amber-800'
                                        : p.status === 'arrived'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-emerald-100 text-emerald-800'
                                    }`}>
                                      {p.status === 'pending' ? 'Pending' : p.status}
                                    </span>
                                  </div>
                                  <div className="text-navy-700 text-[11px] mt-1 flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1">
                                      <Phone className="w-3 h-3 text-navy-700/70 shrink-0" />
                                      {p.patientPhone}
                                    </span>
                                    <span className="font-mono text-teal font-semibold">{p.bookingReference}</span>
                                  </div>
                                  {p.status === 'pending' && (
                                    <div className="mt-2 pt-2 border-t border-dashed border-amber-200 flex items-center justify-end gap-2">
                                      <button
                                        onClick={() => handleOpenDeclineModal(p.id)}
                                        className="text-[11px] text-rose-600 font-semibold hover:underline"
                                      >
                                        Decline
                                      </button>
                                      <button
                                        onClick={() => handleApprove(p)}
                                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition-all flex items-center gap-1"
                                      >
                                        <Check className="w-3 h-3" /> Approve Slot
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                              <span className="text-xs text-navy-700/70">Ready for walk-in</span>
                              <button
                                onClick={() => handleOpenWalkinModal(slot)}
                                className="px-3 py-1.5 rounded-lg bg-teal hover:bg-teal-dark text-white text-xs font-display font-700 transition-all"
                              >
                                + Assign Patient
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* =================================================================== */
          /* DOCTOR CLINICAL VIEW (Preserved with all clinical tools)            */
          /* =================================================================== */
          <>
            {/* Controls Strip: Clinic Filter, Date Picker, and Action Buttons */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-border/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                {/* Clinic Tabs */}
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
                      <Ban className="w-3.5 h-3.5" />
                      <span>Block Date (Surgery / Leave)</span>
                    </button>
                    <button
                      onClick={() => setDelayModal(true)}
                      className="px-3.5 py-2 rounded-xl border border-border text-navy hover:bg-soft-gray text-xs font-display font-600 flex items-center gap-1.5 transition-all"
                    >
                      <Megaphone className="w-3.5 h-3.5" />
                      <span>Broadcast Delay</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Patient Queue Cards / Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-border/50">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/60">
                <div>
                  <h2 className="font-display font-800 text-xl text-navy">
                    {currentRole === 'doctor' ? (
                      <span className="inline-flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-teal" />
                        Clinical Consultation Queue
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-teal" />
                        Appointment Roster & Management
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-navy-700 mt-0.5">
                    Showing scheduled patients for {filterDate} · Total Bookings: <strong>{appointments.length}</strong>
                  </p>
                </div>
                <button
                  onClick={refreshQueue}
                  className="text-xs text-teal font-semibold hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh Queue
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
                          #{practiceTokenMap.get(app.id) ?? (idx + 1)}
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
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-navy-700/70" />
                              <strong>{app.timeSlot}</strong>
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5 text-navy-700/70" />
                              {app.clinicName}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-navy-700/70" />
                              {app.patientPhone}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <ConditionTag condition={app.condition} />
                            </span>
                          </div>
                          {app.doctorClinicalNotes && (
                            <div className="mt-2 text-xs bg-purple-50 text-purple-900 p-2 rounded-lg border border-purple-200">
                              <strong>Dr. Remarks:</strong> {app.doctorClinicalNotes}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status Badges & Action Buttons */}
                      <div className="flex items-center gap-2 self-end lg:self-center flex-wrap">
                        <span
                          className={`text-[11px] font-display font-700 px-3 py-1 rounded-full border capitalize ${
                            app.status === 'pending'
                              ? 'bg-amber-500/15 border-amber-500/40 text-amber-900 font-bold animate-pulse'
                              : app.status === 'confirmed'
                              ? 'bg-sky-500/10 border-sky-500/30 text-sky-700'
                              : app.status === 'arrived'
                              ? 'bg-blue-500/10 border-blue-500/30 text-blue-700'
                              : app.status === 'in_consultation'
                              ? 'bg-purple-500/10 border-purple-500/30 text-purple-700 animate-pulse'
                              : app.status === 'completed'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {app.status === 'pending' ? (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Pending Approval
                            </span>
                          ) : app.status === 'arrived' ? (
                            <span className="inline-flex items-center gap-1">
                              <Armchair className="w-3 h-3" />
                              In Waiting Area
                            </span>
                          ) : app.status === 'in_consultation' ? (
                            <span className="inline-flex items-center gap-1">
                              <Stethoscope className="w-3 h-3" />
                              In Consultation
                            </span>
                          ) : app.status === 'completed' ? (
                            <span className="inline-flex items-center gap-1">
                              <BadgeCheck className="w-3 h-3" />
                              Completed
                            </span>
                          ) : (
                            app.status.replace('_', ' ')
                          )}
                        </span>

                        {currentRole === 'doctor' && (
                          <>
                            {app.status === 'arrived' && (
                              <button
                                onClick={() => handleStatusChange(app.id, 'in_consultation')}
                                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-display font-700 shadow-xs flex items-center gap-1.5"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Call In</span>
                              </button>
                            )}
                            {app.status === 'in_consultation' && (
                              <button
                                onClick={() => {
                                  setActiveNoteAppId(app.id)
                                  setClinicalNotes(app.doctorClinicalNotes || '')
                                }}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-display font-700 shadow-xs flex items-center gap-1.5"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Complete & Add Notes</span>
                              </button>
                            )}
                          </>
                        )}

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
          </>
        )}
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL 0: RECEPTIONIST DECLINE REQUEST WITH REASON                      */}
      {/* ---------------------------------------------------------------------- */}
      {declineModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-border/50 animate-fade-up">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <X className="w-6 h-6" />
            </div>
            <h3 className="font-display font-800 text-xl text-navy">Decline Appointment Request</h3>
            <p className="text-xs text-navy-700 mt-1">
              Select a reason for declining this request. This will be logged in clinic records.
            </p>

            <div className="mt-4 space-y-2.5">
              {[
                'Doctor in Emergency Hospital Surgery / OT',
                'Clinic slot capacity reached for this date',
                'Patient requested cancellation / reschedule via phone',
                'OPD closed due to medical conference / holiday',
              ].map((reason) => (
                <label
                  key={reason}
                  onClick={() => setDeclineReasonPreset(reason)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs font-medium transition-all ${
                    declineReasonPreset === reason
                      ? 'border-rose-500 bg-rose-50 text-rose-900 font-semibold'
                      : 'border-border/80 bg-white text-navy-700 hover:bg-soft-gray'
                  }`}
                >
                  <input
                    type="radio"
                    name="declineReason"
                    checked={declineReasonPreset === reason}
                    onChange={() => setDeclineReasonPreset(reason)}
                    className="accent-rose-600"
                  />
                  <span>{reason}</span>
                </label>
              ))}

              <div className="mt-2">
                <label className="text-[11px] font-semibold text-navy block mb-1">Or Other Custom Reason:</label>
                <textarea
                  rows={2}
                  value={declineCustomReason}
                  onChange={(e) => setDeclineCustomReason(e.target.value)}
                  placeholder="Enter specific instructions or reason..."
                  className="w-full border border-border/80 rounded-xl p-2.5 text-xs text-navy focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeclineModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-navy text-xs font-display font-600"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmDecline}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-display font-700 shadow-md transition-all"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

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
            <h3 className="font-display font-800 text-xl text-navy flex items-center gap-2">
              <Ban className="w-5 h-5 text-amber-600" />
              <span>Block Date for Surgeries / Leave</span>
            </h3>
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
            <h3 className="font-display font-800 text-xl text-navy flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-teal" />
              <span>Add Walk-in / Telephone Patient</span>
            </h3>
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-display font-700 text-navy block mb-1">Gender *</label>
                  <select
                    value={walkinForm.gender}
                    onChange={(e) => setWalkinForm({ ...walkinForm, gender: e.target.value })}
                    className="w-full border border-border/80 rounded-xl p-2.5 text-xs text-navy focus:outline-none focus:border-teal bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-display font-700 text-navy block mb-1">Assigned Slot *</label>
                  <select
                    value={walkinForm.timeSlot}
                    onChange={(e) => setWalkinForm({ ...walkinForm, timeSlot: e.target.value })}
                    className="w-full border border-border/80 rounded-xl p-2.5 text-xs text-navy focus:outline-none focus:border-teal bg-white"
                  >
                    {standardSlots.map((slot) => {
                      const isOccupied = clinicAppointments.some(
                        (a) => a.timeSlot === slot && a.status !== 'cancelled'
                      )
                      return (
                        <option key={slot} value={slot}>
                          {slot} {isOccupied ? '(Occupied - Overbook)' : '(Available)'}
                        </option>
                      )
                    })}
                    <option value="Emergency Fit-In (Now)">[EMERGENCY] Immediate Emergency / Fit-In</option>
                  </select>
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
            <div className="w-12 h-12 rounded-2xl bg-teal/10 text-teal flex items-center justify-center mx-auto mb-3">
              <Megaphone className="w-6 h-6" />
            </div>
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

    {/* =================================================================== */}
    {/* PRINT-ONLY CLEAN OPD PATIENT ROSTER (Visible during window.print)   */}
    {/* =================================================================== */}
    <div className="hidden print:block p-8 bg-white text-black min-h-screen font-sans">
      <div className="border-b-2 border-black pb-4 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wider text-black">
              Dr. Deep Chakraborty
            </h1>
            <p className="text-xs text-black/80 font-medium">
              MS (Ortho), DNB (Ortho), MNAMS · Consultant Orthopedic & Joint Replacement Surgeon
            </p>
            <p className="text-xs text-black/70 mt-1">
              <strong>{currentClinicObj.name}</strong> · {currentClinicObj.address} · Phone: {currentClinicObj.phone}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 border border-black rounded inline-block">
              Daily OPD Token Roster
            </span>
            <p className="text-sm font-bold text-black mt-2 font-mono">Date: {filterDate} ({selectedDayName})</p>
            <p className="text-xs text-black/70 font-medium">Total Scheduled: {stableDayAppointments.length}</p>
          </div>
        </div>
      </div>

      {stableDayAppointments.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-400 rounded-lg">
          <p className="text-sm italic text-gray-700">No scheduled patients on record for {filterDate}.</p>
        </div>
      ) : (
        <table className="w-full text-left text-[11px] border-collapse border border-black">
          <thead>
            <tr className="bg-gray-100 border-b border-black">
              <th className="p-2 border-r border-black font-bold w-12 text-center">Token</th>
              <th className="p-2 border-r border-black font-bold w-20">Time</th>
              <th className="p-2 border-r border-black font-bold">Patient Name</th>
              <th className="p-2 border-r border-black font-bold w-16 text-center">Age/Sex</th>
              <th className="p-2 border-r border-black font-bold w-28">Phone</th>
              <th className="p-2 border-r border-black font-bold">Chief Complaint</th>
              <th className="p-2 border-r border-black font-bold w-24">Status</th>
              <th className="p-2 font-bold w-40">Doctor Remarks / Rx</th>
            </tr>
          </thead>
          <tbody>
            {stableDayAppointments.map((app) => (
              <tr key={app.id} className="border-b border-black/30">
                <td className="p-2 border-r border-black/30 text-center font-bold font-mono">
                  #{stableTokenMap.get(app.id) ?? '-'}
                </td>
                <td className="p-2 border-r border-black/30 font-medium">{app.timeSlot}</td>
                <td className="p-2 border-r border-black/30 font-bold">
                  {app.patientName}
                  {app.firstVisit && <span className="text-[9px] font-normal italic ml-1">(New)</span>}
                </td>
                <td className="p-2 border-r border-black/30 text-center">
                  {app.patientAge}y / {app.patientGender?.[0] || 'M'}
                </td>
                <td className="p-2 border-r border-black/30 font-mono">{app.patientPhone}</td>
                <td className="p-2 border-r border-black/30">{app.condition}</td>
                <td className="p-2 border-r border-black/30 capitalize text-[10px]">
                  {app.status.replace('_', ' ')}
                </td>
                <td className="p-2 text-[10px] text-gray-700 italic">
                  {app.doctorClinicalNotes || '________________________'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-8 pt-4 border-t border-black/40 flex justify-between text-[11px] text-black/70">
        <span>Printed from Orthobud Practice Internal Portal · {new Date().toLocaleDateString()}</span>
        <span>Consultant Surgeon's Signature: ___________________________</span>
      </div>
    </div>
  </>
  )
}
