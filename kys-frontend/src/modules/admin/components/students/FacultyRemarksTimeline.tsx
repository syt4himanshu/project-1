import { memo, useEffect, useReducer } from 'react'
import { toApiErrorMessage } from '../../../../shared/api/errorMapper'
import { QueryState } from '../../../../shared/ui'
import { useAdminStudentRemarksQuery } from '../../hooks'
import type { AdminStudentRemark } from '../../api/types'

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_LIMIT = 20

// ─── Pagination state (single reducer — no split-state race condition) ────────

interface PageState {
    offset: number
    accumulated: AdminStudentRemark[]
}

type PageAction =
    | { type: 'LOAD_MORE'; nextPage: AdminStudentRemark[] }
    | { type: 'RESET' }

function pageReducer(state: PageState, action: PageAction): PageState {
    switch (action.type) {
        case 'LOAD_MORE': {
            const existingIds = new Set(state.accumulated.map((r) => r.id))
            const fresh = action.nextPage.filter((r) => !existingIds.has(r.id))
            return {
                offset: state.offset + PAGE_LIMIT,
                accumulated: [...state.accumulated, ...fresh],
            }
        }
        case 'RESET':
            return { offset: 0, accumulated: [] }
        default:
            return state
    }
}

const INITIAL_PAGE_STATE: PageState = { offset: 0, accumulated: [] }

// ─── Formatting helpers ───────────────────────────────────────────────────────

function formatDate(value: string | null): string {
    if (!value) return 'Date not recorded'
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return value
    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(parsed)
}

