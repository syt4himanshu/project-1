import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMentees } from '../api/faculty'

export default function Dashboard() {
    const [count, setCount] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        getMentees()
            .then((res) => setCount(Array.isArray(res.data) ? res.data.length : 0))
            .catch(() => setError('Could not load mentee list'))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Overview of your mentoring assignments</p>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="grid gap-4 sm:grid-cols-2">
                <Link
                    to="/mentees"
                    className="block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-600 transition"
                >
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned mentees</p>
                    <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                        {loading ? '…' : count ?? '—'}
                    </p>
                    <p className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 font-medium">View all →</p>
                </Link>

                <Link
                    to="/profile"
                    className="block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-600 transition"
                >
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Faculty profile</p>
                    <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">Name & contact</p>
                    <p className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 font-medium">Edit profile →</p>
                </Link>
            </div>

            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 p-4 text-sm text-indigo-900 dark:text-indigo-200">
                Open a mentee from <strong>My Mentees</strong> to view their KYS form data and add mentoring minutes.
            </div>
        </div>
    )
}
