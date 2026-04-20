import type { ReactNode } from 'react'

export interface WizardStepProps {
    data: Record<string, unknown>
    update: (patch: Record<string, unknown>) => void
}

// Runtime placeholder so non-type imports of `WizardStepProps` do not crash in the browser.
export const WizardStepProps = null as unknown as WizardStepProps

export const inputCls =
    'w-full rounded-xl border border-[#cfd7e4] bg-white dark:bg-[#1e293b] px-4 py-2.5 text-sm text-slate-900 dark:text-white shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-[#3e5f93] focus:ring-2 focus:ring-[#3e5f93]/20'

export const textareaCls =
    'w-full rounded-xl border border-[#cfd7e4] bg-white dark:bg-[#1e293b] px-4 py-2.5 text-sm text-slate-900 dark:text-white shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-[#3e5f93] focus:ring-2 focus:ring-[#3e5f93]/20'

export const sectionCardCls = 'rounded-2xl border border-[#d6deea] dark:border-[#334155] bg-[#f7f9fc] dark:bg-[#1e293b] p-4 sm:p-5'

export function field(label: string, children: ReactNode) {
    const isRequired = label.includes('*')
    const cleanLabel = label.replace(/\s*\*\s*/g, ' ').trim()

    return (
        <div key={label}>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-[#5f6f86]">
                {cleanLabel}
                {isRequired && <span className="ml-1 text-[#dc2626]">*</span>}
            </label>
            {children}
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
