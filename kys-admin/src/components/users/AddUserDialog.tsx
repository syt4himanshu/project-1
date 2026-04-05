import { useState } from 'react'
import { Eye, EyeOff, Loader2, GraduationCap, BookOpen } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateUser } from '@/hooks/useUsers'
import { cn } from '@/lib/utils'

const studentSchema = z.object({
    uid: z.string().min(1, 'Required'),
    name: z.string().min(1, 'Required'),
    password: z.string().min(6, 'Min 6 characters'),
    semester: z.string().min(1, 'Required'),
    section: z.string().min(1, 'Required'),
    year_of_admission: z.number({ coerce: true }).min(2000).max(2100),
})

const facultySchema = z.object({
    email: z.string().email().refine((v) => v.endsWith('@stvincentngp.edu.in'), {
        message: 'Must be @stvincentngp.edu.in email',
    }),
    first_name: z.string().min(1, 'Required'),
    last_name: z.string().min(1, 'Required'),
    contact_number: z.string().min(10, 'Min 10 digits'),
    password: z.string().min(6, 'Min 6 characters'),
})

type StudentForm = z.infer<typeof studentSchema>
type FacultyForm = z.infer<typeof facultySchema>

interface Props {
    open: boolean
    onOpenChange: (v: boolean) => void
}

export default function AddUserDialog({ open, onOpenChange }: Props) {
    const [role, setRole] = useState<'student' | 'faculty' | null>(null)
    const [showPwd, setShowPwd] = useState(false)
    const { mutateAsync, isPending } = useCreateUser()

    const studentForm = useForm<StudentForm>({ resolver: zodResolver(studentSchema) })
    const facultyForm = useForm<FacultyForm>({ resolver: zodResolver(facultySchema) })

    const handleClose = (v: boolean) => {
        if (!v) { setRole(null); studentForm.reset(); facultyForm.reset() }
        onOpenChange(v)
    }

    const onStudentSubmit = async (data: StudentForm) => {
        await mutateAsync({ ...data, role: 'student' })
        handleClose(false)
    }

    const onFacultySubmit = async (data: FacultyForm) => {
        await mutateAsync({ ...data, role: 'faculty' })
        handleClose(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{role ? `Create ${role === 'student' ? 'Student' : 'Faculty'}` : 'Add User'}</DialogTitle>
                </DialogHeader>

                {!role && (
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        {([['student', GraduationCap, 'Student'], ['faculty', BookOpen, 'Faculty']] as const).map(([r, Icon, label]) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRole(r)}
                                className={cn(
                                    'border-2 rounded-xl p-5 cursor-pointer text-center transition-colors hover:border-sky-400 hover:bg-sky-50',
                                    role === r ? 'border-sky-500 bg-sky-50' : 'border-slate-200'
                                )}
                            >
                                <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center mx-auto mb-3">
                                    <Icon className="w-6 h-6 text-sky-600" />
                                </div>
                                <div className="font-semibold text-slate-700">{label}</div>
                            </button>
                        ))}
                    </div>
                )}

                {role === 'student' && (
                    <form onSubmit={studentForm.handleSubmit(onStudentSubmit)} className="space-y-3">
                        <button type="button" className="text-xs text-sky-500 hover:underline" onClick={() => setRole(null)}>← Back</button>
                        {[
                            { name: 'uid' as const, label: 'UID' },
                            { name: 'name' as const, label: 'Full Name' },
                            { name: 'section' as const, label: 'Section' },
                        ].map(({ name, label }) => (
                            <div key={name} className="space-y-1">
                                <Label>{label}</Label>
                                <Input {...studentForm.register(name)} />
                                {studentForm.formState.errors[name] && <p className="text-xs text-red-500">{studentForm.formState.errors[name]?.message}</p>}
                            </div>
                        ))}
                        <div className="space-y-1">
                            <Label>Semester</Label>
                            <Controller control={studentForm.control} name="semester" render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Select semester" /></SelectTrigger>
                                    <SelectContent>{[1, 2, 3, 4, 5, 6, 7, 8].map(s => <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>)}</SelectContent>
                                </Select>
                            )} />
                            {studentForm.formState.errors.semester && <p className="text-xs text-red-500">{studentForm.formState.errors.semester.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label>Year of Admission</Label>
                            <Input type="number" min={2000} max={2100} {...studentForm.register('year_of_admission', { valueAsNumber: true })} />
                            {studentForm.formState.errors.year_of_admission && <p className="text-xs text-red-500">{studentForm.formState.errors.year_of_admission.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label>Password</Label>
                            <div className="relative">
                                <Input type={showPwd ? 'text' : 'password'} {...studentForm.register('password')} />
                                <button type="button" className="absolute right-3 top-2.5 text-slate-400" onClick={() => setShowPwd(!showPwd)}>
                                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {studentForm.formState.errors.password && <p className="text-xs text-red-500">{studentForm.formState.errors.password.message}</p>}
                        </div>
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Create Student
                        </Button>
                    </form>
                )}

                {role === 'faculty' && (
                    <form onSubmit={facultyForm.handleSubmit(onFacultySubmit)} className="space-y-3">
                        <button type="button" className="text-xs text-sky-500 hover:underline" onClick={() => setRole(null)}>← Back</button>
                        {[
                            { name: 'email' as const, label: 'Email', type: 'email' },
                            { name: 'first_name' as const, label: 'First Name', type: 'text' },
                            { name: 'last_name' as const, label: 'Last Name', type: 'text' },
                            { name: 'contact_number' as const, label: 'Contact Number', type: 'tel' },
                        ].map(({ name, label, type }) => (
                            <div key={name} className="space-y-1">
                                <Label>{label}</Label>
                                <Input type={type} {...facultyForm.register(name)} />
                                {facultyForm.formState.errors[name] && <p className="text-xs text-red-500">{facultyForm.formState.errors[name]?.message}</p>}
                            </div>
                        ))}
                        <div className="space-y-1">
                            <Label>Password</Label>
                            <div className="relative">
                                <Input type={showPwd ? 'text' : 'password'} {...facultyForm.register('password')} />
                                <button type="button" className="absolute right-3 top-2.5 text-slate-400" onClick={() => setShowPwd(!showPwd)}>
                                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {facultyForm.formState.errors.password && <p className="text-xs text-red-500">{facultyForm.formState.errors.password.message}</p>}
                        </div>
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Create Faculty
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
