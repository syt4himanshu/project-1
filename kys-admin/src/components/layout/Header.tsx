import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Circle, KeyRound, LogOut, Loader2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authApi } from '@/lib/api'
import { toast } from 'sonner'

const schema = z.object({
    current_password: z.string().min(1, 'Required'),
    new_password: z.string().min(8, 'Min 8 characters'),
    confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
})

type FormData = z.infer<typeof schema>

export default function Header() {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (data: FormData) => {
        try {
            await authApi.changePassword({ old_password: data.current_password, new_password: data.new_password })
            toast.success('Password changed successfully')
            reset()
            setOpen(false)
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : 'Failed to change password')
        }
    }

    const handleLogout = () => {
        localStorage.clear()
        navigate('/login')
    }

    return (
        <>
            <div className="flex justify-between items-center border-b border-slate-200 pb-5 mb-6">
                <div className="flex items-center gap-3">
                    <Circle className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-600 font-semibold text-[30px] leading-none">Admin Dashboard</span>
                </div>
                <div className="flex gap-2 text-sm">
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-200 text-blue-700 hover:border-blue-300 hover:bg-blue-50"
                        onClick={() => setOpen(true)}
                    >
                        <KeyRound className="w-3.5 h-3.5 mr-1" /> Change Password
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleLogout}>
                        <LogOut className="w-3.5 h-3.5 mr-1" /> Logout
                    </Button>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-1">
                            <Label>Current Password</Label>
                            <div className="relative">
                                <Input type={showCurrent ? 'text' : 'password'} {...register('current_password')} />
                                <button type="button" className="absolute right-3 top-2.5 text-slate-400" onClick={() => setShowCurrent(!showCurrent)}>
                                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.current_password && <p className="text-xs text-red-500">{errors.current_password.message}</p>}
                        </div>
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
                            <Label>Confirm New Password</Label>
                            <div className="relative">
                                <Input type={showConfirm ? 'text' : 'password'} {...register('confirm_password')} />
                                <button type="button" className="absolute right-3 top-2.5 text-slate-400" onClick={() => setShowConfirm(!showConfirm)}>
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.confirm_password && <p className="text-xs text-red-500">{errors.confirm_password.message}</p>}
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            Update Password
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
