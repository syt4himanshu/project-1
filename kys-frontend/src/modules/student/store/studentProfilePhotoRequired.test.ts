/**
 * Tests for the profile-photo-required feature.
 *
 * Covers all 10 scenarios from the spec:
 *  1.  New student + no photo → step-0 Next is blocked ("Profile Photo" in missing list).
 *  2.  New student + photo → step-0 Next is not blocked by photo.
 *  3.  Existing student + photo_url (server representation) → recognised as having a photo.
 *  4.  hasStudentPhoto: all four field representations are accepted.
 *  5.  hasStudentPhoto: no photo fields → returns false.
 *  6.  hasStudentPhoto: empty-string values are falsy → returns false.
 *  7.  submitStudentProfile thunk: no photo → rejects with "Please fill required fields: Profile Photo".
 *  8.  submitStudentProfile thunk: with photoUrl → does not reject for photo reason.
 *  9.  submitStudentProfile thunk: with server-side photo_url → does not reject for photo reason.
 * 10.  Draft/autosave: photo check is NOT part of saveStudentProfileStep for steps other than 0.
 */

import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createAppStore, type AppDispatch } from '../../../app/store'
import {
  hasStudentPhoto,
  saveStudentProfileStep,
  studentProfileActions,
  submitStudentProfile,
} from './studentProfileSlice'

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock('../api/student', () => ({
  updateProfile: vi.fn().mockResolvedValue({ data: { message: 'ok' } }),
  getProfile: vi.fn().mockResolvedValue({ data: {} }),
}))

vi.mock('../utils/studentProfileDraft', () => ({
  clearDraft: vi.fn(),
  clearDraftResetMark: vi.fn(),
  getDraftMetadata: vi.fn().mockReturnValue(null),
  isDraftNewerThan: vi.fn().mockReturnValue(false),
  isDraftResetMarked: vi.fn().mockReturnValue(false),
  loadDraft: vi.fn().mockReturnValue(null),
  markDraftReset: vi.fn(),
  saveDraft: vi.fn(),
}))

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeStore(initialData: Record<string, unknown> = {}, step = 0) {
  const store = createAppStore()
  const dispatch = store.dispatch as AppDispatch
  dispatch(studentProfileActions.patchStudentProfileData(initialData))
  dispatch(studentProfileActions.setStudentProfileStep(step))
  // Drive status to 'ready' so thunks don't early-exit while status === 'idle'
  dispatch({
    type: 'studentProfile/loadStudentProfileWizard/fulfilled',
    payload: { data: initialData, draftUpdatedAt: null, draftRestored: false, draftKey: 'test', step },
  })
  return store
}

/** Minimal step-0 data that satisfies every required field EXCEPT photo. */
const step0WithoutPhoto: Record<string, unknown> = {
  full_name: 'Test Student',
  semester: 3,
  section: 'A',
  personal_info: {
    category: 'General',
    mis_uid: '12345678',
    dob: '2002-05-10',
    gender: 'Male',
    mobile_no: '9876543210',
    personal_email: 'test@example.com',
    college_email: 'test@stvincentngp.edu.in',
    state: 'Maharashtra',
    city: 'Nagpur',
    pincode: '440001',
    permanent_address: '123 Main St',
    father_name: 'Father Name',
    father_mobile_no: '9876543211',
    father_occupation: 'Service',
    mother_name: 'Mother Name',
    mother_mobile_no: '9876543212',
    mother_occupation: 'Teacher',
  },
}

/** Step-0 data with a photoUrl (just-uploaded camelCase representation). */
const step0WithPhotoUrl: Record<string, unknown> = {
  ...step0WithoutPhoto,
  personal_info: {
    ...(step0WithoutPhoto.personal_info as Record<string, unknown>),
    photoUrl: 'https://res.cloudinary.com/demo/image/upload/v1/sample.pdf',
  },
}

/** Step-0 data with photo_url (server GET snake_case representation). */
const step0WithPhotoUrlSnake: Record<string, unknown> = {
  ...step0WithoutPhoto,
  personal_info: {
    ...(step0WithoutPhoto.personal_info as Record<string, unknown>),
    photo_url: 'https://res.cloudinary.com/demo/image/upload/v1/sample.pdf',
  },
}

// ─── hasStudentPhoto unit tests ───────────────────────────────────────────────

describe('hasStudentPhoto()', () => {
  it('TEST 4a: photoUrl (camelCase, post-upload representation) → true', () => {
    expect(hasStudentPhoto({ personal_info: { photoUrl: 'https://cdn.example.com/photo.pdf' } })).toBe(true)
  })

  it('TEST 4b: photo_url (snake_case, server GET representation) → true', () => {
    expect(hasStudentPhoto({ personal_info: { photo_url: 'https://cdn.example.com/photo.pdf' } })).toBe(true)
  })

  it('TEST 4c: photoPreviewUrl (camelCase preview URL) → true', () => {
    expect(hasStudentPhoto({ personal_info: { photoPreviewUrl: 'https://cdn.example.com/preview.jpg' } })).toBe(true)
  })

  it('TEST 4d: photo_preview_url (snake_case preview URL) → true', () => {
    expect(hasStudentPhoto({ personal_info: { photo_preview_url: 'https://cdn.example.com/preview.jpg' } })).toBe(true)
  })

  it('TEST 5: no photo fields at all → false', () => {
    expect(hasStudentPhoto({ personal_info: { mobile_no: '9876543210' } })).toBe(false)
  })

  it('TEST 5b: empty personal_info object → false', () => {
    expect(hasStudentPhoto({ personal_info: {} })).toBe(false)
  })

  it('TEST 5c: personal_info absent entirely → false', () => {
    expect(hasStudentPhoto({})).toBe(false)
  })

  it('TEST 6: all photo fields present but empty string → false', () => {
    expect(hasStudentPhoto({
      personal_info: { photoUrl: '', photo_url: '', photoPreviewUrl: '', photo_preview_url: '' },
    })).toBe(false)
  })
})

