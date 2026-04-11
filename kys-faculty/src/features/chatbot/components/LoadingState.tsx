import { SECTION_ORDER } from '../constants'

interface LoadingStateProps {
    title?: string
    subtitle?: string
}

export function LoadingState({
    title = 'Assistant is typing...',
    subtitle,
}: LoadingStateProps) {
    return (
        <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{title}</p>
            {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {SECTION_ORDER.map((section) => (
                    <div
                        key={section}
                        className="h-24 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800 animate-pulse"
                    />
                ))}
            </div>
        </div>
    )
}
