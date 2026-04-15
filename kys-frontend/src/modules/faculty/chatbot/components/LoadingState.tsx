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
        <div className="faculty-chat__loading">
            <p className="faculty-chat__loading-title">{title}</p>
            {subtitle && <p className="faculty-chat__loading-sub">{subtitle}</p>}
            <div className="faculty-response-grid">
                {SECTION_ORDER.map((section) => (
                    <div key={section} className="faculty-response-card faculty-response-card--skeleton" />
                ))}
            </div>
        </div>
    )
}
