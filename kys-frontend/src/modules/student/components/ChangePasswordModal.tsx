import { useState } from 'react'
import type { FormEvent } from 'react'
import { changePassword } from '../api/auth'

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m3 3 18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.3 5.2A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a17.4 17.4 0 0 1-3.2 4.2" />
      <path d="M6.2 6.2C3.8 8.1 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1" />
    </svg>
  )
}

function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
  show,
  onToggle,
  autoFocus = false,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  show: boolean
  onToggle: () => void
  autoFocus?: boolean
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#4f5f78]">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          required
          autoFocus={autoFocus}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-[#cfd7e4] bg-white px-4 py-3 pr-12 text-base text-[#26364d] placeholder:text-[#97a4b8] outline-none transition focus:border-[#2b4e86] focus:ring-2 focus:ring-[#2b4e86]/20"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7b8ca6] transition hover:text-[#2a3f62]"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  )
}

export default function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [old_password, setOld] = useState('')
  const [new_password, setNew] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (new_password !== confirm) {
      setError('New password and confirm password must match.')
      return
    }

    if (new_password.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      await changePassword(old_password, new_password)
      setSuccess('Password changed successfully.')
      setTimeout(onClose, 1000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      setError(msg || 'Failed to change password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6">
      <div className="w-full max-w-xl rounded-[26px] border border-[#d3dbea] bg-[#f7f9fc] p-6 shadow-[0_28px_60px_-25px_rgba(17,28,48,0.55)] sm:p-7">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="font-serif text-4xl font-semibold text-[#1f304d]">Change Password</h2>
            <p className="mt-1 text-lg text-[#73829a]">Choose a strong, unique password</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#cfd7e4] text-[#7b8ca6] transition hover:bg-white"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 6 12 12" />
              <path d="m18 6-12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordInput
            label="Current Password"
            placeholder="Enter current password"
            value={old_password}
            onChange={setOld}
            show={showOld}
            onToggle={() => setShowOld(v => !v)}
            autoFocus
          />

          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            value={new_password}
            onChange={setNew}
            show={showNew}
            onToggle={() => setShowNew(v => !v)}
          />

          <div className="h-px bg-[#dbe4f2]" />

          <PasswordInput
            label="Confirm New Password"
            placeholder="Repeat new password"
            value={confirm}
            onChange={setConfirm}
            show={showConfirm}
            onToggle={() => setShowConfirm(v => !v)}
          />

          {error && <p className="text-sm font-medium text-[#b42318]">{error}</p>}
          {success && <p className="text-sm font-medium text-[#067647]">{success}</p>}

          <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#cdd7e7] bg-[#f4f6fa] px-5 py-3 text-lg font-semibold text-[#697a93] transition hover:bg-[#edf1f7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#1f3c6e] px-5 py-3 text-lg font-semibold text-white shadow-[0_14px_26px_-14px_rgba(28,56,99,0.9)] transition hover:bg-[#173158] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
