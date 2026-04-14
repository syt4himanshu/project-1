const AUTH_KEYS = ['access_token', 'user', 'role'] as const

export function clearAuthStorage() {
    for (const k of AUTH_KEYS) localStorage.removeItem(k)
}

