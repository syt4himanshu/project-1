type AnyRecord = Record<string, unknown>

function asRecord(value: unknown): AnyRecord {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as AnyRecord
  }

  return {}
}

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function firstNonEmptyString(...values: unknown[]): string | null {
  for (const value of values) {
    const text = asText(value)
    if (text) return text
  }

  return null
}

export function extractStudentPhotoUrl(value: unknown): string | null {
  const record = asRecord(value)
  const personalInfo = asRecord(record.personal_info)

  // Standardized to photoUrl only
  return firstNonEmptyString(
    personalInfo.photoUrl,
    record.photoUrl,
  )
}
