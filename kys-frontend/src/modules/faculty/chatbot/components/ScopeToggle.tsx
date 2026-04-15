import type { ScopeMode } from '../types'

interface ScopeToggleProps {
    value: ScopeMode
    onChange: (mode: ScopeMode) => void
}

export function ScopeToggle({ value, onChange }: ScopeToggleProps) {
    return (
        <div className="modal-switch">
            <button
                type="button"
                className={`modal-switch__item${value === 'all' ? ' active' : ''}`}
                onClick={() => onChange('all')}
                aria-pressed={value === 'all'}
            >
                All assigned
            </button>
            <button
                type="button"
                className={`modal-switch__item${value === 'student' ? ' active' : ''}`}
                onClick={() => onChange('student')}
                aria-pressed={value === 'student'}
            >
                Single student
            </button>
        </div>
    )
}
