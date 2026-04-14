import { WizardStepProps, field, input, sectionCardCls } from './shared'

export default function Step2Parents({ data, update }: WizardStepProps) {
    const pi = (data.personal_info as Record<string, unknown>) || {}
    const upd = (k: string, v: unknown) => update({ personal_info: { ...pi, [k]: v } })

    return (
        <div className="space-y-5">
            <section className={sectionCardCls}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                    {field("Father's Name *", input('text', (pi.father_name as string) || '', v => upd('father_name', v), 'Enter father name'))}
                    {field("Father's WhatsApp Mobile No. *", input('tel', (pi.father_mobile_no as string) || '', v => upd('father_mobile_no', v), 'e.g. 9876543210'))}
                    {field("Father's Email ID", input('email', (pi.father_email as string) || '', v => upd('father_email', v), 'e.g. parent@example.com'))}
                    {field("Father's Occupation *", input('text', (pi.father_occupation as string) || '', v => upd('father_occupation', v), 'Enter occupation'))}

                    {field("Mother's Name *", input('text', (pi.mother_name as string) || '', v => upd('mother_name', v), 'Enter mother name'))}
                    {field("Mother's WhatsApp Mobile No. *", input('tel', (pi.mother_mobile_no as string) || '', v => upd('mother_mobile_no', v), 'e.g. 9876543210'))}
                    {field("Mother's Email ID", input('email', (pi.mother_email as string) || '', v => upd('mother_email', v), 'e.g. parent@example.com'))}
                    {field("Mother's Occupation *", input('text', (pi.mother_occupation as string) || '', v => upd('mother_occupation', v), 'Enter occupation'))}
                </div>
            </section>

            <section className={sectionCardCls}>
                <h3 className="mb-4 border-b border-[#c9d6ea] pb-2 text-2xl font-semibold text-[#223b60]">Local Guardian Details</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                    {field('Local Guardian Name', input('text', (pi.guardian_name as string) || '', v => upd('guardian_name', v), 'Enter guardian name'))}
                    {field('Local Guardian Mobile Number', input('tel', (pi.guardian_mobile as string) || '', v => upd('guardian_mobile', v), 'e.g. 9876543210'))}
                    {field('Local Guardian Email ID', input('email', (pi.guardian_email as string) || '', v => upd('guardian_email', v), 'e.g. guardian@example.com'))}
                </div>
            </section>
        </div>
    )
}
