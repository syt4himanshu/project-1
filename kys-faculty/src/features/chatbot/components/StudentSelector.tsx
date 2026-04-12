import type { MenteeRow, ScopeMode } from '../types'
import { ScopeToggle } from './ScopeToggle'
import { ErrorState } from './ErrorState'

interface StudentSelectorProps {
    scopeMode: ScopeMode
    mentees: MenteeRow[]
    filteredMentees: MenteeRow[]
    selectedStudentUid: string
    studentSearch: string
    menteeLoading: boolean
    menteeError: string
    onMenteeRetry: () => void
    onScopeChange: (scope: ScopeMode) => void
    onStudentSearchChange: (value: string) => void
    onStudentSelect: (uid: string) => void
}

export function StudentSelector({
    scopeMode,
    mentees,
    filteredMentees,
    selectedStudentUid,
    studentSearch,
    menteeLoading,
    menteeError,
    onMenteeRetry,
    onScopeChange,
    onStudentSearchChange,
    onStudentSelect,
}: StudentSelectorProps) {
    const noMatches = !menteeLoading && Boolean(studentSearch.trim()) && filteredMentees.length === 0

    return (
        <div className="p-4 space-y-4">
            <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Scope</p>
                <ScopeToggle value={scopeMode} onChange={onScopeChange} />
            </div>

            <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Select Student</p>
                <input
                    value={studentSearch}
                    onChange={(event) => onStudentSearchChange(event.target.value)}
                    placeholder="Search by name, UID, semester"
                    className="w-full px-3 py-2 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                />
                <select
                    value={scopeMode === 'all' ? '__all__' : selectedStudentUid}
                    disabled={menteeLoading || mentees.length === 0}
                    onChange={(event) => {
                        const value = event.target.value
                        onStudentSelect(value === '__all__' ? '' : value)
                    }}
                    className="w-full px-3 py-2 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                >
                    <option value="__all__">All assigned students</option>
                    {filteredMentees.map((row) => (
                        <option key={row.id} value={row.uid}>
                            {row.full_name} · {row.uid} · Sem {row.semester}
                        </option>
                    ))}
                </select>

                {scopeMode === 'student' && !selectedStudentUid && (
                    <p className="text-xs text-amber-600 dark:text-amber-400">Select a student or switch to all assigned.</p>
                )}
                {noMatches && <p className="text-xs text-gray-500 dark:text-gray-400">No student matches your search.</p>}
                {menteeError && <ErrorState message={menteeError} retryLabel="Reload" onRetry={onMenteeRetry} />}
            </div>

            <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-3">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">Future filters</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Semester, backlog, SGPA range, risk category.</p>
            </div>
        </div>
    )
}
