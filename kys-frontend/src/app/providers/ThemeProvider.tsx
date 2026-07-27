import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function currentPathname() {
  return window.location.pathname || '/'
}

function isDarkModeAllowedPath(pathname: string) {
  // Dark mode is intentionally limited to auth/login + student area.
  return (
    pathname === '/' ||
    pathname.startsWith('/roles') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/student')
  )
}

function installLocationChangeEvents() {
  const win = window as Window & {
    __kysThemeLocationEventsInstalled?: boolean
    __kysThemePushState?: History['pushState']
    __kysThemeReplaceState?: History['replaceState']
  }

  if (win.__kysThemeLocationEventsInstalled) return
  win.__kysThemeLocationEventsInstalled = true

  win.__kysThemePushState = history.pushState
  win.__kysThemeReplaceState = history.replaceState

  history.pushState = function (...args) {
    const result = win.__kysThemePushState!.apply(this, args)
    window.dispatchEvent(new Event('locationchange'))
    return result
  }

  history.replaceState = function (...args) {
    const result = win.__kysThemeReplaceState!.apply(this, args)
    window.dispatchEvent(new Event('locationchange'))
    return result
  }

  window.addEventListener('popstate', () => {
    window.dispatchEvent(new Event('locationchange'))
  })
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const [pathname, setPathname] = useState<string>(() => currentPathname())

  useEffect(() => {
    installLocationChangeEvents()

    const onLocationChange = () => setPathname(currentPathname())
    window.addEventListener('locationchange', onLocationChange)

    return () => {
      window.removeEventListener('locationchange', onLocationChange)
    }
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    const canApplyDark = isDarkModeAllowedPath(pathname)

    if (theme === 'dark' && canApplyDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme, pathname])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
