import { useState, useEffect, useMemo } from 'react'
import {
  Users,
  UserPlus,
  KeyRound,
  ShieldCheck,
  Stethoscope,
  ConciergeBell,
  CheckCircle2,
  Building2,
  Copy,
  Check,
  RefreshCw,
  Search,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  X,
  Lock,
  Mail,
  Calendar,
  Phone,
  Trash2,
  Ban,
  Filter,
  Eye,
  EyeOff,
  ChevronDown,
} from 'lucide-react'
import {
  staffAuthService,
  StaffUser,
  StaffRole,
  validatePasswordStrength,
} from '@/services/staffAuthService'
import { Clinic } from '@/services/appointmentService'

interface StaffManagementProps {
  clinics: Clinic[]
  onToast: (msg: string) => void
  currentAdminId?: string
}

export default function StaffManagement({
  clinics,
  onToast,
  currentAdminId,
}: StaffManagementProps) {
  const [staffList, setStaffList] = useState<StaffUser[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | StaffRole>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all')

  // Add User Modal State
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailCustomized, setEmailCustomized] = useState(false)
  const [addForm, setAddForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    role: 'receptionist' as StaffRole,
    clinicId: clinics[0]?.id || '',
    phone: '',
  })
  const [addError, setAddError] = useState<string | null>(null)

  // Success Credential Card Modal
  const [createdCredential, setCreatedCredential] = useState<{
    fullName: string
    username: string
    email: string
    password: string
    role: string
    clinicName?: string
  } | null>(null)
  const [copied, setCopied] = useState(false)

  // Reset Password Modal State
  const [resetModalOpen, setResetModalOpen] = useState(false)
  const [targetUser, setTargetUser] = useState<StaffUser | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [resetSubmitting, setResetSubmitting] = useState(false)
  const [resetError, setResetError] = useState<string | null>(null)

  // Delete Confirmation Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<StaffUser | null>(null)
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Toggle Status Confirmation Modal State
  const [toggleModalOpen, setToggleModalOpen] = useState(false)
  const [userToToggle, setUserToToggle] = useState<StaffUser | null>(null)
  const [toggleSubmitting, setToggleSubmitting] = useState(false)

  const loadStaff = async () => {
    setLoading(true)
    try {
      const list = await staffAuthService.getStaffUsers()
      setStaffList(list)
    } catch (err) {
      console.error('Failed to load staff list:', err)
      onToast('Failed to load staff directory.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStaff()
  }, [])

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$'
    const array = new Uint32Array(12)
    crypto.getRandomValues(array)
    return Array.from(array, (x) => chars[x % chars.length]).join('')
  }

  const handleOpenAddModal = () => {
    const defaultUsername = ''
    setAddForm({
      fullName: '',
      username: defaultUsername,
      email: '',
      password: generateRandomPassword(),
      role: 'receptionist',
      clinicId: clinics[0]?.id || '',
      phone: '',
    })
    setEmailCustomized(false)
    setShowPassword(false)
    setAddError(null)
    setAddModalOpen(true)
  }

  const handleUsernameChange = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setAddForm((prev) => ({
      ...prev,
      username: clean,
      email: emailCustomized ? prev.email : clean ? `${clean}@orthobud.internal` : '',
    }))
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddError(null)
    setSubmitting(true)

    try {
      const selectedClinic = clinics.find((c) => c.id === addForm.clinicId)
      const res = await staffAuthService.createStaffUser({
        username: addForm.username,
        password: addForm.password,
        fullName: addForm.fullName,
        email: addForm.email || undefined,
        role: addForm.role,
        clinicId: addForm.role === 'receptionist' ? addForm.clinicId : null,
        clinicName: addForm.role === 'receptionist' ? selectedClinic?.name : null,
        phone: addForm.phone,
      })

      if (!res.success || !res.user) {
        setAddError(res.error || 'Failed to create staff user.')
        return
      }

      setCreatedCredential({
        fullName: addForm.fullName,
        username: addForm.username,
        email: res.user.email,
        password: addForm.password,
        role: addForm.role,
        clinicName: addForm.role === 'receptionist' ? selectedClinic?.name : undefined,
      })

      setAddModalOpen(false)
      onToast(`Staff user @${addForm.username} created successfully.`)
      await loadStaff()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.'
      setAddError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenResetModal = (u: StaffUser) => {
    setTargetUser(u)
    setNewPassword(generateRandomPassword())
    setShowResetPassword(false)
    setResetError(null)
    setResetModalOpen(true)
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetUser) return
    setResetError(null)
    setResetSubmitting(true)

    try {
      const res = await staffAuthService.resetStaffPassword(targetUser.id, newPassword)
      if (!res.success) {
        setResetError(res.error || 'Failed to reset password.')
        return
      }

      setResetModalOpen(false)
      onToast(`Password for @${targetUser.username} updated successfully.`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error resetting password.'
      setResetError(msg)
    } finally {
      setResetSubmitting(false)
    }
  }

  const handleOpenToggleModal = (u: StaffUser) => {
    setUserToToggle(u)
    setToggleModalOpen(true)
  }

  const handleToggleConfirm = async () => {
    if (!userToToggle) return
    setToggleSubmitting(true)

    try {
      const nextStatus = !userToToggle.isActive
      const res = await staffAuthService.toggleStaffStatus(userToToggle.id, nextStatus)
      if (!res.success) {
        onToast(res.error || 'Failed to update account status.')
        return
      }

      onToast(
        `Account @${userToToggle.username} is now ${nextStatus ? 'Active' : 'Suspended'}.`
      )
      setToggleModalOpen(false)
      await loadStaff()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update status.'
      onToast(msg)
    } finally {
      setToggleSubmitting(false)
    }
  }

  const handleOpenDeleteModal = (u: StaffUser) => {
    setUserToDelete(u)
    setDeleteError(null)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return
    setDeleteSubmitting(true)
    setDeleteError(null)

    try {
      const res = await staffAuthService.deleteStaffUser(userToDelete.id)
      if (!res.success) {
        setDeleteError(res.error || 'Failed to delete user account.')
        return
      }

      onToast(`Account @${userToDelete.username} deleted permanently.`)
      setDeleteModalOpen(false)
      await loadStaff()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete user.'
      setDeleteError(msg)
    } finally {
      setDeleteSubmitting(false)
    }
  }

  const handleCopyCredentials = () => {
    if (!createdCredential) return
    const text = [
      `Orthobud Staff Credentials`,
      `Name: ${createdCredential.fullName}`,
      `Username: ${createdCredential.username}`,
      `Email: ${createdCredential.email}`,
      `Password: ${createdCredential.password}`,
      `Role: ${createdCredential.role.toUpperCase()}`,
      createdCredential.clinicName ? `Assigned Branch: ${createdCredential.clinicName}` : '',
      `Sign-in URL: ${window.location.origin}/admin`,
    ]
      .filter(Boolean)
      .join('\n')

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
    onToast('Credentials copied to clipboard.')
  }

  // Filtered staff list
  const filteredStaff = useMemo(() => {
    return staffList.filter((user) => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.phone && user.phone.includes(searchQuery))

      const matchesRole = roleFilter === 'all' || user.role === roleFilter

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && user.isActive) ||
        (statusFilter === 'suspended' && !user.isActive)

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [staffList, searchQuery, roleFilter, statusFilter])

  // Count stats
  const stats = useMemo(() => {
    const total = staffList.length
    const doctors = staffList.filter((u) => u.role === 'doctor' && u.isActive).length
    const receptionists = staffList.filter((u) => u.role === 'receptionist' && u.isActive).length
    const admins = staffList.filter((u) => u.role === 'admin' && u.isActive).length
    const suspended = staffList.filter((u) => !u.isActive).length
    return { total, doctors, receptionists, admins, suspended }
  }, [staffList])

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A'
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Header & Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-border/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-navy-700">Total Staff</span>
            <div className="w-8 h-8 rounded-xl bg-navy/5 text-navy flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-display font-800 text-navy mt-2">{stats.total}</div>
          <span className="text-[11px] text-navy-700">All registered accounts</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-border/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-navy-700">Doctors</span>
            <div className="w-8 h-8 rounded-xl bg-teal/10 text-teal flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-display font-800 text-navy mt-2">{stats.doctors}</div>
          <span className="text-[11px] text-teal font-medium">Active surgeons</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-border/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-navy-700">Receptionists</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <ConciergeBell className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-display font-800 text-navy mt-2">{stats.receptionists}</div>
          <span className="text-[11px] text-sky-600 font-medium">Branch coordinators</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-border/60 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-navy-700">Administrators</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-display font-800 text-navy mt-2">{stats.admins}</div>
          <span className="text-[11px] text-purple-600 font-medium">System access</span>
        </div>
      </div>

      {/* 2. Action Bar: Search, Filters, Primary CTA */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-border/60 shadow-xs space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-4">
        {/* Left: Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-navy-700/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, username, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-border/70 rounded-xl text-navy placeholder:text-navy-700/50 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-navy-700/50 hover:text-navy cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Center & Right: Role filter, Status filter, Refresh, Primary CTA */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-border/70 text-xs">
            <Filter className="w-3.5 h-3.5 text-navy-700/70 shrink-0" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              aria-label="Filter staff by assigned role"
              className="bg-transparent text-navy font-medium text-xs focus:outline-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="doctor">Doctors</option>
              <option value="receptionist">Receptionists</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-border/70 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              aria-label="Filter staff by account status"
              className="bg-transparent text-navy font-medium text-xs focus:outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended Only</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={loadStaff}
            disabled={loading}
            className="p-2 text-navy-700 hover:text-navy hover:bg-slate-100 rounded-xl border border-border/70 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Primary Action Button */}
          <button
            onClick={handleOpenAddModal}
            className="btn-primary text-xs py-2 px-4 shadow-sm flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4 shrink-0" />
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* 3. Staff Accounts Data Table */}
      <div className="bg-white rounded-2xl border border-border/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-border/70 text-[11px] font-display font-700 text-navy-700 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Username</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Creation Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-navy-700/60">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-teal mb-2" />
                    <span>Loading staff directory...</span>
                  </td>
                </tr>
              ) : filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-navy-700/60">
                    <Users className="w-8 h-8 mx-auto text-navy-700/30 mb-2" />
                    <p className="font-medium text-navy text-sm">No staff accounts found</p>
                    <p className="text-xs text-navy-700/60 mt-0.5">
                      {searchQuery
                        ? 'Try adjusting your search query or role filter.'
                        : 'Click "Add Staff Member" above to create an account.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((user) => {
                  const isCurrentAdmin = Boolean(currentAdminId && user.id === currentAdminId)

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Column 1: Username & Full Name */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal/20 to-navy/10 text-teal font-bold font-display flex items-center justify-center text-xs shrink-0 border border-teal/20">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-display font-700 text-navy truncate flex items-center gap-1.5">
                              <span>{user.fullName}</span>
                              {isCurrentAdmin && (
                                <span className="text-[9px] bg-navy/10 text-navy px-1.5 py-0.2 rounded-md font-mono">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-navy-700/70 font-mono truncate">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Email */}
                      <td className="py-3.5 px-4 text-navy-700">
                        <div className="flex items-center gap-1.5 text-xs truncate max-w-[220px]">
                          <Mail className="w-3.5 h-3.5 text-navy-700/50 shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1.5 text-[11px] text-navy-700/50 mt-0.5">
                            <Phone className="w-3 h-3 text-navy-700/40 shrink-0" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Column 3: Assigned Role */}
                      <td className="py-3.5 px-4">
                        {user.role === 'admin' ? (
                          <div>
                            <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 font-display font-700 text-[11px] px-2.5 py-1 rounded-full border border-purple-200">
                              <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              <span>Administrator</span>
                            </span>
                            <div className="text-[10px] text-navy-700/50 mt-0.5 pl-1">
                              Universal System Access
                            </div>
                          </div>
                        ) : user.role === 'doctor' ? (
                          <div>
                            <span className="inline-flex items-center gap-1.5 bg-teal/10 text-teal font-display font-700 text-[11px] px-2.5 py-1 rounded-full border border-teal/20">
                              <Stethoscope className="w-3.5 h-3.5 text-teal shrink-0" />
                              <span>Doctor</span>
                            </span>
                            <div className="text-[10px] text-navy-700/50 mt-0.5 pl-1">
                              Consultant / Surgeon
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 font-display font-700 text-[11px] px-2.5 py-1 rounded-full border border-sky-200">
                              <ConciergeBell className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              <span>Receptionist</span>
                            </span>
                            <div className="text-[10px] text-navy-700/60 mt-0.5 flex items-center gap-1 pl-1">
                              <Building2 className="w-3 h-3 text-navy-700/40 shrink-0" />
                              <span>{user.assignedClinicName || 'Branch unassigned'}</span>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Column 4: Account Status */}
                      <td className="py-3.5 px-4">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-display font-600 text-[11px] px-2.5 py-1 rounded-full border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 font-display font-600 text-[11px] px-2.5 py-1 rounded-full border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>Suspended</span>
                          </span>
                        )}
                      </td>

                      {/* Column 5: Creation Date */}
                      <td className="py-3.5 px-4 text-navy-700">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-navy-700/50 shrink-0" />
                          <span>{formatDate(user.createdAt)}</span>
                        </div>
                      </td>

                      {/* Column 6: Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Reset Password */}
                          <button
                            onClick={() => handleOpenResetModal(user)}
                            className="p-1.5 text-navy-700 hover:text-teal hover:bg-teal/10 rounded-lg transition-colors cursor-pointer"
                            title="Reset password"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          {/* Suspend / Activate Toggle */}
                          <button
                            onClick={() => handleOpenToggleModal(user)}
                            disabled={isCurrentAdmin}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              user.isActive
                                ? 'text-amber-700 hover:text-amber-800 hover:bg-amber-100/60'
                                : 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100/60'
                            } disabled:opacity-30 disabled:cursor-not-allowed`}
                            title={
                              isCurrentAdmin
                                ? 'Cannot suspend your own account'
                                : user.isActive
                                ? 'Suspend account'
                                : 'Activate account'
                            }
                          >
                            {user.isActive ? (
                              <Ban className="w-3.5 h-3.5" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Delete Account */}
                          <button
                            onClick={() => handleOpenDeleteModal(user)}
                            disabled={isCurrentAdmin}
                            className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            title={
                              isCurrentAdmin
                                ? 'Cannot delete your own account'
                                : 'Permanently delete account'
                            }
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MODAL: Add Staff Member */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-border/80 space-y-5 animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal/10 text-teal flex items-center justify-center shrink-0">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-800 text-lg text-navy">Add Staff Member</h3>
                  <p className="text-xs text-navy-700 mt-0.5">
                    Create new user credentials with role-based access.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-navy-700/50 hover:text-navy p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {addError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-display font-700 text-navy mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Deep Chakraborty or Priya Sharma"
                  value={addForm.fullName}
                  onChange={(e) =>
                    setAddForm((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-border rounded-xl text-navy placeholder:text-navy-700/40 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-display font-700 text-navy mb-1">
                  Username <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700/50 font-mono text-xs">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    minLength={3}
                    placeholder="drdeep or reception_saltlake"
                    value={addForm.username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 text-xs bg-slate-50 border border-border rounded-xl font-mono text-navy placeholder:text-navy-700/40 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                  />
                </div>
                <p className="text-[10px] text-navy-700/60 mt-1">
                  Lowercase letters, digits, and underscores only.
                </p>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-display font-700 text-navy mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-navy-700/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="staff@orthobud.internal"
                    value={addForm.email}
                    onChange={(e) => {
                      setEmailCustomized(true)
                      setAddForm((prev) => ({ ...prev, email: e.target.value }))
                    }}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-border rounded-xl text-navy placeholder:text-navy-700/40 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                  />
                </div>
                <p className="text-[10px] text-navy-700/60 mt-1">
                  Used for system notifications and login identifier.
                </p>
              </div>

              {/* Password & Generator */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-display font-700 text-navy">
                    Initial Password <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const pw = generateRandomPassword()
                      setAddForm((prev) => ({ ...prev, password: pw }))
                    }}
                    className="text-[11px] text-teal hover:underline flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Strong Password</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={addForm.password}
                    onChange={(e) =>
                      setAddForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    className="w-full pl-3.5 pr-9 py-2.5 text-xs bg-slate-50 border border-border rounded-xl font-mono text-navy focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-700/50 hover:text-navy cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                {/* Password strength rules */}
                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-navy-700/70">
                  <span
                    className={
                      addForm.password.length >= 8 ? 'text-emerald-600 font-semibold' : ''
                    }
                  >
                    • 8+ chars
                  </span>
                  <span
                    className={
                      /[A-Z]/.test(addForm.password) ? 'text-emerald-600 font-semibold' : ''
                    }
                  >
                    • Uppercase
                  </span>
                  <span
                    className={
                      /[a-z]/.test(addForm.password) ? 'text-emerald-600 font-semibold' : ''
                    }
                  >
                    • Lowercase
                  </span>
                  <span
                    className={
                      /[0-9]/.test(addForm.password) ? 'text-emerald-600 font-semibold' : ''
                    }
                  >
                    • Number
                  </span>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-display font-700 text-navy mb-1.5">
                  Assigned Role <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAddForm((prev) => ({ ...prev, role: 'doctor' }))}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      addForm.role === 'doctor'
                        ? 'border-teal bg-teal/5 ring-2 ring-teal/20 text-navy'
                        : 'border-border/70 hover:bg-slate-50 text-navy-700'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4 text-teal mb-1" />
                    <div className="font-display font-700 text-xs">Doctor</div>
                    <div className="text-[10px] text-navy-700/60 leading-tight mt-0.5">
                      Consultant & OT
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddForm((prev) => ({ ...prev, role: 'receptionist' }))}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      addForm.role === 'receptionist'
                        ? 'border-teal bg-teal/5 ring-2 ring-teal/20 text-navy'
                        : 'border-border/70 hover:bg-slate-50 text-navy-700'
                    }`}
                  >
                    <ConciergeBell className="w-4 h-4 text-sky-600 mb-1" />
                    <div className="font-display font-700 text-xs">Receptionist</div>
                    <div className="text-[10px] text-navy-700/60 leading-tight mt-0.5">
                      Branch Desk
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddForm((prev) => ({ ...prev, role: 'admin' }))}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      addForm.role === 'admin'
                        ? 'border-teal bg-teal/5 ring-2 ring-teal/20 text-navy'
                        : 'border-border/70 hover:bg-slate-50 text-navy-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600 mb-1" />
                    <div className="font-display font-700 text-xs">Admin</div>
                    <div className="text-[10px] text-navy-700/60 leading-tight mt-0.5">
                      Full System
                    </div>
                  </button>
                </div>
              </div>

              {/* Clinic Branch (Required for Receptionist, optional for others) */}
              {addForm.role === 'receptionist' && (
                <div>
                  <label className="block text-xs font-display font-700 text-navy mb-1">
                    Assigned Clinic Branch <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={addForm.clinicId}
                    onChange={(e) =>
                      setAddForm((prev) => ({ ...prev, clinicId: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-border rounded-xl text-navy focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all cursor-pointer"
                  >
                    {clinics.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.address.split(',')[0]})
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-navy-700/60 mt-1">
                    Receptionists only have access to appointments for their assigned branch.
                  </p>
                </div>
              )}

              {/* Phone (Optional) */}
              <div>
                <label className="block text-xs font-display font-700 text-navy mb-1">
                  Contact Phone (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+91 79801 44046"
                  value={addForm.phone}
                  onChange={(e) => setAddForm((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-border rounded-xl text-navy placeholder:text-navy-700/40 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-display font-600 text-navy-700 hover:text-navy hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-xs py-2.5 px-5 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Creating User...' : 'Create Staff Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: Success Credential Card */}
      {createdCredential && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-border/80 space-y-5 animate-scale-in text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-display font-800 text-lg text-navy">Account Created!</h3>
              <p className="text-xs text-navy-700 mt-1">
                Copy and securely share these credentials with the staff member.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-border text-left font-mono text-xs space-y-2 select-all">
              <div className="flex justify-between">
                <span className="text-navy-700/60 font-sans">Full Name:</span>
                <span className="text-navy font-semibold font-sans">{createdCredential.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-700/60 font-sans">Username:</span>
                <span className="text-navy font-bold">@{createdCredential.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-700/60 font-sans">Email:</span>
                <span className="text-navy">{createdCredential.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-700/60 font-sans">Password:</span>
                <span className="text-teal font-bold">{createdCredential.password}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-700/60 font-sans">Role:</span>
                <span className="text-navy font-sans capitalize">{createdCredential.role}</span>
              </div>
              {createdCredential.clinicName && (
                <div className="flex justify-between">
                  <span className="text-navy-700/60 font-sans">Branch:</span>
                  <span className="text-navy font-sans">{createdCredential.clinicName}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyCredentials}
                className="btn-primary flex-1 text-xs py-2.5 justify-center flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Credentials'}</span>
              </button>
              <button
                onClick={() => setCreatedCredential(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-display font-600 text-navy-700 hover:text-navy hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: Reset Password */}
      {resetModalOpen && targetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-border/80 space-y-5 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal/10 text-teal flex items-center justify-center shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-800 text-base text-navy">Reset Password</h3>
                  <p className="text-xs text-navy-700 mt-0.5">
                    Update password for @{targetUser.username}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setResetModalOpen(false)}
                className="text-navy-700/50 hover:text-navy p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{resetError}</span>
              </div>
            )}

            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-display font-700 text-navy">
                    New Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewPassword(generateRandomPassword())}
                    className="text-[11px] text-teal hover:underline flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showResetPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-3.5 pr-9 py-2.5 text-xs bg-slate-50 border border-border rounded-xl font-mono text-navy focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-700/50 hover:text-navy cursor-pointer"
                  >
                    {showResetPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setResetModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-display font-600 text-navy-700 hover:text-navy hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetSubmitting}
                  className="btn-primary text-xs py-2 px-4 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {resetSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL: Toggle Account Status */}
      {toggleModalOpen && userToToggle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-border/80 space-y-4 animate-scale-in text-center">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${
                userToToggle.isActive
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              {userToToggle.isActive ? (
                <Ban className="w-6 h-6" />
              ) : (
                <CheckCircle2 className="w-6 h-6" />
              )}
            </div>

            <div>
              <h3 className="font-display font-800 text-base text-navy">
                {userToToggle.isActive ? 'Suspend Staff Account?' : 'Activate Staff Account?'}
              </h3>
              <p className="text-xs text-navy-700/70 mt-1">
                {userToToggle.isActive
                  ? `Suspending @${userToToggle.username} will temporarily revoke their login privileges across all clinics.`
                  : `Activating @${userToToggle.username} will restore their login access.`}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setToggleModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-display font-600 text-navy-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={toggleSubmitting}
                onClick={handleToggleConfirm}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-display font-700 text-white transition-all cursor-pointer ${
                  userToToggle.isActive
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                } disabled:opacity-50`}
              >
                {toggleSubmitting
                  ? 'Updating...'
                  : userToToggle.isActive
                  ? 'Suspend'
                  : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL: Delete Account Confirmation */}
      {deleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-border/80 space-y-4 animate-scale-in text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-display font-800 text-lg text-navy">Delete Staff Account</h3>
              <p className="text-xs text-navy-700/80 mt-1.5 leading-relaxed">
                Are you sure you want to permanently delete the account for{' '}
                <span className="font-bold text-navy">@{userToDelete.username}</span> (
                {userToDelete.fullName})?
              </p>
            </div>

            <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-3.5 text-left text-xs text-rose-800 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span className="text-[11px] leading-relaxed">
                This action is irreversible. The user will be immediately removed from authentication and profile registries.
              </span>
            </div>

            {deleteError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs text-left flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-display font-600 text-navy-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteSubmitting}
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-display font-700 bg-rose-600 hover:bg-rose-700 text-white transition-all cursor-pointer disabled:opacity-50"
              >
                {deleteSubmitting ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
