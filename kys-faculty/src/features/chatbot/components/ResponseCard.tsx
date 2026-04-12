import { memo, useState } from 'react'

interface ResponseCardProps {
    title: string
    content: string
}

function ResponseCardImpl({ title, content }: ResponseCardProps) {
    const [collapsed, setCollapsed] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(content).catch(() => {
            // Ignore clipboard errors in unsupported or restricted contexts.
        })
    }

    return (
        <section className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <header className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                        Copy
                    </button>
                    <button
                        type="button"
                        onClick={() => setCollapsed((prev) => !prev)}
                        className="text-xs text-gray-600 dark:text-gray-300 hover:underline"
                    >
                        {collapsed ? 'Expand' : 'Collapse'}
                    </button>
                </div>
            </header>
            {!collapsed && (
                <div className="px-3 py-2">
                    <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                        {content || 'No specific points returned.'}
                    </p>
                </div>
            )}
        </section>
    )
}

export const ResponseCard = memo(ResponseCardImpl)
