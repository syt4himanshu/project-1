import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../app/providers/auth-context'
import { ROLE_LABELS } from '../../app/config/role-map'
import { toDashboardPath } from '../../shared/auth/roleGuards'
import { isUserRole } from '../../shared/auth/session'
import { toErrorMessage } from '../../shared/api/errorMapper'

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

  const requestedRole = useMemo(() => {
    const role = searchParams.get('role')
    return isUserRole(role) ? role : null
  }, [searchParams])

  const nextParam = searchParams.get('next')

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
        <Link to="/">Back to role selection</Link>
      </p>
    </section>
  )
}
