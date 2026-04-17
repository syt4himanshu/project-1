import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../app/providers/auth-context'
import { ROLE_LABELS } from '../../app/config/role-map'
import { toDashboardPath } from '../../shared/auth/roleGuards'
import { isUserRole } from '../../shared/auth/session'
import { toErrorMessage } from '../../shared/api/errorMapper'

function UserIcon() {
  return (
    <svg className="student-login__left-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg className="student-login__left-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m3 3 18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.3 5.2A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a17.4 17.4 0 0 1-3.2 4.2" />
      <path d="M6.2 6.2C3.8 8.1 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1" />
    </svg>
  )
}

function toPostLoginPath(role: 'admin' | 'faculty' | 'student', nextRaw: string | null): string {
  if (!nextRaw) return toDashboardPath(role)

  try {
    const decoded = decodeURIComponent(nextRaw)
    if (decoded.startsWith(`/${role}/`)) return decoded
  } catch {
    return toDashboardPath(role)
  }

  return toDashboardPath(role)
}

export function LoginPage() {
  const { status, session, login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  const requestedRole = useMemo(() => {
    const role = searchParams.get('role')
    return isUserRole(role) ? role : null
  }, [searchParams])

  const nextParam = searchParams.get('next')

  useEffect(() => {
    setIdentifier('')
    setPassword('')
    setError('')
    setInfo('')
    setShowPassword(false)
    setRememberMe(true)
  }, [requestedRole])

  if (status === 'bootstrapping') {
    return (
      <section className="card auth-card">
        <h1>Sign in</h1>
        <p className="subtext">Checking existing session...</p>
      </section>
    )
  }

  if (status === 'authenticated' && session) {
    return <Navigate to={toDashboardPath(session.user.role)} replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setInfo('')
    setIsSubmitting(true)

    try {
      const newSession = await login(identifier.trim(), password)

      if (requestedRole && requestedRole !== newSession.user.role) {
        setInfo(`Signed in as ${ROLE_LABELS[newSession.user.role]}. Redirecting to your dashboard.`)
      }

      const destination = toPostLoginPath(newSession.user.role, nextParam)
      navigate(destination, { replace: true })
    } catch (loginError: unknown) {
      setError(toErrorMessage(loginError, 'Invalid credentials'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (requestedRole) {
    return (
      <section className="student-login">
        <div className="student-login__card">
          <div className="student-login__hero">
            <div className="student-login__hero-top">
              <div className="student-login__brand">
                <div className="student-login__brand-icon">
                  <svg className="student-login__brand-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3 2 8l10 5 10-5-10-5Z" />
                    <path d="M4 11v5.5L12 21l8-4.5V11" />
                  </svg>
                </div>
                <div>
                  <p className="student-login__brand-title">KYS Portal</p>
                  <p className="student-login__brand-subtitle">KNOW YOUR STUDENT</p>
                </div>
              </div>
              <button type="button" aria-label="Theme button" className="student-login__theme-btn">
                <svg className="student-login__theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9Z" />
                </svg>
              </button>
            </div>

            <div className="student-login__hero-body">
              <p className="student-login__hero-caption">SECURE SIGN IN</p>
              <h1 className="student-login__hero-title">Welcome Back</h1>
              <p className="student-login__hero-text">Sign in to your account to continue</p>
            </div>
          </div>

          <div className="student-login__body">
            <form onSubmit={handleSubmit}>
              <div className="student-login__field-group">
                <label className="student-login__label">USERNAME <span className="student-login__required">*</span></label>
                <div className="student-login__input-wrap">
                  <UserIcon />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    required
                    placeholder="Enter your username"
                    autoComplete="username"
                    className="student-login__input student-login__input--with-left-icon"
                  />
                </div>
              </div>

              <div className="student-login__field-group">
                <label className="student-login__label">PASSWORD <span className="student-login__required">*</span></label>
                <div className="student-login__input-wrap">
                  <LockIcon />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="student-login__input student-login__input--with-icons"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="student-login__eye-btn"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className="student-login__divider" />

              <label className="student-login__remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                Remember me
              </label>

              {error ? <p className="student-login__error">{error}</p> : null}
              {info ? <p className="student-login__info">{info}</p> : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="student-login__submit"
              >
                {isSubmitting ? 'SIGNING IN...' : 'SIGN IN'}
              </button>
            </form>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="card auth-card">
      <h1>Sign in</h1>
      <p className="subtext">
        {requestedRole ? `Requested role: ${ROLE_LABELS[requestedRole]}` : 'Use your KYS credentials.'}
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Username / UID / Email
          <input
            type="text"
            autoComplete="username"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {error ? <p className="message message--error">{error}</p> : null}
        {info ? <p className="message message--info">{info}</p> : null}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="back-link">
        <Link to="/roles">Back to role selection</Link>
      </p>
    </section>
  )
}
