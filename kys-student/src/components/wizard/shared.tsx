import { ReactNode } from 'react'

export interface WizardStepProps {
    data: Record<string, unknown>
    update: (patch: Record<string, unknown>) => void
}

const inputCls = 'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'

export function field(label: string, children: ReactNode) {
    return (
        <div key={label}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
            {children}
        </div>
    )
}

export function input(type: string, value: string, onChange: (v: string) => void, placeholder?: string) {
    return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
}

export function select(options: string[], value: string, onChange: (v: string) => void) {
    return (
        <select value={value} onChange={e => onChange(e.target.value)} className={inputCls}>
            <option value="">Select…</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    )
}
