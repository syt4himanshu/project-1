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

function getResetKey(storageKey: string) {
  return `${storageKey}_reset`
}

function readRawDraft(storageKey: string): StudentProfileDraftPayload | null {
  if (!canUseLocalStorage()) return null

  try {
    const raw = window.localStorage.getItem(storageKey)
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

export function saveDraft(storageKey: string, data: Record<string, unknown>) {
  if (!canUseLocalStorage() || !storageKey) return false

  try {
    const payload: StudentProfileDraftPayload = {
      version: DRAFT_VERSION,
      updatedAt: new Date().toISOString(),
      data,
    }

    window.localStorage.setItem(storageKey, JSON.stringify(payload))
    return true
  } catch {
    return false
  }
}

export function loadDraft(storageKey: string) {
  if (!storageKey) return null
  return readRawDraft(storageKey)
}

export function clearDraft(storageKey: string) {
  if (!canUseLocalStorage() || !storageKey) return false

  try {
    window.localStorage.removeItem(storageKey)
    return true
  } catch {
    return false
  }
}

export function markDraftReset(storageKey: string) {
  if (!canUseLocalStorage() || !storageKey) return false

  try {
    window.localStorage.setItem(getResetKey(storageKey), JSON.stringify({ clearedAt: new Date().toISOString() }))
    return true
  } catch {
    return false
  }
}

export function clearDraftResetMark(storageKey: string) {
  if (!canUseLocalStorage() || !storageKey) return false

  try {
    window.localStorage.removeItem(getResetKey(storageKey))
    return true
  } catch {
    return false
  }
}

export function isDraftResetMarked(storageKey: string) {
  if (!canUseLocalStorage() || !storageKey) return false

  try {
    return Boolean(window.localStorage.getItem(getResetKey(storageKey)))
  } catch {
    return false
  }
}

export function getDraftMetadata(storageKey: string): StudentProfileDraftMetadata | null {
  if (!storageKey) return null
  const draft = readRawDraft(storageKey)
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

export function getDraftStorageKey(identity: string) {
  return `student-profile-draft-v1-${identity}`
}
