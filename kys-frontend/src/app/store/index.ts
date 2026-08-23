import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
} from '@reduxjs/toolkit'
import facultyChatReducer from '../../modules/faculty/store/facultyChatSlice'
import studentProfileReducer from '../../modules/student/store/studentProfileSlice'
import authReducer from './authSlice'
import toastReducer, { dismissToast, enqueueToast } from './toastSlice'

const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
  actionCreator: enqueueToast,
  effect: async (action, listenerApi) => {
    await listenerApi.delay(action.payload.durationMs)
    listenerApi.dispatch(dismissToast(action.payload.id))
  },
})

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
