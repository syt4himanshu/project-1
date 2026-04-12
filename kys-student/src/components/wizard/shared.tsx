import { ReactNode } from 'react'

export interface WizardStepProps {
    data: Record<string, unknown>
    update: (patch: Record<string, unknown>) => void
    /** Dot-path keys from Zod (e.g. `personal_info.personal_email`) */
    fieldErrors?: Record<string, string>
}

export const inputCls =
    'w-full rounded-xl border border-[#cfd7e4] bg-white px-4 py-2.5 text-sm text-[#26364d] shadow-sm placeholder:text-[#97a4b8] outline-none transition focus:border-[#3e5f93] focus:ring-2 focus:ring-[#3e5f93]/20'

export const textareaCls =
    'w-full rounded-xl border border-[#cfd7e4] bg-white px-4 py-2.5 text-sm text-[#26364d] shadow-sm placeholder:text-[#97a4b8] outline-none transition focus:border-[#3e5f93] focus:ring-2 focus:ring-[#3e5f93]/20'

export const sectionCardCls = 'rounded-2xl border border-[#d6deea] bg-[#f7f9fc] p-4 sm:p-5'

export function field(label: string, children: ReactNode, fieldError?: string) {
    const isRequired = label.includes('*')
    const cleanLabel = label.replace(/\s*\*\s*/g, ' ').trim()

    return (
        <div key={label}>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-[#5f6f86]">
                {cleanLabel}
                {isRequired && <span className="ml-1 text-[#dc2626]">*</span>}
            </label>
            {children}
            {fieldError ? <p className="mt-1 text-xs font-medium text-[#b91c1c]">{fieldError}</p> : null}
        </div>
    )
}

export function input(type: string, value: string, onChange: (v: string) => void, placeholder?: string) {
    return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
}

export function select(options: string[], value: string, onChange: (v: string) => void, placeholder = 'Select...') {
    return (
        <select value={value} onChange={e => onChange(e.target.value)} className={inputCls}>
            <option value="">{placeholder}</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    )
}
