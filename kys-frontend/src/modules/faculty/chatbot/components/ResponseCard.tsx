import { memo, useState } from 'react'

interface ResponseCardProps {
    title: string
    content: string
}

function ResponseCardImpl({ title, content }: ResponseCardProps) {
    const [collapsed, setCollapsed] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(content).catch(() => { })
    }

    return (
        <section className="faculty-response-card">
            <header className="faculty-response-card__header">
                <h3 className="faculty-response-card__title">{title}</h3>
                <div className="faculty-response-card__actions">
                    <button type="button" className="faculty-response-card__btn" onClick={handleCopy}>
                        Copy
                    </button>
                    <button
                        type="button"
                        className="faculty-response-card__btn"
                        onClick={() => setCollapsed((p) => !p)}
                    >
                        {collapsed ? 'Expand' : 'Collapse'}
                    </button>
                </div>
            </header>
            {!collapsed && (
                <div className="faculty-response-card__body">
                    <p className="faculty-prewrap">
                        {content || 'No specific points returned.'}
                    </p>
                </div>
            )}
        </section>
    )
}

export const ResponseCard = memo(ResponseCardImpl)
