import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/providers/auth-context'
import { toDashboardPath } from '../../shared/auth/roleGuards'

export function LandingPage() {
  const navigate = useNavigate()
  const { status, session } = useAuth()

  if (status === 'bootstrapping') {
    return (
      <section className="kys-landing">
        <div className="kys-landing__card">
          <p className="kys-landing__eyebrow">WELCOME TO</p>
          <h1 className="kys-landing__title">Know Your Student System</h1>
          <p className="kys-landing__description">Checking existing session...</p>
        </div>
      </section>
    )
  }

  if (status === 'authenticated' && session) {
    return <Navigate to={toDashboardPath(session.user.role)} replace />
  }

  return (
    <section className="kys-landing">
      <div className="kys-landing__main">
        <div className="kys-landing__ambient kys-landing__ambient--left" />
        <div className="kys-landing__ambient kys-landing__ambient--right" />
        <div className="kys-landing__card">
          <div className="kys-landing__logo-wrap">
             <div className="kys-landing__logo-ring">
               <img src="/college-logo.png" alt="College logo" className="kys-landing__logo" />
             </div>
          </div>

          <p className="kys-landing__eyebrow">WELCOME TO</p>
          <h1 className="kys-landing__title">Know Your Student System</h1>
          <p className="kys-landing__description">
            Streamline student monitoring, enhance class organization, and manage students and faculty with a unified portal.
          </p>

          <button type="button" className="kys-landing__cta" onClick={() => navigate('/roles')}>
            Get Started
          </button>

          <div className="kys-landing__stats">
            <div className="kys-landing__stat">
              <span className="kys-landing__stat-value">400+</span>
              <span className="kys-landing__stat-label">Students</span>
            </div>
            <div className="kys-landing__stat kys-landing__stat--middle">
              <span className="kys-landing__stat-value">20+</span>
              <span className="kys-landing__stat-label">Faculty</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="kys-landing__footer">
        <button className="kys-landing__footer-btn" onClick={() => navigate('/developers')}>
          Developer Team
        </button>
        <p className="kys-landing__footer-text">© Know Your Student System</p>
      </div>
    </section>
  )
}

