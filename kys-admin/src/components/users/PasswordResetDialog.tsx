import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useResetPassword } from '@/hooks/useUsers'

const schema = z.object({
    new_password: z.string().min(8, 'Min 8 characters'),
    confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
})

type FormData = z.infer<typeof schema>

interface Props {
    open: boolean
    onOpenChange: (v: boolean) => void
    userId: number
    userName: string
    userRole: string
}

export default function PasswordResetDialog({ open, onOpenChange, userName, userRole }: Props) {
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const { mutateAsync, isPending } = useResetPassword()

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (data: FormData) => {
        // Backend requires: role, username, new_password
        await mutateAsync({ role: userRole, username: userName, new_password: data.new_password })
        reset()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <p className="text-sm text-slate-500">
                        Resetting password for <strong>{userName}</strong>
                        <span className="ml-1 text-xs text-slate-400">({userRole})</span>
                    </p>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1">
                        <Label>New Password</Label>
                        <div className="relative">
                            <Input type={showNew ? 'text' : 'password'} {...register('new_password')} />
                            <button type="button" className="absolute right-3 top-2.5 text-slate-400" onClick={() => setShowNew(!showNew)}>
                                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.new_password && <p className="text-xs text-red-500">{errors.new_password.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label>Confirm Password</Label>
                        <div className="relative">
                            <Input type={showConfirm ? 'text' : 'password'} {...register('confirm_password')} />
                            <button type="button" className="absolute right-3 top-2.5 text-slate-400" onClick={() => setShowConfirm(!showConfirm)}>
                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.confirm_password && <p className="text-xs text-red-500">{errors.confirm_password.message}</p>}
                    </div>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                        Reset Password
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
