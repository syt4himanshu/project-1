import { useNavigate } from 'react-router-dom'

export function DeveloperPage() {
  const navigate = useNavigate()

  const facultyMentors = [
    {
      name: 'Dr. Manoj Bramhe',
      designation: 'Professor & HoD, CSE',
      image: '/faculty-mentor-manoj.jpg',
    },
    {
      name: 'Dr. Kapil Gupta',
      designation: 'Associate Professor, CSE',
      image: '/faculty-mentor-kapil.jpeg',
    },
    {
      name: 'Ayaz Ahmed Khan',
      designation: 'Assistant Professor, CSE',
      image: '/faculty-mentor-ayaz.jpg',
      bgZoom: '72%',
      bgPosition: 'center 20%',
    },
    {
      name: 'Atharva Bhede',
      designation: 'Student Mentor',
      image: '/atharva-bhede.jpeg',
    },
  ]

  const developers = [
    {
      name: 'Himanshu Mire',
      role: 'Full-Stack Engineer | Backend & AI Systems',
      summaryLineOne: 'Led end-to-end platform development, architecting backend systems, AI workflows, and performance optimizations to deliver scalable, secure, and reliable production systems.',
      image: '/hm2.jpeg',
      linkedin: 'https://www.linkedin.com/in/himanshu-mire-816308288/',
    },
    {
      name: 'Yash Lute',
      role: 'Frontend & UI/UX Specialist',
      summaryLineOne: 'Designed polished UI interactions and improved overall usability across modules.',
      summaryLineTwo: 'Owned dashboard refinements, feature alignment, and cross-panel visual consistency.',
      image: '/yash-kys.jpg',
      bgZoom: '72%',
      bgPosition: 'center 15%',
      github: 'https://github.com/yashlute19',
      linkedin: 'https://linkedin.com/in/yashlute19/',
    },
    {
      name: 'Siddhant Lohakar',
      role: 'Frontend Developer',
      summaryLineOne: 'Contributed to frontend development and UI components.',
      image: '/Sidhant lohakar.jpeg',
      objectPosition: 'center 30%',
    },
    {
      name: 'Kaushik Sahu',
      role: 'Backend Developer and Deployment',
      summaryLineOne: 'Handled backend architecture and application deployment.',
      image: '/Koushik Shahu.jpeg',
      objectPosition: 'center 30%',
    },
  ]

  return (
    <section className="kys-landing kys-landing--developer">
      <div className="kys-landing__ambient kys-landing__ambient--left" />
      <div className="kys-landing__ambient kys-landing__ambient--right" />

      <div className="kys-landing__main">
        <div className="kys-developer">
          <button onClick={() => navigate(-1)} className="kys-landing__footer-btn kys-developer__back">
            &larr; Back
          </button>

          <div className="kys-landing__card kys-developer__card-shell">
            <p className="kys-landing__eyebrow">CONTRIBUTORS</p>
            <h1 className="kys-landing__title kys-developer__title">
              Developer Team
            </h1>

            <p className="kys-developer__section-title">Faculty Mentors</p>
            <div className="kys-developer__mentors-grid">
              {facultyMentors.map((mentor, idx) => (
                <article key={mentor.name} className="kys-developer__mentor-item" style={{ animationDelay: `${idx * 180}ms` }}>
                  <div className="kys-developer__mentor-avatar-wrap">
                    {mentor.bgZoom ? (
                      <div
                        className="kys-developer__mentor-avatar--bg"
                        role="img"
                        aria-label={`${mentor.name} profile`}
                        style={{
                          backgroundImage: `url(${mentor.image})`,
                          backgroundSize: mentor.bgZoom,
                          backgroundPosition: mentor.bgPosition ?? 'center center',
                        }}
                      />
                    ) : (
                      <img
                        className="kys-developer__mentor-avatar"
                        src={mentor.image}
                        alt={`${mentor.name} profile`}
                        onError={(event) => {
                          event.currentTarget.src = '/college-logo.png'
                        }}
                      />
                    )}
                  </div>
                  <h3 className="kys-developer__mentor-name">{mentor.name}</h3>
                  <p className="kys-developer__mentor-designation">{mentor.designation}</p>
                </article>
              ))}
            </div>

            <p className="kys-developer__section-title">Developers</p>
            <div className="kys-developer__developers-grid">
              {developers.map((dev, idx) => (
                <article key={dev.name} className="kys-developer__item" style={{ animationDelay: `${idx * 220}ms` }}>
                  <div className="kys-developer__avatar-wrap">
                    {dev.bgZoom ? (
                      <div
                        className="kys-developer__avatar--bg"
                        role="img"
                        aria-label={`${dev.name} profile`}
                        style={{
                          backgroundImage: `url(${dev.image})`,
                          backgroundSize: dev.bgZoom,
                          backgroundPosition: dev.bgPosition ?? 'center center',
                        }}
                      />
                    ) : (
                      <img
                        className="kys-developer__avatar"
                        src={dev.image}
                        alt={`${dev.name} profile`}
                        style={dev.objectPosition ? { objectPosition: dev.objectPosition } : undefined}
                      />
                    )}
                  </div>
                  <div className="kys-developer__content">
                    <h3>{dev.name}</h3>
                    <p className="kys-developer__role">{dev.role}</p>
                    <p className="kys-developer__summary">{dev.summaryLineOne}</p>
                    <p className="kys-developer__summary">{dev.summaryLineTwo}</p>
                    <div className="kys-developer__links">
                      {dev.github && <a href={dev.github} target="_blank" rel="noreferrer">GitHub</a>}
                      {dev.linkedin && <a href={dev.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
