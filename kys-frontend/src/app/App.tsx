import { AppProviders } from './providers/AppProviders'
import { AppRouter } from './router'
import { ReloadPrompt } from '../shared/components/ReloadPrompt'

export default function App() {
  return (
    <AppProviders>
      <AppRouter />
      <ReloadPrompt />
    </AppProviders>
  )
}

