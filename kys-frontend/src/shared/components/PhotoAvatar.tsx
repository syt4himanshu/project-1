import { useEffect, useState, type ReactNode } from 'react'

interface PhotoAvatarProps {
  alt: string
  className: string
  fallback: ReactNode
  url?: string | null
  loading?: 'eager' | 'lazy'
}

export function PhotoAvatar({ alt, className, fallback, url, loading = 'lazy' }: PhotoAvatarProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [url])

  if (url && !hasError) {
    return (
      <img
        src={url}
        alt={alt}
        className={className}
        loading={loading}
        onError={() => setHasError(true)}
      />
    )
  }

  return <>{fallback}</>
}
