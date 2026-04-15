import { useState, type FormEvent } from 'react'
import type { FacultyProfile } from '../api/types'

interface FacultyProfileFormProps {
    profile: FacultyProfile
    isSaving: boolean
    onSubmit: (data: Pick<FacultyProfile, 'first_name' | 'last_name' | 'contact_number'>) => void
}

export function FacultyProfileForm({ profile, isSaving, onSubmit }: FacultyProfileFormProps) {
    const [firstName, setFirstName] = useState(profile.first_name)
    const [lastName, setLastName] = useState(profile.last_name)
    const [contact, setContact] = useState(profile.contact_number ?? '')

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        onSubmit({
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            contact_number: contact.trim() || null,
        })
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
        >
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First name
                </label>
                <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last name
                </label>
                <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact number
                </label>
                <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
            </div>
            <button
                type="submit"
                disabled={isSaving}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-lg"
            >
                {isSaving ? 'Saving…' : 'Save changes'}
            </button>
        </form>
    )
}
