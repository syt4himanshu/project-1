import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { facultyApi } from '@/lib/api'
import { toast } from 'sonner'

export function useFaculty() {
    return useQuery({ queryKey: ['faculty'], queryFn: facultyApi.list })
}

// Composes faculty detail from GET /api/admin/faculty (full list) + GET /api/admin/faculty/:id/mentees
export function useFacultyDetail(id: number) {
    return useQuery({
        queryKey: ['faculty', id],
        queryFn: () => facultyApi.get(id),
        enabled: !!id,
    })
}

export function useDeleteFaculty() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: facultyApi.delete,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['faculty'] })
            qc.invalidateQueries({ queryKey: ['stats'] })
            toast.success('Faculty deleted')
        },
        onError: (e: Error) => toast.error(e.message),
    })
}
