import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { authApi } from '@/lib/api'
import { toast } from 'sonner'

const schema = z.object({
    uid: z.string().min(1, 'Required'),
    password: z.string().min(1, 'Required'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
    const navigate = useNavigate()
    const [showPwd, setShowPwd] = useState(false)
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (data: FormData) => {
        try {
            const res = await authApi.login({ uid: data.uid, password: data.password })
            if (res.role !== 'admin') {
                toast.error('Access denied. Admin only.')
                return
            }
            localStorage.setItem('access_token', res.access_token)
            localStorage.setItem('role', res.role)
            localStorage.setItem('username', res.username)
            toast.success('Login successful')
            navigate('/dashboard')
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : 'Login failed')
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full max-w-sm p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-sky-500 flex items-center justify-center mb-4">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">KYS Admin Panel</h1>
                    <p className="text-slate-500 text-sm mt-1">Know Your Student — Mentoring System</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1">
                        <Label>UID / Email</Label>
                        <Input placeholder="Enter your UID or email" {...register('uid')} />
                        {errors.uid && <p className="text-xs text-red-500">{errors.uid.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label>Password</Label>
                        <div className="relative">
                            <Input type={showPwd ? 'text' : 'password'} placeholder="Enter your password" {...register('password')} />
                            <button type="button" className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600" onClick={() => setShowPwd(!showPwd)}>
                                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                        Login
                    </Button>
                </form>
            </div>
        </div>
    )
}
