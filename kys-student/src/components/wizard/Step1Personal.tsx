import { WizardStepProps, field, input, select } from './shared'

export default function Step1Personal({ data, update }: WizardStepProps) {
    const pi = (data.personal_info as Record<string, unknown>) || {}
    const upd = (k: string, v: unknown) => update({ personal_info: { ...pi, [k]: v } })

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('Full Name', input('text', (data.full_name as string) || '', v => update({ full_name: v }), 'e.g. Rahul Kumar Sharma'))}
            {field('Section', select(['A', 'B', 'C', 'D'], (pi.section as string) || '', v => upd('section', v)))}
            {field('Semester', select(['1', '2', '3', '4', '5', '6', '7', '8'], String(data.semester || ''), v => update({ semester: Number(v) })))}
            {field('Year of Admission', input('number', String(data.year_of_admission || ''), v => update({ year_of_admission: Number(v) }), '2022'))}
            {field('Mobile No', input('tel', (pi.mobile_no as string) || '', v => upd('mobile_no', v), '10-digit number'))}
            {field('Personal Email', input('email', (pi.personal_email as string) || '', v => upd('personal_email', v)))}
            {field('College Email', input('email', (pi.college_email as string) || '', v => upd('college_email', v), 'xxx@stvincentngp.edu.in'))}
            {field('LinkedIn ID', input('text', (pi.linked_in_id as string) || '', v => upd('linked_in_id', v)))}
            {field('Date of Birth', input('date', (pi.dob as string) || '', v => upd('dob', v)))}
            {field('Gender', select(['Male', 'Female', 'Other'], (pi.gender as string) || '', v => upd('gender', v)))}
            <div className="sm:col-span-2">
                {field('Permanent Address', (
                    <textarea value={(pi.permanent_address as string) || ''} onChange={e => upd('permanent_address', e.target.value)}
                        rows={3} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                ))}
            </div>
        </div>
    )
}
