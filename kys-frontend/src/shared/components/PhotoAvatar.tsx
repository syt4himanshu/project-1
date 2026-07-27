import { useState, type ReactNode } from 'react'

interface PhotoAvatarProps {
  alt: string
  className: string
  fallback: ReactNode
  url?: string | null
  loading?: 'eager' | 'lazy'
}

export function PhotoAvatar({ alt, className, fallback, url, loading = 'lazy' }: PhotoAvatarProps) {
  if (url) {
    return (
      <AvatarImage key={url} src={url} alt={alt} className={className} loading={loading} />
    )
  }

  return <>{fallback}</>
}

function AvatarImage({ src, alt, className, loading }: { src: string; alt: string; className: string; loading: 'eager' | 'lazy' }) {
  const [hasError, setHasError] = useState(false)

  if (hasError) return null

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setHasError(true)}
    />
  )
}
