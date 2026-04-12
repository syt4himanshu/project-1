import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMentees } from '../api/faculty'
import { extractData } from '../utils/apiHandler'

interface MenteeRow {
    id: number
    uid: string
    full_name: string
    semester: number
    section?: string
    year_of_admission?: number
}

export default function Mentees() {
    const [rows, setRows] = useState<MenteeRow[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        getMentees()
            .then((res) => {
                console.log("API Response:", res.data);
                if (res.data && res.data.success === false) {
                    setError(res.data.error || 'Failed to load mentees');
                    setRows([]);
                    return;
                }
                setRows((extractData(res) || []) as MenteeRow[]);
            })
            .catch(() => setError('Failed to load mentees'))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="max-w-5xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Mentees</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Students assigned to you as mentor</p>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {loading ? (
                <p className="text-gray-500 dark:text-gray-400">Loading…</p>
            ) : rows.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center text-gray-500 dark:text-gray-400">
                    No mentees assigned yet. Assignments are managed by the administrator.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-left">
                                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">UID</th>
                                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Semester</th>
                                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Section</th>
                                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Year</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {(Array.isArray(rows) ? rows : []).map((r) => (
                                <tr key={r.id} className="border-b border-gray-100 dark:border-gray-700/80 hover:bg-gray-50 dark:hover:bg-gray-900/30">
                                    <td className="px-4 py-3 font-mono text-gray-900 dark:text-white">{r.uid}</td>
                                    <td className="px-4 py-3 text-gray-900 dark:text-white">{r.full_name}</td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{r.semester}</td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{r.section ?? '—'}</td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{r.year_of_admission ?? '—'}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            to={`/mentees/${encodeURIComponent(r.uid)}`}
                                            className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
