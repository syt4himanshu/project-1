const STORAGE_KEY = 'student-profile-draft-v1'
const RESET_KEY = 'student-profile-draft-reset-v1'
const DRAFT_VERSION = 1
const DRAFT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

export interface StudentProfileDraftPayload {
  version: number
  updatedAt: string
  data: Record<string, unknown>
}

export interface StudentProfileDraftMetadata {
  version: number
  updatedAt: string
  ageMs: number
}

function canUseLocalStorage() {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  } catch {
    return false
  }
}

function readRawDraft(): StudentProfileDraftPayload | null {
  if (!canUseLocalStorage()) return null

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<StudentProfileDraftPayload>
    if (parsed?.version !== DRAFT_VERSION) return null
    if (typeof parsed.updatedAt !== 'string') return null
    if (!parsed.data || typeof parsed.data !== 'object' || Array.isArray(parsed.data)) return null

    const updatedAtMs = Date.parse(parsed.updatedAt)
    if (Number.isNaN(updatedAtMs)) return null
    if (Date.now() - updatedAtMs > DRAFT_MAX_AGE_MS) return null

    return {
      version: parsed.version,
      updatedAt: parsed.updatedAt,
      data: parsed.data as Record<string, unknown>,
    }
  } catch {
    return null
  }
}

export function saveDraft(data: Record<string, unknown>) {
  if (!canUseLocalStorage()) return false

  try {
    const payload: StudentProfileDraftPayload = {
      version: DRAFT_VERSION,
      updatedAt: new Date().toISOString(),
      data,
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    return true
  } catch {
    return false
  }
}

export function loadDraft() {
  return readRawDraft()
}

export function clearDraft() {
  if (!canUseLocalStorage()) return false

  try {
    window.localStorage.removeItem(STORAGE_KEY)
    return true
  } catch {
    return false
  }
}

export function markDraftReset() {
  if (!canUseLocalStorage()) return false

  try {
    window.localStorage.setItem(RESET_KEY, JSON.stringify({ clearedAt: new Date().toISOString() }))
    return true
  } catch {
    return false
  }
}

export function clearDraftResetMark() {
  if (!canUseLocalStorage()) return false

  try {
    window.localStorage.removeItem(RESET_KEY)
    return true
  } catch {
    return false
  }
}

export function isDraftResetMarked() {
  if (!canUseLocalStorage()) return false

  try {
    return Boolean(window.localStorage.getItem(RESET_KEY))
  } catch {
    return false
  }
}

export function getDraftMetadata(): StudentProfileDraftMetadata | null {
  const draft = readRawDraft()
  if (!draft) return null

  return {
    version: draft.version,
    updatedAt: draft.updatedAt,
    ageMs: Date.now() - Date.parse(draft.updatedAt),
  }
}

export function isDraftNewerThan(updatedAt: string | null | undefined, otherUpdatedAt: string | null | undefined) {
  const left = updatedAt ? Date.parse(updatedAt) : Number.NEGATIVE_INFINITY
  const right = otherUpdatedAt ? Date.parse(otherUpdatedAt) : Number.NEGATIVE_INFINITY
  return Number.isFinite(left) && left > right
}

export function getDraftStorageKey() {
  return STORAGE_KEY
}
