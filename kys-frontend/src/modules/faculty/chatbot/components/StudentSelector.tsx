import { useAppDispatch, useAppSelector } from '../../../../app/store/hooks'
import {
    facultyChatActions,
    loadFacultyChatMentees,
    selectFacultyChatFilteredMentees,
    selectFacultyChatMenteeError,
    selectFacultyChatMenteeLoading,
    selectFacultyChatMentees,
    selectFacultyChatSelectedStudentUid,
    selectFacultyChatStudentSearch,
} from '../../store/facultyChatSlice'
import { ErrorState } from './ErrorState'

export function StudentSelector() {
    const dispatch = useAppDispatch()
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
                <p className="faculty-selector__label">Mentee selection</p>
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
                        value={selectedStudentUid}
                        disabled={menteeLoading || mentees.length === 0}
                        onChange={(e) => {
                            dispatch(facultyChatActions.setSelectedStudentUid(e.target.value))
                        }}
                    >
                        <option value="">Select a student</option>
                        {filteredMentees.map((r) => (
                            <option key={r.id} value={r.uid}>
                                {r.full_name} | {r.uid} | Sem {r.semester}
                            </option>
                        ))}
                    </select>
                </label>

                {noMatches && (
                    <p className="faculty-selector__hint">No mentee matches your search.</p>
                )}
                {menteeError && (
                    <ErrorState
                        message={menteeError}
                        retryLabel="Reload"
                        onRetry={() => void dispatch(loadFacultyChatMentees())}
                    />
                )}
            </div>
        </div>
    )
}
