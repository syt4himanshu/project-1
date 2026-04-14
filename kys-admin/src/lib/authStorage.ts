const AUTH_KEYS = ['access_token', 'role', 'username'] as const

export function clearAuthStorage() {
    for (const k of AUTH_KEYS) localStorage.removeItem(k)
}

