import type { ScopeMode } from '../types'

interface ScopeToggleProps {
    value: ScopeMode
    onChange: (mode: ScopeMode) => void
}

const buttonBase = 'px-3 py-2 rounded text-sm font-medium border transition'

export function ScopeToggle({ value, onChange }: ScopeToggleProps) {
    return (
        <div className="grid grid-cols-2 gap-2">
            <button
                type="button"
                onClick={() => onChange('all')}
                className={`${buttonBase} ${value === 'all'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-700'
                    : 'bg-white text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
                    }`}
                aria-pressed={value === 'all'}
            >
                All assigned
            </button>
            <button
                type="button"
                onClick={() => onChange('student')}
                className={`${buttonBase} ${value === 'student'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-700'
                    : 'bg-white text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
                    }`}
                aria-pressed={value === 'student'}
            >
                Single student
            </button>
        </div>
    )
}
