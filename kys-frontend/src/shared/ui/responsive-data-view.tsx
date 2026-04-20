import { useMemo, useState, type ReactNode } from 'react'
import { DataTable, type TableColumn } from './data-table'
import { Pagination } from './pagination'

export interface ResponsiveDataViewProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  keyExtractor: (row: T, index: number) => string | number
  isLoading?: boolean
  loadingRowCount?: number
  emptyLabel?: string
  pageSize?: number
  renderMobileCard: (row: T, index: number) => ReactNode
}

function clampPage(page: number, pageCount: number): number {
  if (page < 1) return 1
  if (page > pageCount) return pageCount
  return page
}

export function ResponsiveDataView<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  loadingRowCount = 8,
  emptyLabel = 'No records found.',
  pageSize = 10,
  renderMobileCard,
}: ResponsiveDataViewProps<T>) {
  const [page, setPage] = useState(1)

  const pageCount = Math.max(1, Math.ceil(data.length / pageSize))
  const currentPage = clampPage(page, pageCount)

  const pagedRows = useMemo(
    () => data.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [data, currentPage, pageSize],
  )

  const handlePageChange = (nextPage: number) => {
    setPage(clampPage(nextPage, pageCount))
  }

  const renderMobileContent = () => {
    if (isLoading) {
      return Array.from({ length: 3 }, (_, i) => (
        <div key={`loading-card-${i}`} className="mobile-card animate-pulse shadow-sm">
           <div className="mobile-card__header">
             <div className="mobile-card__avatar bg-gray-200" />
             <div className="mobile-card__info space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-3 bg-gray-200 rounded w-20" />
             </div>
           </div>
           <div className="space-y-4">
              {[1, 2, 3].map(j => (
                <div key={j} className="flex justify-between items-center">
                  <div className="h-3 bg-gray-200 rounded w-16" />
                  <div className="h-3 bg-gray-200 rounded w-24" />
                </div>
              ))}
              <div className="flex justify-end gap-3 pt-2">
                 <div className="h-9 w-9 bg-gray-200 rounded-lg" />
                 <div className="h-9 w-9 bg-gray-200 rounded-lg" />
                 <div className="h-9 w-9 bg-gray-200 rounded-lg" />
              </div>
           </div>
        </div>
      ))
    }

    if (pagedRows.length === 0) {
      return (
        <div className="query-state text-center py-10">
          <p className="query-state__title">{emptyLabel}</p>
        </div>
      )
    }

    return pagedRows.map((row, index) => {
      const absoluteIndex = (currentPage - 1) * pageSize + index
      return (
        <div key={keyExtractor(row, absoluteIndex)}>
          {renderMobileCard(row, absoluteIndex)}
        </div>
      )
    })
  }

  return (
    <div className="responsive-data-view">
      {/* Desktop Layout */}
      <div className="desktop-table">
        <DataTable
          columns={columns}
          data={data}
          keyExtractor={keyExtractor}
          isLoading={isLoading}
          loadingRowCount={loadingRowCount}
          emptyLabel={emptyLabel}
          pageSize={pageSize}
          page={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Mobile Layout */}
      <div className="mobile-cards">
        <div className="mobile-cards__list">
          {renderMobileContent()}
        </div>

        {pageCount > 1 && (
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            pageSize={pageSize}
            totalItems={data.length}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  )
}