// ─── Step-0 required-field check (via saveStudentProfileStep thunk) ───────────

describe('saveStudentProfileStep — step 0 photo requirement', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('TEST 1: No photo → step-0 Next rejected with "Profile Photo" in the missing-fields message', async () => {
    const store = makeStore(step0WithoutPhoto, 0)
    const dispatch = store.dispatch as AppDispatch
    const result = await dispatch(saveStudentProfileStep())
    expect(saveStudentProfileStep.rejected.match(result)).toBe(true)
    const payload = (result as { payload: string }).payload
    expect(payload).toContain('Profile Photo')
  })

  it('TEST 2: Student with photoUrl → step-0 NOT blocked by the photo check', async () => {
    const store = makeStore(step0WithPhotoUrl, 0)
    const dispatch = store.dispatch as AppDispatch
    const result = await dispatch(saveStudentProfileStep())
    if (saveStudentProfileStep.rejected.match(result)) {
      // May still reject for format errors on other fields — but not for photo
      expect((result as { payload: string }).payload).not.toContain('Profile Photo')
    } else {
      expect(saveStudentProfileStep.fulfilled.match(result)).toBe(true)
    }
  })

  it('TEST 3: Existing student with photo_url (server representation) → not blocked by photo', async () => {
    const store = makeStore(step0WithPhotoUrlSnake, 0)
    const dispatch = store.dispatch as AppDispatch
    const result = await dispatch(saveStudentProfileStep())
    if (saveStudentProfileStep.rejected.match(result)) {
      expect((result as { payload: string }).payload).not.toContain('Profile Photo')
    } else {
      expect(saveStudentProfileStep.fulfilled.match(result)).toBe(true)
    }
  })

  it('TEST 10: Photo check is absent on step 2 (Projects) — does not interfere with draft saves', async () => {
    const step2Data = {
      projects: [
        { title: 'Mini Project', domain: 'Web' },
        { title: 'Major Project', domain: 'AI' },
      ],
    }
    const store = makeStore(step2Data, 2)
    const dispatch = store.dispatch as AppDispatch
    const result = await dispatch(saveStudentProfileStep())
    if (saveStudentProfileStep.rejected.match(result)) {
      expect((result as { payload: string }).payload).not.toContain('Profile Photo')
    }
  })
})

// ─── submitStudentProfile thunk ───────────────────────────────────────────────

describe('submitStudentProfile — final submission photo gate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('TEST 1 (submit): No photo → rejected with exactly "Please fill required fields: Profile Photo"', async () => {
    const dataNoPhoto = { ...step0WithoutPhoto, declaration_accepted: true }
    const store = makeStore(dataNoPhoto, 4)
    const dispatch = store.dispatch as AppDispatch
    const result = await dispatch(submitStudentProfile())
    expect(submitStudentProfile.rejected.match(result)).toBe(true)
    expect((result as { payload: string }).payload).toBe('Please fill required fields: Profile Photo')
  })

  it('TEST 2 (submit): With photoUrl → final submission is NOT blocked for photo reason', async () => {
    const dataWithPhoto = { ...step0WithPhotoUrl, declaration_accepted: true }
    const store = makeStore(dataWithPhoto, 4)
    const dispatch = store.dispatch as AppDispatch
    const result = await dispatch(submitStudentProfile())
    if (submitStudentProfile.rejected.match(result)) {
      expect((result as { payload: string }).payload).not.toBe('Please fill required fields: Profile Photo')
    } else {
      expect(submitStudentProfile.fulfilled.match(result)).toBe(true)
    }
  })

  it('TEST 6 (submit): With photo_url (server representation) → NOT blocked by photo check', async () => {
    const dataWithServerPhoto = { ...step0WithPhotoUrlSnake, declaration_accepted: true }
    const store = makeStore(dataWithServerPhoto, 4)
    const dispatch = store.dispatch as AppDispatch
    const result = await dispatch(submitStudentProfile())
    if (submitStudentProfile.rejected.match(result)) {
      expect((result as { payload: string }).payload).not.toBe('Please fill required fields: Profile Photo')
    }
  })

  it('TEST 9 (draft): updateProfile API is NOT called when photo is missing (rejected before network)', async () => {
    const { updateProfile } = await import('../api/student')
    const dataNoPhoto = { ...step0WithoutPhoto, declaration_accepted: true }
    const store = makeStore(dataNoPhoto, 4)
    const dispatch = store.dispatch as AppDispatch
    await dispatch(submitStudentProfile())
    // Photo check fires before the API call — network should never be reached
    expect(vi.mocked(updateProfile)).not.toHaveBeenCalled()
  })

  it('TEST 8 (locked): locked profile → 403 message, not photo message (lock check wins)', async () => {
    const lockedData = { ...step0WithoutPhoto, is_profile_locked: true, declaration_accepted: true }
    const store = makeStore(lockedData, 4)
    const dispatch = store.dispatch as AppDispatch
    const result = await dispatch(submitStudentProfile())
    expect(submitStudentProfile.rejected.match(result)).toBe(true)
    const payload = (result as { payload: string }).payload
    expect(payload).toContain('locked')
    expect(payload).not.toContain('Profile Photo')
  })
})
