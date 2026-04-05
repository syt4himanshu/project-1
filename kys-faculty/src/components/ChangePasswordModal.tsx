import { useState, FormEvent } from 'react'
import { changePassword } from '../api/auth'

export default function ChangePasswordModal({ onClose }: { onClose: () => void }) {
    const [old_password, setOld] = useState('')
    const [new_password, setNew] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        if (new_password !== confirm) {
            setError('Passwords do not match')
            return
        }
        if (new_password.length < 8) {
            setError('Min 8 characters')
            return
        }
        setLoading(true)
        try {
            await changePassword(old_password, new_password)
            setSuccess('Password changed successfully')
            setTimeout(onClose, 1500)
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
            setError(msg || 'Failed to change password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Change Password</h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl" aria-label="Close">×</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                        <input type="password" required value={old_password} onChange={e => setOld(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                        <input type="password" required value={new_password} onChange={e => setNew(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                        <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-sm">{success}</p>}
                    <button type="submit" disabled={loading}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-lg">
                        {loading ? 'Saving…' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    )
}
