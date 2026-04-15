import { useState, type FormEvent } from 'react'
import { Modal } from '../../../shared/ui/modal'

interface ChangePasswordModalProps {
    open: boolean
    isSaving: boolean
    onClose: () => void
    onSubmit: (oldPassword: string, newPassword: string) => void
}

export function ChangePasswordModal({
    open,
    isSaving,
    onClose,
    onSubmit,
}: ChangePasswordModalProps) {
    const [oldPw, setOldPw] = useState('')
    const [newPw, setNewPw] = useState('')
    const [confirm, setConfirm] = useState('')
    const [validationError, setValidationError] = useState('')

    const reset = () => {
        setOldPw('')
        setNewPw('')
        setConfirm('')
        setValidationError('')
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        setValidationError('')

        if (newPw.length < 8) {
            setValidationError('New password must be at least 8 characters.')
            return
        }
        if (newPw !== confirm) {
            setValidationError('Passwords do not match.')
            return
        }

        onSubmit(oldPw, newPw)
    }

    return (
        <Modal open={open} title="Change Password" onClose={handleClose} size="sm">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current password
                    </label>
                    <input
                        type="password"
                        required
                        value={oldPw}
                        onChange={(e) => setOldPw(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        New password
                    </label>
                    <input
                        type="password"
                        required
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm new password
                    </label>
                    <input
                        type="password"
                        required
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>

                {validationError && (
                    <p className="text-sm text-red-500">{validationError}</p>
                )}

                <div className="flex gap-3 pt-1">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSaving}
                        className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg"
                    >
                        {isSaving ? 'Saving…' : 'Change password'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}
