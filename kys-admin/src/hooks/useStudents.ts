import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { studentsApi } from '@/lib/api'
import { toast } from 'sonner'

export function useStudents() {
    return useQuery({ queryKey: ['students'], queryFn: studentsApi.list })
}

export function useStudentDetail(id: number) {
    return useQuery({ queryKey: ['students', id], queryFn: () => studentsApi.get(id), enabled: !!id })
}

export function useDeleteStudent() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: studentsApi.delete,
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['students'] }); qc.invalidateQueries({ queryKey: ['stats'] }); toast.success('Student deleted') },
        onError: (e: Error) => toast.error(e.message),
    })
}
