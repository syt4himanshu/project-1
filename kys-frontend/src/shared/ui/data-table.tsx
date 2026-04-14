import { useMemo, useState, type ReactNode } from 'react'
import { Pagination } from './pagination'

export interface TableColumn<T> {
  id: string
  header: ReactNode
  cell: (row: T, index: number) => ReactNode
  className?: string
  headerClassName?: string
}

interface DataTableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  keyExtractor: (row: T, index: number) => string | number
  isLoading?: boolean
  loadingRowCount?: number
  emptyLabel?: string
  pageSize?: number
}

function clampPage(page: number, pageCount: number): number {
  if (page < 1) return 1
  if (page > pageCount) return pageCount
  return page
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  loadingRowCount = 8,
  emptyLabel = 'No records found.',
  pageSize = 10,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1)

  const pageCount = Math.max(1, Math.ceil(data.length / pageSize))
  const currentPage = clampPage(page, pageCount)

  const pagedRows = useMemo(
    () => data.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [data, currentPage, pageSize],
  )

  const renderBody = () => {
    if (isLoading) {
      return Array.from({ length: loadingRowCount }, (_, rowIndex) => (
        <tr key={`loading-${rowIndex}`}>
          {columns.map((column) => (
            <td key={`${column.id}-loading-${rowIndex}`} className={column.className}>
              <div className="table-skeleton" />
            </td>
          ))}
        </tr>
      ))
    }

    if (pagedRows.length === 0) {
      return (
        <tr>
          <td colSpan={columns.length} className="table-empty">
            {emptyLabel}
          </td>
        </tr>
      )
    }

    return pagedRows.map((row, index) => {
      const absoluteIndex = (currentPage - 1) * pageSize + index
      return (
        <tr key={keyExtractor(row, absoluteIndex)}>
          {columns.map((column) => (
            <td key={column.id} className={column.className}>
              {column.cell(row, absoluteIndex)}
            </td>
          ))}
        </tr>
      )
    })
  }

  return (
    <div className="table-wrap">
      <div className="table-scroll">
        <table className="table" role="grid">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.id} className={column.headerClassName}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>{renderBody()}</tbody>
        </table>
      </div>

      <Pagination
        page={currentPage}
        pageCount={pageCount}
        pageSize={pageSize}
        totalItems={data.length}
        onPageChange={(nextPage) => setPage(clampPage(nextPage, pageCount))}
      />
    </div>
  )
}
