import { useState } from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import Pagination from './Pagination'

interface Column<T> {
    header: string
    accessor?: keyof T
    cell?: (row: T, index: number) => React.ReactNode
    className?: string
}

interface Props<T> {
    columns: Column<T>[]
    data: T[]
    isLoading?: boolean
    pageSize?: number
    keyExtractor: (row: T) => string | number
}

export default function DataTable<T>({ columns, data, isLoading, pageSize = 20, keyExtractor }: Props<T>) {
    const [page, setPage] = useState(1)
    const totalPages = Math.max(1, Math.ceil(data.length / pageSize))
    const paged = data.slice((page - 1) * pageSize, page * pageSize)

    if (isLoading) {
        return (
            <div className="p-4 space-y-2">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
        )
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((col) => (
                            <TableHead key={col.header} className={col.className}>{col.header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paged.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center text-slate-400 py-10">
                                No records found
                            </TableCell>
                        </TableRow>
                    ) : (
                        paged.map((row, idx) => (
                            <TableRow key={keyExtractor(row)}>
                                {columns.map((col) => (
                                    <TableCell key={col.header} className={col.className}>
                                        {col.cell ? col.cell(row, (page - 1) * pageSize + idx) : col.accessor ? String(row[col.accessor] ?? '—') : null}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
    )
}
