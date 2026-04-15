import { useState, type FormEvent } from 'react'
import { toApiErrorMessage } from '../../../shared/api/errorMapper'
import { QueryState, SectionShell } from '../../../shared/ui'
import { useChangePassword, useFacultyProfile, useUpdateProfile } from '../hooks'

export function FacultyProfilePage() {
  const profileQuery = useFacultyProfile()
  const updateProfileMutation = useUpdateProfile()
  const changePasswordMutation = useChangePassword()

  const [profileDraft, setProfileDraft] = useState<{
    first_name: string
    last_name: string
    contact_number: string
  } | null>(null)

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [profileMessage, setProfileMessage] = useState('')
  const [profileMessageIntent, setProfileMessageIntent] = useState<'success' | 'error'>('success')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordMessageIntent, setPasswordMessageIntent] = useState<'success' | 'error'>('success')

  const firstName = profileDraft?.first_name ?? profileQuery.data?.first_name ?? ''
  const lastName = profileDraft?.last_name ?? profileQuery.data?.last_name ?? ''
  const contactNumber = profileDraft?.contact_number ?? profileQuery.data?.contact_number ?? ''

  const setDraftValue = (field: 'first_name' | 'last_name' | 'contact_number', value: string) => {
    setProfileDraft((current) => ({
      first_name: current?.first_name ?? profileQuery.data?.first_name ?? '',
      last_name: current?.last_name ?? profileQuery.data?.last_name ?? '',
      contact_number: current?.contact_number ?? profileQuery.data?.contact_number ?? '',
      [field]: value,
    }))
  }

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setProfileMessage('')

    try {
      const result = await updateProfileMutation.mutateAsync({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        contact_number: contactNumber.trim() || null,
      })

      setProfileMessageIntent('success')
      setProfileMessage(result.message || 'Profile updated successfully.')
    } catch (error) {
      setProfileMessageIntent('error')
      setProfileMessage(toApiErrorMessage(error, 'Unable to update faculty profile.'))
    }
  }

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPasswordMessage('')

    if (newPassword !== confirmPassword) {
      setPasswordMessageIntent('error')
      setPasswordMessage('New password and confirm password must match.')
      return
    }

    if (newPassword.length < 8) {
      setPasswordMessageIntent('error')
      setPasswordMessage('New password must be at least 8 characters long.')
      return
    }

    try {
      await changePasswordMutation.mutateAsync({
        old_password: oldPassword,
        new_password: newPassword,
      })

      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordMessageIntent('success')
      setPasswordMessage('Password changed successfully.')
    } catch (error) {
      setPasswordMessageIntent('error')
      setPasswordMessage(toApiErrorMessage(error, 'Unable to change password.'))
    }
  }

  if (profileQuery.isPending) {
    return (
      <SectionShell title="My Profile" subtitle="Loading faculty profile.">
        <QueryState title="Loading profile" description="Fetching your profile details..." />
      </SectionShell>
    )
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <SectionShell title="My Profile" subtitle="Unable to load your profile details.">
        <QueryState
          tone="error"
          title="Unable to load profile"
          description={toApiErrorMessage(profileQuery.error, 'Please retry in a moment.')}
          actionLabel="Retry"
          onAction={() => void profileQuery.refetch()}
        />
      </SectionShell>
    )
  }

  return (
    <SectionShell
      title="My Profile"
      subtitle="Manage faculty profile fields and account password."
    >
      <section className="detail-section">
        <h4>Profile details</h4>
        <form className="detail-card-list" onSubmit={handleProfileSubmit}>
          <label className="admin-field" htmlFor="faculty-profile-email">
            <span>Email (read-only)</span>
            <input id="faculty-profile-email" value={profileQuery.data.email} readOnly disabled />
          </label>

          <div className="form-grid">
            <label className="admin-field" htmlFor="faculty-profile-first-name">
              <span>First name</span>
              <input
                id="faculty-profile-first-name"
                value={firstName}
                onChange={(event) => setDraftValue('first_name', event.target.value)}
                autoComplete="given-name"
              />
            </label>

            <label className="admin-field" htmlFor="faculty-profile-last-name">
              <span>Last name</span>
              <input
                id="faculty-profile-last-name"
                value={lastName}
                onChange={(event) => setDraftValue('last_name', event.target.value)}
                autoComplete="family-name"
              />
            </label>
          </div>

          <label className="admin-field" htmlFor="faculty-profile-contact-number">
            <span>Contact number</span>
            <input
              id="faculty-profile-contact-number"
              value={contactNumber}
              onChange={(event) => setDraftValue('contact_number', event.target.value)}
              autoComplete="tel"
            />
          </label>

          {profileMessage ? (
            <p className={profileMessageIntent === 'error' ? 'form-error' : 'query-state__description'}>
              {profileMessage}
            </p>
          ) : null}

          <button type="submit" className="button button--primary" disabled={updateProfileMutation.isPending}>
            {updateProfileMutation.isPending ? 'Saving...' : 'Save profile'}
          </button>
        </form>
      </section>

      <section className="detail-section">
        <h4>Change password</h4>
        <form className="detail-card-list" onSubmit={handlePasswordSubmit}>
          <label className="admin-field" htmlFor="faculty-profile-old-password">
            <span>Current password</span>
            <input
              id="faculty-profile-old-password"
              type="password"
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
              required
              autoComplete="current-password"
            />
          </label>

          <div className="form-grid">
            <label className="admin-field" htmlFor="faculty-profile-new-password">
              <span>New password</span>
              <input
                id="faculty-profile-new-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </label>

            <label className="admin-field" htmlFor="faculty-profile-confirm-password">
              <span>Confirm new password</span>
              <input
                id="faculty-profile-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </label>
          </div>

          {passwordMessage ? (
            <p className={passwordMessageIntent === 'error' ? 'form-error' : 'query-state__description'}>
              {passwordMessage}
            </p>
          ) : null}

          <button type="submit" className="button button--primary" disabled={changePasswordMutation.isPending}>
            {changePasswordMutation.isPending ? 'Updating...' : 'Change password'}
          </button>
        </form>
      </section>
    </SectionShell>
  )
}
