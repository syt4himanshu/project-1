import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { studentsApi, type StudentListFilters } from '@/lib/api'
import { toast } from 'sonner'

export function useStudents(filters: StudentListFilters) {
    return useQuery({
        queryKey: ['students', filters],
        queryFn: () => studentsApi.list(filters),
        staleTime: 30_000,
    })
}

export function useStudentDetail(id: number) {
    return useQuery({ queryKey: ['students', id], queryFn: () => studentsApi.get(id), enabled: !!id })
}

export function useDeleteStudent() {
    const qc = useQueryClient()
    return useMutation({
        // Backend DELETE /api/admin/student/:uid — requires uid not id
        mutationFn: (uid: string) => studentsApi.deleteByUid(uid),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['students'] })
            qc.invalidateQueries({ queryKey: ['stats'] })
            toast.success('Student deleted')
        },
        onError: (e: Error) => toast.error(e.message),
    })
}
