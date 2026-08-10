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

  // Check all known field name variants: camelCase (frontend state) and snake_case (DB/API)
  return firstNonEmptyString(
    personalInfo.photoPreviewUrl,
    personalInfo.photo_preview_url,
    personalInfo.photoUrl,
    personalInfo.photo_url,
    record.photoPreviewUrl,
    record.photo_preview_url,
    record.photoUrl,
    record.photo_url,
  )
}

export function extractStudentPhotoPreviewUrl(value: unknown): string | null {
  const record = asRecord(value)
  const personalInfo = asRecord(record.personal_info)

  // Returns photo_preview_url if available, else falls back to photo_url (for backward compatibility)
  return firstNonEmptyString(
    personalInfo.photo_preview_url,
    personalInfo.photoPreviewUrl,
    record.photo_preview_url,
    record.photoPreviewUrl,
    personalInfo.photo_url,
    personalInfo.photoUrl,
    record.photo_url,
    record.photoUrl,
  )
}
