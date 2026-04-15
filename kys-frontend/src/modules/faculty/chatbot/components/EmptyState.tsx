interface EmptyStateProps {
    prompts: string[]
    onPromptClick: (prompt: string) => void
}

export function EmptyState({ prompts, onPromptClick }: EmptyStateProps) {
    return (
        <div className="faculty-chat__empty">
            <p className="faculty-chat__empty-title">Try one of these prompts</p>
            <p className="faculty-chat__empty-sub">Or type your own mentoring question below.</p>
            <div className="faculty-chat__prompts">
                {prompts.map((prompt) => (
                    <button
                        key={prompt}
                        type="button"
                        className="button button--ghost faculty-chat__prompt-btn"
                        onClick={() => onPromptClick(prompt)}
                    >
                        {prompt}
                    </button>
                ))}
            </div>
        </div>
    )
}
