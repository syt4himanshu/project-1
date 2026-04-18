import { useState, type ReactNode } from 'react'
import { Provider } from 'react-redux'
import { createAppStore, type AppStore } from './index'

interface StoreProviderProps {
  children: ReactNode
  store?: AppStore
}

export function StoreProvider({ children, store }: StoreProviderProps) {
  const [internalStore] = useState(() => store ?? createAppStore())

  return <Provider store={store ?? internalStore}>{children}</Provider>
}
