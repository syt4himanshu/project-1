import { Link } from 'react-router-dom'
import type { MenteeRow } from '../api/types'

interface MenteesTableProps {
    rows: MenteeRow[]
    isLoading: boolean
    /** current page offset */
    offset: number
    limit: number
    isLastPage: boolean
    onPrev: () => void
    onNext: () => void
}

function SkeletonRow() {
    return (
        <tr>
            {Array.from({ length: 6 }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <div className="h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </td>
            ))}
        </tr>
    )
}

export function MenteesTable({
    rows,
    isLoading,
    offset,
    limit,
    isLastPage,
    onPrev,
    onNext,
}: MenteesTableProps) {
    const page = Math.floor(offset / limit) + 1
    const hasPrev = offset > 0

    return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
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
                        {isLoading
                            ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                            : rows.length === 0
                                ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-10 text-center text-gray-500 dark:text-gray-400">
                                            No mentees assigned yet. Assignments are managed by the administrator.
                                        </td>
                                    </tr>
                                )
                                : rows.map((r) => (
                                    <tr
                                        key={r.id}
                                        className="border-b border-gray-100 dark:border-gray-700/80 hover:bg-gray-50 dark:hover:bg-gray-900/30"
                                    >
                                        <td className="px-4 py-3 font-mono text-gray-900 dark:text-white">{r.uid}</td>
                                        <td className="px-4 py-3 text-gray-900 dark:text-white">{r.full_name}</td>
                                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{r.semester}</td>
                                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{r.section ?? '—'}</td>
                                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                            {r.year_of_admission ?? '—'}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                to={`/faculty/mentees/${encodeURIComponent(r.uid)}`}
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

            {/* Pagination footer */}
            {(hasPrev || !isLastPage) && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                    <span>Page {page}</span>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onPrev}
                            disabled={!hasPrev || isLoading}
                            className="px-3 py-1 rounded border border-gray-200 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            onClick={onNext}
                            disabled={isLastPage || isLoading}
                            className="px-3 py-1 rounded border border-gray-200 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
