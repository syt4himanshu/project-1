import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from '@reduxjs/toolkit'
import { clearStoredSession, writeStoredSession } from '../../shared/auth/storage'
import type { AuthSession } from '../../shared/auth/session'
import facultyChatReducer from '../../modules/faculty/store/facultyChatSlice'
import studentProfileReducer from '../../modules/student/store/studentProfileSlice'
import authReducer, {
  authExpired,
  loginWithCredentials,
  logoutCurrentUser,
  refreshAuthSession,
} from './authSlice'
import toastReducer, { dismissToast, enqueueToast } from './toastSlice'

const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
  actionCreator: enqueueToast,
  effect: async (action, listenerApi) => {
    await listenerApi.delay(action.payload.durationMs)
    listenerApi.dispatch(dismissToast(action.payload.id))
  },
})

listenerMiddleware.startListening({
  matcher: isAnyOf(refreshAuthSession.fulfilled, loginWithCredentials.fulfilled),
  effect: async (action) => {
    if (isAuthSession(action.payload)) {
      writeStoredSession(action.payload)
      return
    }

    clearStoredSession()
  },
})

listenerMiddleware.startListening({
  matcher: isAnyOf(logoutCurrentUser.fulfilled, authExpired),
  effect: async () => {
    clearStoredSession()
  },
})

function isAuthSession(value: unknown): value is AuthSession {
  return (
    value !== null
    && typeof value === 'object'
    && 'accessToken' in value
    && 'user' in value
  )
}

const rootReducer = combineReducers({
  auth: authReducer,
  facultyChat: facultyChatReducer,
  studentProfile: studentProfileReducer,
  toasts: toastReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export const createAppStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(listenerMiddleware.middleware),
    preloadedState: preloadedState as RootState | undefined,
  })

export type AppStore = ReturnType<typeof createAppStore>
export type AppDispatch = AppStore['dispatch']
