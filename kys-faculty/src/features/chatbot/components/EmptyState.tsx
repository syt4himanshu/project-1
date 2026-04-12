interface EmptyStateProps {
    prompts: string[]
    onPromptClick: (prompt: string) => void
}

export function EmptyState({ prompts, onPromptClick }: EmptyStateProps) {
    return (
        <div className="max-w-3xl rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-6">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Try one of these prompts</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Choose a prompt or type your own mentoring question.</p>
            <div className="mt-3 grid gap-2">
                {prompts.map((prompt) => (
                    <button
                        key={prompt}
                        type="button"
                        onClick={() => onPromptClick(prompt)}
                        className="text-left px-3 py-2 rounded border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 text-sm text-gray-700 dark:text-gray-200"
                    >
                        {prompt}
                    </button>
                ))}
            </div>
        </div>
    )
}
