import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ENDPOINTS } from '../../shared/api/endpointRegistry'
import { requestJson } from '../../shared/api/httpClient'
import { readStoredSession } from '../../shared/auth/storage'
import { isUserRole, type AuthSession, type AuthUser } from '../../shared/auth/session'
import type { RootState } from './index'

interface LoginResponse {
  access_token?: unknown
  role?: unknown
  user?: {
    id?: unknown
    username?: unknown
    role?: unknown
  }
}

interface VerifyResponse {
  valid?: unknown
  user?: {
    id?: unknown
    username?: unknown
    role?: unknown
  }
}

export type AuthStatus = 'bootstrapping' | 'authenticated' | 'anonymous'

interface AuthState {
  status: AuthStatus
  session: AuthSession | null
}

const initialState: AuthState = {
  status: 'bootstrapping',
  session: null,
}

function normalizeUser(raw: VerifyResponse['user'] | LoginResponse['user'] | undefined): AuthUser | null {
  if (!raw) return null
  if (typeof raw.id !== 'number' || !Number.isFinite(raw.id)) return null
  if (typeof raw.username !== 'string' || raw.username.trim() === '') return null
  if (!isUserRole(raw.role)) return null

  return {
    id: raw.id,
    username: raw.username,
    role: raw.role,
  }
}

export const refreshAuthSession = createAsyncThunk(
  'auth/refreshSession',
  async (): Promise<AuthSession | null> => {
    const stored = readStoredSession()

    if (!stored) {
      return null
    }

    try {
      const payload = await requestJson<VerifyResponse>(ENDPOINTS.auth.verify, {
        method: 'GET',
        token: stored.accessToken,
      })

      const isValid = payload.valid === true
      const verifiedUser = normalizeUser(payload.user)
      if (!isValid || !verifiedUser) {
        return null
      }

      return {
        accessToken: stored.accessToken,
        user: verifiedUser,
      }
    } catch {
      return null
    }
  },
)

export const loginWithCredentials = createAsyncThunk(
  'auth/loginWithCredentials',
  async ({ identifier, password }: { identifier: string; password: string }): Promise<AuthSession> => {
    const payload = await requestJson<LoginResponse>(ENDPOINTS.auth.login, {
      method: 'POST',
      body: {
        username: identifier,
        uid: identifier,
        password,
      },
    })

    const accessToken = typeof payload.access_token === 'string' ? payload.access_token : ''
    if (!accessToken) {
      throw new Error('Login response did not include an access token')
    }

    const normalizedUser = normalizeUser(payload.user)

    const roleFromPayload = normalizedUser?.role ?? payload.role
    if (!isUserRole(roleFromPayload)) {
      throw new Error('Login response did not include a valid role')
    }

    return {
      accessToken,
      user: normalizedUser ?? {
        id: 0,
        username: identifier,
        role: roleFromPayload,
      },
    }
  },
)

export const logoutCurrentUser = createAsyncThunk(
  'auth/logoutCurrentUser',
  async (_arg: void, { getState }): Promise<void> => {
    const token = selectAuthToken(getState() as RootState)

    if (!token) return

    try {
      await requestJson<unknown>(ENDPOINTS.auth.logout, {
        method: 'POST',
        token,
      })
    } catch {
      // Ignore logout API failures and clear the session locally.
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authExpired(state) {
      state.session = null
      state.status = 'anonymous'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshAuthSession.fulfilled, (state, action) => {
        state.session = action.payload
        state.status = action.payload ? 'authenticated' : 'anonymous'
      })
      .addCase(loginWithCredentials.fulfilled, (state, action) => {
        state.session = action.payload
        state.status = 'authenticated'
      })
      .addCase(logoutCurrentUser.fulfilled, (state) => {
        state.session = null
        state.status = 'anonymous'
      })
  },
})

export const { authExpired } = authSlice.actions

export const selectAuthState = (state: RootState) => state.auth
export const selectAuthStatus = (state: RootState) => state.auth.status
export const selectAuthSession = (state: RootState) => state.auth.session
export const selectAuthUser = (state: RootState) => state.auth.session?.user ?? null
export const selectAuthToken = (state: RootState) => state.auth.session?.accessToken ?? null

export default authSlice.reducer
