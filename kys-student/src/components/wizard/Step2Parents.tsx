import { WizardStepProps, field, input } from './shared'

export default function Step2Parents({ data, update }: WizardStepProps) {
    const pi = (data.personal_info as Record<string, unknown>) || {}
    const upd = (k: string, v: unknown) => update({ personal_info: { ...pi, [k]: v } })

    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Father's Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {field("Father's Name", input('text', (pi.father_name as string) || '', v => upd('father_name', v)))}
                    {field("Father's Mobile", input('tel', (pi.father_mobile_no as string) || '', v => upd('father_mobile_no', v)))}
                    {field("Father's Email", input('email', (pi.father_email as string) || '', v => upd('father_email', v)))}
                    {field("Father's Occupation", input('text', (pi.father_occupation as string) || '', v => upd('father_occupation', v)))}
                </div>
            </div>
            <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Mother's Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {field("Mother's Name", input('text', (pi.mother_name as string) || '', v => upd('mother_name', v)))}
                    {field("Mother's Mobile", input('tel', (pi.mother_mobile_no as string) || '', v => upd('mother_mobile_no', v)))}
                    {field("Mother's Email", input('email', (pi.mother_email as string) || '', v => upd('mother_email', v)))}
                    {field("Mother's Occupation", input('text', (pi.mother_occupation as string) || '', v => upd('mother_occupation', v)))}
                </div>
            </div>
            <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Emergency Contact</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {field('Contact Name', input('text', (pi.emergency_contact_name as string) || '', v => upd('emergency_contact_name', v)))}
                    {field('Contact Number', input('tel', (pi.emergency_contact_number as string) || '', v => upd('emergency_contact_number', v)))}
                </div>
            </div>
        </div>
    )
}
