import React, { type ReactNode } from 'react'


export interface WizardStepProps {
    data: Record<string, unknown>
    update: (patch: Record<string, unknown>) => void
}

export interface FieldValidationState {
    error?: string
    touched?: boolean
}

// Runtime placeholder so non-type imports of `WizardStepProps` do not crash in the browser.
export const WizardStepProps = null as unknown as WizardStepProps

export const inputCls =
    'w-full rounded-xl border border-[#cfd7e4] bg-white dark:bg-[#1e293b] px-4 py-2.5 text-sm text-slate-900 dark:text-white shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-[#3e5f93] focus:ring-2 focus:ring-[#3e5f93]/20'

export const textareaCls =
    'w-full rounded-xl border border-[#cfd7e4] bg-white dark:bg-[#1e293b] px-4 py-2.5 text-sm text-slate-900 dark:text-white shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-[#3e5f93] focus:ring-2 focus:ring-[#3e5f93]/20'

export const sectionCardCls = 'rounded-2xl border border-[#d6deea] dark:border-[#334155] bg-[#f7f9fc] dark:bg-[#1e293b] p-4 sm:p-5'

function withValidationClass(baseClass: string, validation?: FieldValidationState) {
    if (!validation?.error) return baseClass
    return `${baseClass} border-[#ef4444] focus:border-[#dc2626] focus:ring-[#ef4444]/20`
}

function formatValidationMessage(message?: string) {
    if (!message) return ''
    return message.replace(/^[a-z0-9_]+(?:\.[a-z0-9_]+)+\s+/i, '')
}

export function field(label: string, children: ReactNode) {
    const isRequired = label.includes('*')
    const cleanLabel = label.replace(/\s*\*\s*/g, ' ').trim()

    return (
        <div key={label}>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-[#5f6f86]">
                {cleanLabel}
                {isRequired && <span className="ml-1" style={{ color: 'var(--danger)' }}>*</span>}
            </label>
            {children}
        </div>
    )
}

export function input(
    type: string,
    value: string,
    onChange: (v: string) => void,
    placeholder?: string,
    validation?: FieldValidationState,
) {
    const isNumber = type === 'number'
    const isDate = type === 'date'
    const combinedClassName = `${withValidationClass(inputCls, validation)} ${isNumber ? 'no-spinner' : ''}`.trim()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        // For date inputs, reject any value where the year part exceeds 4 digits.
        // Native date inputs return YYYY-MM-DD; we guard against browsers allowing
        // the user to type e.g. "202565" in the year segment.
        if (isDate && val) {
            const year = val.split('-')[0]
            if (year && year.length > 4) return
        }
        onChange(val)
    }

    return (
        <div className="space-y-1">
            <input
                type={type}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className={combinedClassName}
                aria-invalid={Boolean(validation?.error)}
                onWheel={isNumber ? e => e.currentTarget.blur() : undefined}
                {...(isDate ? { max: '9999-12-31' } : {})}
            />
            {validation?.error && validation.touched && (
                <p className="text-xs font-medium" style={{ color: 'var(--danger)' }}>{formatValidationMessage(validation.error)}</p>
            )}
        </div>
    )
}


export function select(
    options: string[],
    value: string,
    onChange: (v: string) => void,
    placeholder = 'Select...',
    validation?: FieldValidationState,
) {
    return (
        <div className="space-y-1">
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className={withValidationClass(inputCls, validation)}
                aria-invalid={Boolean(validation?.error)}
            >
                <option value="">{placeholder}</option>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            {validation?.error && validation.touched && (
                <p className="text-xs font-medium" style={{ color: 'var(--danger)' }}>{formatValidationMessage(validation.error)}</p>
            )}
        </div>
    )
}
