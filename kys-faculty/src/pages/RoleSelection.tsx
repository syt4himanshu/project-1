type RoleCard = {
    letter: string
    title: string
    description: string
    accentClass: string
    href: string
}

const GATEWAY_PORT = '3005'
const DEV_PORTS = { admin: 5176, student: 5173, faculty: 5174 } as const

const buildAppUrl = (port: number, path: string) => {
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:'
    const hostname = window.location.hostname || 'localhost'
    return `${protocol}//${hostname}:${port}${path}`
}

function roleLinks() {
    const onGateway = window.location.port === GATEWAY_PORT
    return {
        admin: onGateway ? '/admin/login' : buildAppUrl(DEV_PORTS.admin, '/admin/login'),
        student: onGateway ? '/student/login' : buildAppUrl(DEV_PORTS.student, '/student/login'),
        faculty: onGateway ? '/faculty/login' : buildAppUrl(DEV_PORTS.faculty, '/faculty/login'),
    }
}

export default function RoleSelection() {
    const { admin: adminLoginHref, student: studentLoginHref, faculty: facultyLoginHref } = roleLinks()
    const cards: RoleCard[] = [
        {
            letter: 'A',
            title: 'Administrator',
            description: 'Comprehensive system management with full access to user administration and analytics.',
            accentClass: 'bg-red-500',
            href: adminLoginHref,
        },
        {
            letter: 'S',
            title: 'Student',
            description: 'Streamline your academic journey with profile forms, mentoring, and progress tracking.',
            accentClass: 'bg-emerald-500',
            href: studentLoginHref,
        },
        {
            letter: 'T',
            title: 'Teacher',
            description: 'Manage classes, review student performance, and guide learners with structured mentoring.',
            accentClass: 'bg-violet-500',
            href: `${import.meta.env.BASE_URL}login`,
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#111a33] to-[#0d1630] text-slate-100">
            <header className="border-b border-slate-700/50">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="rounded-full border border-slate-600/80 px-4 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-400 hover:text-white"
                    >
                        {'<- Back'}
                    </button>
                    <h1 className="text-3xl font-bold tracking-tight">Choose Your Role</h1>
                    <div className="w-[76px]" />
                </div>
            </header>

            <main className="mx-auto flex min-h-[72vh] max-w-6xl items-center justify-center px-6 py-12">
                <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
                    {cards.map((card) => (
                        <a
                            key={card.title}
                            href={card.href}
                            className="group rounded-2xl border border-slate-700/60 bg-slate-800/50 px-7 py-10 shadow-lg transition hover:-translate-y-1 hover:border-slate-500 hover:bg-slate-800/70"
                        >
                            <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white ${card.accentClass}`}>
                                {card.letter}
                            </div>
                            <h2 className="mb-3 text-2xl font-semibold text-white">{card.title}</h2>
                            <p className="text-sm leading-6 text-slate-300">{card.description}</p>
                        </a>
                    ))}
                </div>
            </main>
        </div>
    )
}
