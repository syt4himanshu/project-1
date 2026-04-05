import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import InfoTable from '@/components/shared/InfoTable'
import { useFacultyDetail } from '@/hooks/useFaculty'

interface Props {
    facultyId: number | null
    onClose: () => void
}

export default function TeacherDetailDialog({ facultyId, onClose }: Props) {
    const { data: faculty, isLoading } = useFacultyDetail(facultyId ?? 0)

    return (
        <Dialog open={!!facultyId} onOpenChange={(v) => { if (!v) onClose() }}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isLoading ? <Skeleton className="h-6 w-48" /> : `${faculty?.first_name} ${faculty?.last_name}`}
                    </DialogTitle>
                    {!isLoading && <p className="text-sm text-slate-500">{faculty?.email}</p>}
                </DialogHeader>

                {isLoading ? (
                    <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
                ) : faculty ? (
                    <div className="space-y-4">
                        <InfoTable rows={[
                            { label: 'Email', value: faculty.email },
                            { label: 'Contact', value: faculty.contact_number },
                            { label: 'User ID', value: faculty.user_id },
                            { label: 'Assigned Students', value: `${faculty.assigned_count} / 20` },
                        ]} />

                        <div>
                            <h3 className="font-semibold text-slate-700 mb-2">Assigned Students</h3>
                            {faculty.students && faculty.students.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>#</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>UID</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {faculty.students.map((s, i) => (
                                            <TableRow key={s.id}>
                                                <TableCell>{i + 1}</TableCell>
                                                <TableCell className="font-medium">{s.name}</TableCell>
                                                <TableCell className="text-slate-500">{s.uid}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="text-slate-400 italic text-sm">No students assigned yet</p>
                            )}
                        </div>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    )
}
