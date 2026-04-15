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
    const noMatches =
        !menteeLoading && Boolean(studentSearch.trim()) && filteredMentees.length === 0

    return (
        <div className="faculty-selector">
            <div className="faculty-selector__group">
                <p className="faculty-selector__label">Scope</p>
                <ScopeToggle value={scopeMode} onChange={onScopeChange} />
            </div>

            <div className="faculty-selector__group">
                <p className="faculty-selector__label">Select student</p>
                <label className="admin-field" htmlFor="faculty-student-search">
                    <span className="sr-only">Search students</span>
                    <input
                        id="faculty-student-search"
                        value={studentSearch}
                        onChange={(e) => onStudentSearchChange(e.target.value)}
                        placeholder="Search by name, UID, semester"
                    />
                </label>
                <label className="admin-field" htmlFor="faculty-student-select">
                    <span className="sr-only">Select student</span>
                    <select
                        id="faculty-student-select"
                        value={scopeMode === 'all' ? '__all__' : selectedStudentUid}
                        disabled={menteeLoading || mentees.length === 0}
                        onChange={(e) => {
                            const v = e.target.value
                            onStudentSelect(v === '__all__' ? '' : v)
                        }}
                    >
                        <option value="__all__">All assigned students</option>
                        {filteredMentees.map((r) => (
                            <option key={r.id} value={r.uid}>
                                {r.full_name} · {r.uid} · Sem {r.semester}
                            </option>
                        ))}
                    </select>
                </label>

                {scopeMode === 'student' && !selectedStudentUid && (
                    <p className="faculty-selector__hint faculty-selector__hint--warn">
                        Select a student or switch to all assigned.
                    </p>
                )}
                {noMatches && (
                    <p className="faculty-selector__hint">No student matches your search.</p>
                )}
                {menteeError && (
                    <ErrorState message={menteeError} retryLabel="Reload" onRetry={onMenteeRetry} />
                )}
            </div>

            <div className="faculty-selector__future">
                <p className="faculty-selector__future-title">Future filters</p>
                <p className="faculty-selector__hint">Semester, backlog, SGPA range, risk category.</p>
            </div>
        </div>
    )
}
