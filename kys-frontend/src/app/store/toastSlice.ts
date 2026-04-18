import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type { ToastInput, ToastIntent } from '../providers/toast-context'
import type { RootState } from './index'

export interface ToastRecord {
  id: string
  title: string
  message: string
  intent: ToastIntent
  durationMs: number
}

interface ToastState {
  items: ToastRecord[]
}

const initialState: ToastState = {
  items: [],
}

function clampDuration(durationMs: number | undefined): number {
  if (typeof durationMs !== 'number' || !Number.isFinite(durationMs)) return 4_000
  return Math.min(15_000, Math.max(1_500, Math.floor(durationMs)))
}

const toastSlice = createSlice({
  name: 'toasts',
  initialState,
  reducers: {
    enqueueToast: {
      reducer(state, action: PayloadAction<ToastRecord>) {
        state.items.push(action.payload)
      },
      prepare(toast: ToastInput) {
        return {
          payload: {
            id: nanoid(),
            title: toast.title?.trim() || 'Notice',
            message: toast.message.trim() || 'Action completed.',
            intent: toast.intent ?? 'info',
            durationMs: clampDuration(toast.durationMs),
          } satisfies ToastRecord,
        }
      },
    },
    dismissToast(state, action: PayloadAction<string>) {
      state.items = state.items.filter((toast) => toast.id !== action.payload)
    },
    clearToasts(state) {
      state.items = []
    },
  },
})

export const { enqueueToast, dismissToast, clearToasts } = toastSlice.actions

export const selectToastItems = (state: RootState) => state.toasts.items

export default toastSlice.reducer
