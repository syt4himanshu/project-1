import { useState } from 'react'
import { Modal } from '../../../../shared/ui'
import type { AdminUserSummary, ResetPasswordInput } from '../../api'
import { useResetPasswordMutation } from '../../hooks'

interface ResetPasswordModalProps {
  open: boolean
  user: AdminUserSummary | null
  onClose: () => void
}

function isResettableRole(role: AdminUserSummary['role']): role is 'student' | 'faculty' {
  return role === 'student' || role === 'faculty'
}

export function ResetPasswordModal({ open, user, onClose }: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const resetPasswordMutation = useResetPasswordMutation()

  const resetFields = () => {
    setNewPassword('')
    setConfirmPassword('')
    setErrorMessage('')
  }

  const handleClose = () => {
    if (resetPasswordMutation.isPending) return
    resetFields()
    onClose()
  }

  const submit = async () => {
    if (!user || !isResettableRole(user.role)) {
      setErrorMessage('Password reset is supported only for student and faculty users.')
      return
    }

    if (newPassword.trim().length < 8) {
      setErrorMessage('Password must be at least 8 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Password confirmation does not match.')
      return
    }

    const payload: ResetPasswordInput = {
      role: user.role,
      username: user.username,
      new_password: newPassword,
    }

    setErrorMessage('')

    try {
      await resetPasswordMutation.mutateAsync(payload)
      handleClose()
    } catch {
      // Error is handled by toast.
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Reset Password"
      subtitle={user ? `User: ${user.username} (${user.role})` : 'Select a user to continue.'}
      size="sm"
      footer={(
        <>
          <button type="button" className="button button--ghost" onClick={handleClose} disabled={resetPasswordMutation.isPending}>
            Cancel
          </button>
          <button type="button" className="button button--primary" onClick={() => void submit()} disabled={resetPasswordMutation.isPending || !user}>
            {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
          </button>
        </>
      )}
    >
      <div className="form-grid form-grid--single">
        <label className="admin-field" htmlFor="new-password">
          <span>New Password</span>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </label>

        <label className="admin-field" htmlFor="confirm-password">
          <span>Confirm Password</span>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </label>
      </div>

      {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
    </Modal>
  )
}
