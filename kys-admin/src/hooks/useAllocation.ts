import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { allocationApi } from '@/lib/api'
import { toast } from 'sonner'

export function useAllocation() {
    return useQuery({ queryKey: ['allocation'], queryFn: allocationApi.list })
}

export function useGenerateAllocation() {
    return useMutation({
        mutationFn: allocationApi.generate,
        onError: (e: Error) => toast.error(e.message),
    })
}

export function useConfirmAllocation() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ faculty_id, student_ids }: { faculty_id: number; student_ids: number[] }) =>
            allocationApi.confirm(faculty_id, student_ids),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['allocation'] }); toast.success('Allocation confirmed') },
        onError: (e: Error) => toast.error(e.message),
    })
}

export function useRemoveAllocation() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ faculty_id, student_ids }: { faculty_id: number; student_ids: number[] }) =>
            allocationApi.remove(faculty_id, student_ids),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['allocation'] }); toast.success('Students removed') },
        onError: (e: Error) => toast.error(e.message),
    })
}

export function useAssignedStudents(faculty_id: number) {
    return useQuery({
        queryKey: ['allocation', 'assigned', faculty_id],
        queryFn: () => allocationApi.getAssigned(faculty_id),
        enabled: !!faculty_id,
    })
}
