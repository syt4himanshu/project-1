import { useTheme } from '../../app/providers/ThemeProvider'

export function ThemeToggleIcon() {
  const { theme } = useTheme()
  
  if (theme === 'dark') {
    return (
      <svg className="theme-toggle-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    )
  }
  return (
    <svg className="theme-toggle-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9Z" />
    </svg>
  )
}

export function ThemeToggleButton({ className, style }: { className?: string, style?: React.CSSProperties }) {
  const { toggleTheme } = useTheme()
  
  return (
    <button 
      type="button" 
      aria-label="Theme button" 
      className={className}
      style={style}
      onClick={toggleTheme}
    >
      <ThemeToggleIcon />
    </button>
  )
}
