import { Button } from '@/components/ui/button'

interface Props {
    page: number
    totalPages: number
    onPageChange: (p: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
    if (totalPages <= 1) return null
    return (
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 flex items-center justify-center gap-3">
            <Button size="sm" variant="outline" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
                Prev
            </Button>
            <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
            <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
                Next
            </Button>
        </div>
    )
}