function semesterLabel(semester: number): string {
    if (!semester || semester < 1) return 'Semester —'
    return `Semester ${semester}`
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function RemarkSkeleton() {
    return (
        <div className="remark-card remark-card--skeleton" aria-hidden="true">
            <div className="remark-card__header">
                <div className="remark-card__skeleton-line remark-card__skeleton-line--name" />
                <div className="remark-card__skeleton-line remark-card__skeleton-line--badge" />
            </div>
            <div className="remark-card__skeleton-line remark-card__skeleton-line--date" />
            <div className="remark-card__skeleton-line" />
            <div className="remark-card__skeleton-line remark-card__skeleton-line--short" />
        </div>
    )
}

// ─── Single Remark Card ───────────────────────────────────────────────────────

interface RemarkCardProps {
    remark: AdminStudentRemark
}

const RemarkCard = memo(function RemarkCard({ remark }: RemarkCardProps) {
    return (
        <article className="remark-card" aria-label={`Remark by ${remark.facultyName}`}>
            <header className="remark-card__header">
                <div className="remark-card__faculty-info">
                    <span className="remark-card__faculty-name">{remark.facultyName}</span>
                    <span className="remark-card__faculty-email">{remark.facultyEmail}</span>
                </div>
                <span
                    className="remark-card__semester-badge"
                    aria-label={semesterLabel(remark.semester)}
                >
                    {semesterLabel(remark.semester)}
                </span>
            </header>

            <time className="remark-card__date" dateTime={remark.date ?? undefined}>
                {formatDate(remark.date)}
            </time>

            {remark.remarks ? (
                <section className="remark-card__section">
                    <h5 className="remark-card__section-label">AI Remarks</h5>
                    <p className="remark-card__text">{remark.remarks}</p>
                </section>
            ) : null}

            {remark.mentorRemarks ? (
                <section className="remark-card__section">
                    <h5 className="remark-card__section-label">Mentor Remarks</h5>
                    <p className="remark-card__text">{remark.mentorRemarks}</p>
                </section>
            ) : null}

            {remark.issues ? (
                <section className="remark-card__section">
                    <h5 className="remark-card__section-label">Issues</h5>
                    <p className="remark-card__text">{remark.issues}</p>
                </section>
            ) : null}

            {remark.suggestion ? (
                <section className="remark-card__section">
                    <h5 className="remark-card__section-label">Suggestion</h5>
                    <p className="remark-card__text">{remark.suggestion}</p>
                </section>
            ) : null}

            {remark.action ? (
                <section className="remark-card__section">
                    <h5 className="remark-card__section-label">Action Plan</h5>
                    <p className="remark-card__text">{remark.action}</p>
                </section>
            ) : null}
        </article>
    )
})

// ─── Main component ───────────────────────────────────────────────────────────

interface FacultyRemarksTimelineProps {
    /** Student UID. Pass null to skip the query entirely. */
    uid: string | null
}

export function FacultyRemarksTimeline({ uid }: FacultyRemarksTimelineProps) {
    const [pageState, dispatch] = useReducer(pageReducer, INITIAL_PAGE_STATE)

    // Reset accumulated pages whenever the student changes
    useEffect(() => {
        dispatch({ type: 'RESET' })
    }, [uid])

    const query = useAdminStudentRemarksQuery(uid, PAGE_LIMIT, pageState.offset)

    const currentPageRemarks = query.data?.remarks ?? []
    const paging = query.data?.paging

    // On the first page (offset === 0) show the live query data directly so
    // the initial load always reflects fresh server data, not stale accumulated state.
    const displayRemarks: AdminStudentRemark[] =
        pageState.offset === 0 ? currentPageRemarks : pageState.accumulated

    const isFirstLoad = query.isPending && pageState.offset === 0

    function handleLoadMore() {
        // Commit current page into accumulated before bumping offset so
        // the reducer transition is atomic — no intermediate broken state.
        dispatch({ type: 'LOAD_MORE', nextPage: currentPageRemarks })
    }

    return (
        <section className="faculty-remarks-timeline" aria-label="Faculty Remarks">
            <h3 className="faculty-remarks-timeline__heading">Faculty Remarks</h3>

            {/* Loading — skeleton cards on first load only */}
            {isFirstLoad ? (
                <div
                    className="faculty-remarks-timeline__list"
                    aria-busy="true"
                    aria-label="Loading faculty remarks"
                >
                    {Array.from({ length: 3 }, (_, i) => (
                        <RemarkSkeleton key={i} />
                    ))}
                </div>
            ) : null}

            {/* Error state */}
            {query.isError ? (
                <QueryState
                    tone="error"
                    title="Unable to load faculty remarks."
                    description={toApiErrorMessage(query.error)}
                    actionLabel="Retry"
                    onAction={() => void query.refetch()}
                />
            ) : null}

            {/* Empty state — only show after a successful fetch with no results */}
            {!isFirstLoad && !query.isError && displayRemarks.length === 0 ? (
                <p className="faculty-remarks-timeline__empty">
                    No faculty remarks have been recorded for this student yet.
                </p>
            ) : null}

            {/* Timeline */}
            {displayRemarks.length > 0 ? (
                <>
                    <div className="faculty-remarks-timeline__list" role="list">
                        {displayRemarks.map((remark) => (
                            <div key={remark.id} role="listitem">
                                <RemarkCard remark={remark} />
                            </div>
                        ))}
                    </div>

                    {/* Load More — only visible when more pages exist */}
                    {paging?.hasMore ? (
                        <div className="faculty-remarks-timeline__load-more">
                            <button
                                type="button"
                                className="button button--ghost"
                                onClick={handleLoadMore}
                                disabled={query.isFetching}
                                aria-label="Load more remarks"
                            >
                                {query.isFetching ? 'Loading…' : 'Load More'}
                            </button>
                            <span className="faculty-remarks-timeline__count" aria-live="polite">
                                Showing {displayRemarks.length} of {paging.total}
                            </span>
                        </div>
                    ) : null}

                    {/* All loaded indicator — only when pagination was used */}
                    {paging && !paging.hasMore && paging.total > PAGE_LIMIT ? (
                        <p className="faculty-remarks-timeline__all-loaded" aria-live="polite">
                            All {paging.total} remarks loaded.
                        </p>
                    ) : null}
                </>
            ) : null}
        </section>
    )
}
