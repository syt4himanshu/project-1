import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/lib/api'
import { toast } from 'sonner'

export function useUsers() {
    return useQuery({ queryKey: ['users'], queryFn: usersApi.list })
}

export function useCreateUser() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: usersApi.create,
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); qc.invalidateQueries({ queryKey: ['stats'] }); toast.success('User created successfully') },
        onError: (e: Error) => toast.error(e.message),
    })
}

export function useDeleteUser() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: usersApi.delete,
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); qc.invalidateQueries({ queryKey: ['stats'] }); toast.success('User deleted') },
        onError: (e: Error) => toast.error(e.message),
    })
}

export function useResetPassword() {
    return useMutation({
        mutationFn: ({ id, new_password }: { id: number; new_password: string }) =>
            usersApi.resetPassword(id, { new_password }),
        onSuccess: () => toast.success('Password reset successfully'),
        onError: (e: Error) => toast.error(e.message),
    })
}
