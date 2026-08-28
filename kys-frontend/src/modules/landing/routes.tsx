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
               <img src="/college-logo.jpg" alt="College logo" className="kys-landing__logo" />
             </div>
          </div>

          <p className="kys-landing__eyebrow">WELCOME TO</p>
          <h1 className="kys-landing__title">Know Your Student System</h1>
          <p className="kys-landing__description">
            Empowering Mentorship, Strengthening Student Success.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.8rem', alignItems: 'center' }}>
            <button type="button" className="kys-landing__cta" style={{ marginTop: 0 }} onClick={() => navigate('/roles')}>
              Get Started &rarr;
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/developers')}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(173, 198, 255, 0.2)',
                borderRadius: '12px',
                padding: '0.9rem 2rem',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#c6dbff',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            >
              Developer Team
            </button>
          </div>

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
        <p className="kys-landing__footer-text">© Know Your Student System</p>
      </div>
    </section>
  )
}

