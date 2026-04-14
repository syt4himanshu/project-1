import { useState, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 30_000,
          gcTime: 5 * 60_000,
          refetchOnWindowFocus: false,
          retry: (failureCount, error) => {
            const status = (
              error !== null
              && typeof error === 'object'
              && 'status' in error
              && typeof error.status === 'number'
            )
              ? error.status
              : null

            if (status === 401 || status === 403 || status === 404) return false
            return failureCount < 1
          },
        },
      },
    }),
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
