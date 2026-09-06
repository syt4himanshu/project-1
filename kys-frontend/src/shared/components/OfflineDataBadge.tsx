import { WifiOff } from 'lucide-react'

interface OfflineDataBadgeProps {
  message?: string
  className?: string
}

export function OfflineDataBadge({
  message = 'Viewing offline cached data',
  className = '',
}: OfflineDataBadgeProps) {
  return (
    <div
      role="status"
      className={`inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300 ${className}`}
    >
      <WifiOff className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
      <span>{message}</span>
    </div>
  )
}
