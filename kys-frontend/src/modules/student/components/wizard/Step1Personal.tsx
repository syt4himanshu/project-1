<<<<<<< HEAD
import { useState } from 'react'
import type { ChangeEvent } from 'react'
=======
import type { ChangeEvent } from 'react'
import { useState } from 'react'
>>>>>>> f6aeb48 (production build changes are done.)
import { uploadProfilePhoto } from '../../api/student'
import { WizardStepProps, field, input, inputCls, select, textareaCls } from './shared'

export default function Step1Personal({ data, update }: WizardStepProps) {
    const pi = (data.personal_info as Record<string, unknown>) || {}
    const postAdmissionRecords = (data.post_admission_records as Record<string, unknown>[]) || []
    const upd = (k: string, v: unknown) => update({ personal_info: { ...pi, [k]: v } })

    const handleSemesterChange = (value: string) => {
        const semester = value ? Number(value.replace('Semester ', '')) : null
        const filteredRecords = semester
            ? postAdmissionRecords.filter(record => Number(record.semester) < semester)
            : postAdmissionRecords

        update({
            semester,
            post_admission_records: filteredRecords,
        })
    }

    const [uploading, setUploading] = useState(false)
    const [uploadMsg, setUploadMsg] = useState('')

    const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        setUploadMsg('')
        try {
            const response = await uploadProfilePhoto(file)
            upd('photo_url', response.data?.photo_url || '')
            upd('photo_public_id', response.data?.photo_public_id || '')
            setUploadMsg('Photo uploaded successfully.')
        } catch {
            setUploadMsg('Failed to upload photo. You can try again later.')
        } finally {
            setUploading(false)
            e.target.value = ''
        }
    }

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                {field('Full Name *', input('text', (data.full_name as string) || '', v => update({ full_name: v }), 'Enter full name'))}
                {field('Section', select(['A', 'B'], (data.section as string) || '', v => update({ section: v }), 'Select Section'))}

                {field('Semester', select(
                    ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'],
                    data.semester ? `Semester ${data.semester}` : '',
                    handleSemesterChange,
                    'Select Semester',
                ))}
                {field('Year of Admission', input('number', String(data.year_of_admission || ''), v => update({ year_of_admission: v ? Number(v) : null }), 'e.g. 2023'))}

                {field('Date of Birth *', input('date', (pi.dob as string) || '', v => upd('dob', v), 'dd-mm-yyyy'))}
                {field('Gender *', select(['Male', 'Female', 'Other'], (pi.gender as string) || '', v => upd('gender', v), 'Select Gender'))}

                {field('Blood Group', select(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], (pi.blood_group as string) || '', v => upd('blood_group', v), 'Select Blood Group'))}
                {field('Category', select(['General', 'OBC', 'SC', 'ST', 'NT', 'EWS'], (pi.category as string) || '', v => upd('category', v), 'Select Category'))}

                {field('Aadhar Card Number', input('text', (pi.aadhar_number as string) || '', v => upd('aadhar_number', v), 'e.g. 123412341234'))}
                {field('MIS UID', input('text', (pi.mis_uid as string) || '', v => upd('mis_uid', v), 'e.g. 240030**'))}

                {field('WhatsApp Mobile No. *', input('tel', (pi.mobile_no as string) || '', v => upd('mobile_no', v), 'e.g. 9876543210'))}
                {field('Personal Email *', input('email', (pi.personal_email as string) || '', v => upd('personal_email', v), 'e.g. student@example.com'))}

                {field('College Email (Professional) *', input('email', (pi.college_email as string) || '', v => upd('college_email', v), 'e.g. student@college.edu'))}
                {field('LinkedIn ID', input('url', (pi.linked_in_id as string) || '', v => upd('linked_in_id', v), 'https://linkedin.com/in/username'))}

                {field('GitHub ID', input('url', (pi.github_id as string) || '', v => upd('github_id', v), 'https://github.com/username'))}
            </div>

            <div className="space-y-4">
                {field('Permanent Address *', (
                    <textarea
                        value={(pi.permanent_address as string) || ''}
                        onChange={e => upd('permanent_address', e.target.value)}
                        rows={4}
                        placeholder="Street, City, State, PIN"
                        className={textareaCls}
                    />
                ))}

                {field('Present Address', (
                    <textarea
                        value={(pi.present_address as string) || ''}
                        onChange={e => upd('present_address', e.target.value)}
                        rows={4}
                        placeholder="Current address"
                        className={textareaCls}
                    />
                ))}
            </div>

            <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-[#5f6f86]">Passport Size Photo</label>
                {(pi.photo_url as string) ? (
                    <p className="mb-2 text-sm text-[#5f6f86]">
                        Existing photo:{' '}
                        <a className="text-[#2b5fa6] underline" href={String(pi.photo_url)} target="_blank" rel="noreferrer">
                            Open uploaded image
                        </a>
                    </p>
                ) : (
                    <p className="mb-2 text-sm text-[#7a879c]">No photo uploaded yet.</p>
                )}
                <p className="mb-2 text-xs text-[#8796ac]">Upload only if you want to add/replace your photo.</p>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                    className={`${inputCls} file:mr-3 file:rounded-lg file:border-0 file:bg-[#1f355f] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white`}
                />
                {uploadMsg && <p className="mt-2 text-sm text-[#5f6f86]">{uploadMsg}</p>}
            </div>
        </div>
    )
}
