import { useAppDispatch, useAppSelector } from '../../../../app/store/hooks'
import {
    facultyChatActions,
    loadFacultyChatMentees,
    selectFacultyChatFilteredMentees,
    selectFacultyChatMenteeError,
    selectFacultyChatMenteeLoading,
    selectFacultyChatMentees,
    selectFacultyChatScopeMode,
    selectFacultyChatSelectedStudentUid,
    selectFacultyChatStudentSearch,
} from '../../store/facultyChatSlice'
import { ScopeToggle } from './ScopeToggle'
import { ErrorState } from './ErrorState'

export function StudentSelector() {
    const dispatch = useAppDispatch()
    const scopeMode = useAppSelector(selectFacultyChatScopeMode)
    const mentees = useAppSelector(selectFacultyChatMentees)
    const filteredMentees = useAppSelector(selectFacultyChatFilteredMentees)
    const selectedStudentUid = useAppSelector(selectFacultyChatSelectedStudentUid)
    const studentSearch = useAppSelector(selectFacultyChatStudentSearch)
    const menteeLoading = useAppSelector(selectFacultyChatMenteeLoading)
    const menteeError = useAppSelector(selectFacultyChatMenteeError)

    const noMatches =
        !menteeLoading && Boolean(studentSearch.trim()) && filteredMentees.length === 0

    return (
        <div className="faculty-selector">
            <div className="faculty-selector__group">
                <p className="faculty-selector__label">Scope</p>
                <ScopeToggle
                    value={scopeMode}
                    onChange={(scope) => dispatch(facultyChatActions.setScopeMode(scope))}
                />
            </div>

            <div className="faculty-selector__group">
                <p className="faculty-selector__label">Student selection</p>
                <label className="admin-field" htmlFor="faculty-student-search">
                    <span>Search</span>
                    <input
                        id="faculty-student-search"
                        value={studentSearch}
                        onChange={(e) => dispatch(facultyChatActions.setStudentSearch(e.target.value))}
                        placeholder="Search by name, UID, semester"
                    />
                </label>
                <label className="admin-field" htmlFor="faculty-student-select">
                    <span>Student</span>
                    <select
                        id="faculty-student-select"
                        value={scopeMode === 'all' ? '__all__' : selectedStudentUid}
                        disabled={menteeLoading || mentees.length === 0}
                        onChange={(e) => {
                            const v = e.target.value
                            dispatch(facultyChatActions.setSelectedStudentUid(v === '__all__' ? '' : v))
                        }}
                    >
                        <option value="__all__">All assigned students</option>
                        {filteredMentees.map((r) => (
                            <option key={r.id} value={r.uid}>
                                {r.full_name} | {r.uid} | Sem {r.semester}
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
                    <ErrorState
                        message={menteeError}
                        retryLabel="Reload"
                        onRetry={() => void dispatch(loadFacultyChatMentees())}
                    />
                )}
            </div>

            <div className="faculty-selector__future">
                <p className="faculty-selector__future-title">Tip</p>
                <p className="faculty-selector__hint">Use student scope when you need individual guidance.</p>
            </div>
        </div>
    )
}
