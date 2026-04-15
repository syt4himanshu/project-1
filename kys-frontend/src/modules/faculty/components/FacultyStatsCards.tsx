import { Link } from 'react-router-dom'

interface StatCard {
    label: string
    value: string | number
    sub: string
    to: string
}

interface FacultyStatsCardsProps {
    menteeCount: number | null
    isLoading: boolean
}

export function FacultyStatsCards({ menteeCount, isLoading }: FacultyStatsCardsProps) {
    const cards: StatCard[] = [
        {
            label: 'Assigned mentees',
            value: isLoading ? '…' : (menteeCount ?? '—'),
            sub: 'View all →',
            to: '/faculty/mentees',
        },
        {
            label: 'Faculty profile',
            value: 'Name & contact',
            sub: 'Edit profile →',
            to: '/faculty/profile',
        },
        {
            label: 'AI insights',
            value: 'Faculty Chatbot',
            sub: 'Open chatbot →',
            to: '/faculty/chatbot',
        },
    ]

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
                <Link
                    key={card.to}
                    to={card.to}
                    className="block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-600 transition"
                >
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.label}</p>
                    <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                        {card.value}
                    </p>
                    <p className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 font-medium">{card.sub}</p>
                </Link>
            ))}
        </div>
    )
}
