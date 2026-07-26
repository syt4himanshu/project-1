import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { uploadProfilePhoto } from '../../api/student'
import { useStudentProfileDraft } from '../../hooks/useStudentProfileWizard'
import { field, input, inputCls, select, sectionCardCls, textareaCls } from './shared'

export default function Step1Personal() {
    const { data, update, getFieldValidation, error } = useStudentProfileDraft()
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

    const getValidation = (fieldName: string, joiPath: string) => {
        const joiVal = getFieldValidation(joiPath)
        if (joiVal.error && joiVal.touched) {
            return joiVal
        }
        if (error && error.includes(fieldName)) {
            return {
                error: `${fieldName} is required`,
                touched: true
            }
        }
        return joiVal
    }

    const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
            setUploadMsg('Image size must be less than 2MB.')
            e.target.value = ''
            return
        }

        setUploading(true)
        setUploadMsg('Uploading photo...')
        try {
            const response = await uploadProfilePhoto(file)
            update({
                personal_info: {
                    ...pi,
                    photoUrl: response.data?.photoUrl || '',
                    photo_public_id: response.data?.photo_public_id || ''
                }
            })
            setUploadMsg('Photo uploaded successfully.')
        } catch (error) {
            console.error('[UPLOAD] Upload failed:', error)
            setUploadMsg('Failed to upload photo. You can try again later.')
        } finally {
            setUploading(false)
            e.target.value = ''
        }
    }

    return (
        <div className="space-y-5">
            <section className={sectionCardCls}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                    {field('Full Name *', input('text', (data.full_name as string) || '', v => update({ full_name: v }), 'Enter full name', getValidation('Full Name', 'full_name')))}
                    {field('Section *', select(['A', 'B'], (data.section as string) || '', v => update({ section: v }), 'Select Section', getValidation('Section', 'section')))}

                    {field('Semester *', select(
                        ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'],
                        data.semester ? `Semester ${data.semester}` : '',
                        handleSemesterChange,
                        'Select Semester',
                        getValidation('Semester', 'semester')
                    ))}
                    {field('Year of Admission', input('number', String(data.year_of_admission || ''), v => update({ year_of_admission: v ? Number(v) : null }), 'e.g. 2023'))}

                    {field('Date of Birth *', input('date', (pi.dob as string) || '', v => upd('dob', v), 'dd-mm-yyyy', getValidation('Date of Birth', 'personal_info.dob')))}
                    {field('Gender *', select(['Male', 'Female', 'Other'], (pi.gender as string) || '', v => upd('gender', v), 'Select Gender', getValidation('Gender', 'personal_info.gender')))}

                    {field('Blood Group', select(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], (pi.blood_group as string) || '', v => upd('blood_group', v), 'Select Blood Group'))}
                    {field('Category *', select(['General', 'OBC', 'SC', 'ST', 'NT', 'EWS'], (pi.category as string) || '', v => upd('category', v), 'Select Category', getValidation('Category', 'personal_info.category')))}

                    {field('Aadhar Card Number', input('text', (pi.aadhar_number as string) || '', v => upd('aadhar_number', v), 'e.g. 123412341234', getFieldValidation('personal_info.aadhar_number')))}
                    {field('MIS UID *', input('text', (pi.mis_uid as string) || '', v => upd('mis_uid', v), 'e.g. 240030**', getValidation('MIS UID', 'personal_info.mis_uid')))}

                    {field('WhatsApp Mobile No. *', input('tel', (pi.mobile_no as string) || '', v => upd('mobile_no', v), 'e.g. 9876543210', getValidation('WhatsApp Mobile No.', 'personal_info.mobile_no')))}
                    {field('Personal Email *', input('email', (pi.personal_email as string) || '', v => upd('personal_email', v), 'e.g. student@example.com', getValidation('Personal Email', 'personal_info.personal_email')))}

                    {field('College Email (Professional) *', input('email', (pi.college_email as string) || '', v => upd('college_email', v), 'e.g. student@college.edu', getValidation('College Email (Professional)', 'personal_info.college_email')))}
                    {field('LinkedIn ID', input('url', (pi.linked_in_id as string) || '', v => upd('linked_in_id', v), 'https://linkedin.com/in/username'))}

                    {field('GitHub ID', input('url', (pi.github_id as string) || '', v => upd('github_id', v), 'https://github.com/username'))}
                </div>
            </section>

            <section className={sectionCardCls}>
                <h3 className="mb-4 border-b border-[#c9d6ea] pb-2 text-2xl font-semibold text-[#223b60]">Parent&apos;s Information</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                    {field("Father's Name *", input('text', (pi.father_name as string) || '', v => upd('father_name', v), 'Enter father name', getValidation("Father's Name", 'personal_info.father_name')))}
                    {field("Father's WhatsApp Mobile No. *", input('tel', (pi.father_mobile_no as string) || '', v => upd('father_mobile_no', v), 'e.g. 9876543210', getValidation("Father's WhatsApp Mobile No.", 'personal_info.father_mobile_no')))}
                    {field("Father's Email ID", input('email', (pi.father_email as string) || '', v => upd('father_email', v), 'e.g. parent@example.com', getFieldValidation('personal_info.father_email')))}
                    {field("Father's Occupation *", input('text', (pi.father_occupation as string) || '', v => upd('father_occupation', v), 'Enter occupation', getValidation("Father's Occupation", 'personal_info.father_occupation')))}

                    {field("Mother's Name *", input('text', (pi.mother_name as string) || '', v => upd('mother_name', v), 'Enter mother name', getValidation("Mother's Name", 'personal_info.mother_name')))}
                    {field("Mother's WhatsApp Mobile No. *", input('tel', (pi.mother_mobile_no as string) || '', v => upd('mother_mobile_no', v), 'e.g. 9876543210', getValidation("Mother's WhatsApp Mobile No.", 'personal_info.mother_mobile_no')))}
                    {field("Mother's Email ID", input('email', (pi.mother_email as string) || '', v => upd('mother_email', v), 'e.g. parent@example.com', getFieldValidation('personal_info.mother_email')))}
                    {field("Mother's Occupation *", input('text', (pi.mother_occupation as string) || '', v => upd('mother_occupation', v), 'Enter occupation', getValidation("Mother's Occupation", 'personal_info.mother_occupation')))}
                </div>

                <div className="mt-5 rounded-2xl border border-[#d6deea] bg-[#f7f9fc] p-4 sm:p-5">
                    <h3 className="mb-4 border-b border-[#c9d6ea] pb-2 text-2xl font-semibold text-[#223b60]">Local Guardian Details</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                        {field('Local Guardian Name', input('text', (pi.guardian_name as string) || '', v => upd('guardian_name', v), 'Enter guardian name'))}
                        {field('Local Guardian Mobile Number', input('tel', (pi.guardian_mobile as string) || '', v => upd('guardian_mobile', v), 'e.g. 9876543210', getFieldValidation('personal_info.guardian_mobile')))}
                        {field('Local Guardian Email ID', input('email', (pi.guardian_email as string) || '', v => upd('guardian_email', v), 'e.g. guardian@example.com', getFieldValidation('personal_info.guardian_email')))}
                    </div>
                </div>
            </section>

            <div className="space-y-4">
                {field('Permanent Address *', (
                    <div className="space-y-1">
                        <textarea
                            value={(pi.permanent_address as string) || ''}
                            onChange={e => upd('permanent_address', e.target.value)}
                            rows={4}
                            placeholder="Street, City, State, PIN"
                            className={`${textareaCls} ${getValidation('Permanent Address', 'personal_info.permanent_address').error && getValidation('Permanent Address', 'personal_info.permanent_address').touched ? 'border-[#ef4444] focus:border-[#dc2626] focus:ring-[#ef4444]/20' : ''}`}
                        />
                        {getValidation('Permanent Address', 'personal_info.permanent_address').error && getValidation('Permanent Address', 'personal_info.permanent_address').touched && (
                            <p className="text-xs font-medium text-[#dc2626]">{getValidation('Permanent Address', 'personal_info.permanent_address').error}</p>
                        )}
                    </div>
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
                {(pi.photoUrl as string) ? (
                    <div className="mb-3 flex flex-col items-start gap-3 rounded-2xl border border-[#d9e1ec] bg-white p-3 sm:flex-row sm:items-center">
                        <img
                            src={String(pi.photoUrl)}
                            alt="Uploaded student profile"
                            className="rounded-xl border border-[#d9e1ec] object-cover"
                            style={{ width: '96px', height: '96px', flexShrink: 0 }}
                        />
                        <div className="w-full min-w-0">
                            <p className="text-sm font-medium text-[#32435f]">Current uploaded photo</p>
                            <a className="break-words text-sm text-[#2b5fa6] underline" href={String(pi.photoUrl)} target="_blank" rel="noreferrer">
                                Open uploaded image
                            </a>
                        </div>
                    </div>
                ) : (
                    <p className="mb-2 text-sm text-[#7a879c]">No photo uploaded yet.</p>
                )}
                <p className="mb-2 text-xs text-[#8796ac]">Upload only if you want to add/replace your photo. Max size: 2MB.</p>
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
