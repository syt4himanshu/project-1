import { useState, type FormEvent } from 'react'
import type { AddMinuteInput } from '../api/types'

interface MentoringMinuteFormProps {
    isSaving: boolean
    onSubmit: (data: AddMinuteInput) => void
}

export function MentoringMinuteForm({ isSaving, onSubmit }: MentoringMinuteFormProps) {
    const [remarks, setRemarks] = useState('')
    const [suggestion, setSuggestion] = useState('')
    const [action, setAction] = useState('')

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!remarks.trim()) return
        onSubmit({
            remarks: remarks.trim(),
            suggestion: suggestion.trim() || undefined,
            action: action.trim() || undefined,
        })
        setRemarks('')
        setSuggestion('')
        setAction('')
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Remarks <span className="text-red-500">*</span>
                </label>
                <textarea
                    required
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Session notes, concerns, progress…"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Suggestion
                </label>
                <textarea
                    rows={2}
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Action
                </label>
                <textarea
                    rows={2}
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
            </div>
            <button
                type="submit"
                disabled={isSaving || !remarks.trim()}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg"
            >
                {isSaving ? 'Saving…' : 'Save minute'}
            </button>
        </form>
    )
}
