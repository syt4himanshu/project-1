/**
 * Sanitizes a value for display by stripping metadata and internal JSON structures.
 * This is used to prevent internal data markers (like [[KYS_META]]) from leaking into the UI.
 */
export function sanitizeDisplayValue(value: unknown): string {
  if (value === null || value === undefined) return '—'
  
  if (typeof value !== 'string') {
    return String(value)
  }

  // Strip [[KYS_META]] / [[KYS_*]] metadata blocks and JSON artifacts
  const cleaned = value
    .replace(/\[\[KYS[_A-Z]*\]\]\s*[\[\{][^)\]]*[\]\}]/g, '')
    .replace(/\[\[KYS[_A-Z]*\]\]/g, '')
    .replace(/\{"season":[^}]+\}/g, '')
    .trim()

  // If what remains is valid-looking JSON or empty, return a dash
  if (!cleaned || cleaned.startsWith('{') || cleaned.startsWith('[')) {
    return '—'
  }

  return cleaned
}

/**
 * Returns a consistent background color based on a string hash.
 * Used for avatars when no image is available.
 */
export function getAvatarColor(name: string): string {
  const colors = [
    '#1d4ed8', // blue-700
    '#059669', // emerald-600
    '#d97706', // amber-600
    '#dc2626', // red-600
    '#7c3aed', // violet-600
    '#db2777', // pink-600
    '#0891b2', // cyan-600
    '#4b5563', // gray-600
  ]

  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  const index = Math.abs(hash) % colors.length
  return colors[index]
}

