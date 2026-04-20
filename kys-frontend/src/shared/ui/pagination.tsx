interface PaginationProps {
  page: number
  pageCount: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
}

function clampPage(page: number, pageCount: number): number {
  if (page < 1) return 1
  if (page > pageCount) return pageCount
  return page
}

export function Pagination({
  page,
  pageCount,
  pageSize,
  totalItems,
  onPageChange,
}: PaginationProps) {
  if (pageCount <= 1) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  return (
    <footer className="table-pagination" aria-label="Pagination">
      <button
        type="button"
        className="table-pagination__button"
        onClick={() => onPageChange(clampPage(page - 1, pageCount))}
        disabled={page <= 1}
      >
        <span className="mobile-hide">Previous</span>
        <span className="desktop-hide">← Prev</span>
      </button>

      <div className="table-pagination__label">
        <span className="mobile-hide">Showing {start}-{end} of {totalItems}</span>
        <span className="desktop-hide">Showing {start}-{end} of {totalItems}</span>
        <span className="mobile-hide">Page {page} of {pageCount}</span>
      </div>

      <button
        type="button"
        className="table-pagination__button"
        onClick={() => onPageChange(clampPage(page + 1, pageCount))}
        disabled={page >= pageCount}
      >
        <span className="mobile-hide">Next</span>
        <span className="desktop-hide">Next →</span>
      </button>
    </footer>
  )

}
