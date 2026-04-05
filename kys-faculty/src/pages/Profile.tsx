import { FormEvent, useEffect, useState } from 'react'
import { getProfile, updateProfile } from '../api/faculty'
import ChangePasswordModal from '../components/ChangePasswordModal'

interface FacultyProfile {
    first_name: string
    last_name: string
    email: string
    contact_number?: string | null
}

export default function Profile() {
    const [profile, setProfile] = useState<FacultyProfile | null>(null)
    const [first_name, setFirst] = useState('')
    const [last_name, setLast] = useState('')
    const [contact_number, setContact] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [showPw, setShowPw] = useState(false)

    useEffect(() => {
        getProfile()
            .then((res) => {
                const p = res.data as FacultyProfile
                setProfile(p)
                setFirst(p.first_name || '')
                setLast(p.last_name || '')
                setContact(p.contact_number || '')
            })
            .catch(() => setError('Could not load profile'))
            .finally(() => setLoading(false))
    }, [])

    const handleSave = async (e: FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage('')
        setError('')
        try {
            await updateProfile({ first_name, last_name, contact_number })
            setMessage('Profile updated')
            const res = await getProfile()
            setProfile(res.data as FacultyProfile)
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
            setError(msg || 'Update failed')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <p className="text-gray-500 dark:text-gray-400">Loading profile…</p>
    }

    return (
        <div className="max-w-lg space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My profile</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Faculty details from the KYS directory</p>
            </div>

            {profile && (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-sm">
                    <p className="text-gray-500 dark:text-gray-400">Login email (read-only)</p>
                    <p className="font-medium text-gray-900 dark:text-white mt-1">{profile.email}</p>
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First name</label>
                    <input
                        value={first_name}
                        onChange={e => setFirst(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last name</label>
                    <input
                        value={last_name}
                        onChange={e => setLast(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact number</label>
                    <input
                        value={contact_number}
                        onChange={e => setContact(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                {message && <p className="text-green-600 text-sm">{message}</p>}
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-lg"
                >
                    {saving ? 'Saving…' : 'Save changes'}
                </button>
            </form>

            <button
                type="button"
                onClick={() => setShowPw(true)}
                className="w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium"
            >
                Change password
            </button>

            {showPw && <ChangePasswordModal onClose={() => setShowPw(false)} />}
        </div>
    )
}
