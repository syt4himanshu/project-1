/* eslint-disable react-refresh/only-export-components */
import React, { type ReactNode, useState, useRef, useEffect } from 'react'


export interface WizardStepProps {
    data: Record<string, unknown>
    update: (patch: Record<string, unknown>) => void
}

export interface FieldValidationState {
    error?: string
    touched?: boolean
    markTouched?: () => void
}

// Runtime placeholder so non-type imports of `WizardStepProps` do not crash in the browser.
export const WizardStepProps = null as unknown as WizardStepProps

export const inputCls =
    'w-full rounded-xl border border-[#cfd7e4] bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-[#3e5f93] focus:ring-2 focus:ring-[#3e5f93]/20'

export const textareaCls =
    'w-full rounded-xl border border-[#cfd7e4] bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-[#3e5f93] focus:ring-2 focus:ring-[#3e5f93]/20'

export const sectionCardCls = 'rounded-2xl border border-[#d6deea] dark:border-[#334155] bg-[#f7f9fc] dark:bg-slate-800 p-4 sm:p-5'

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
        if (isDate && val) {
            const year = val.split('-')[0]
            if (year && year.length > 4) return
        }
        onChange(val)
        validation?.markTouched?.()
    }

    const handleBlur = () => {
        validation?.markTouched?.()
    }

    return (
        <div className="space-y-1">
            <input
                type={type}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
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
                onChange={e => {
                    onChange(e.target.value)
                    validation?.markTouched?.()
                }}
                onBlur={() => validation?.markTouched?.()}
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

export function SearchableSelectComponent({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    validation
}: {
    options: string[]
    value: string
    onChange: (v: string) => void
    placeholder?: string
    validation?: FieldValidationState
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                validation?.markTouched?.()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [validation])

    const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="space-y-1 relative" ref={containerRef}>
            <div 
                className={`${withValidationClass(inputCls, validation)} wizard-search-trigger flex items-center justify-between cursor-pointer`}
                onClick={() => {
                    setIsOpen(!isOpen)
                    if (!isOpen) setSearch('')
                }}
            >
                <span className={`block truncate ${value ? '' : 'text-slate-400 dark:text-slate-500'}`}>{value || placeholder}</span>
                <svg className="h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </div>
            
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-[#cfd7e4] dark:border-[#334155] rounded-xl shadow-lg overflow-hidden">
                    <div className="p-2 border-b border-[#cfd7e4] dark:border-[#334155] bg-white dark:bg-slate-800">
                        <input
                            type="text"
                            className="wizard-search-input w-full rounded-lg px-3 py-2 text-sm outline-none"
                            placeholder="Search..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onClick={e => e.stopPropagation()}
                            autoFocus
                        />
                    </div>
                    <div className="p-1" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                        <div
                            className="wizard-search-option px-3 py-2 text-sm cursor-pointer rounded-lg"
                            onClick={() => {
                                onChange('')
                                setIsOpen(false)
                            }}
                        >
                            {placeholder}
                        </div>
                        {filtered.length > 0 ? filtered.map(o => (
                            <div
                                key={o}
                                className={`wizard-search-option px-3 py-2 text-sm cursor-pointer rounded-lg ${value === o ? 'font-medium' : ''}`}
                                onClick={() => {
                                    onChange(o)
                                    setIsOpen(false)
                                }}
                            >
                                {o}
                            </div>
                        )) : (
                            <div className="px-3 py-2 text-sm text-slate-400 text-center">No results found</div>
                        )}
                    </div>
                </div>
            )}
            {validation?.error && validation.touched && (
                <p className="text-xs font-medium" style={{ color: 'var(--danger)' }}>{formatValidationMessage(validation.error)}</p>
            )}
        </div>
    )
}

export function searchableSelect(
    options: string[],
    value: string,
    onChange: (v: string) => void,
    placeholder = 'Select...',
    validation?: FieldValidationState,
) {
    return <SearchableSelectComponent options={options} value={value} onChange={onChange} placeholder={placeholder} validation={validation} />
}
