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
      <div className="table-pagination__label">
        <span>Showing {start}–{end} of {totalItems}</span>
        <span className="mobile-hide">Page {page} of {pageCount}</span>
      </div>

      <div className="table-pagination__actions">
        <button
          type="button"
          className="table-pagination__button"
          onClick={() => onPageChange(clampPage(page - 1, pageCount))}
          disabled={page <= 1}
        >
          Prev
        </button>

        <button
          type="button"
          className="table-pagination__button"
          onClick={() => onPageChange(clampPage(page + 1, pageCount))}
          disabled={page >= pageCount}
        >
          Next
        </button>
      </div>
    </footer>
  )
}

