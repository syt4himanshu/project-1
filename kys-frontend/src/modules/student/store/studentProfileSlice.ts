import { createAsyncThunk, createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { authExpired, logoutCurrentUser, selectAuthUser } from '../../../app/store/authSlice'
import type { RootState } from '../../../app/store'
import { enqueueToast } from '../../../app/store/toastSlice'
import { getProfile, updateProfile } from '../api/student'
import {
  validateStep0FormatErrors,
  validateStep1FormatErrors,
  validateStep2FormatErrors,
  validateStep3FormatErrors,
  validateStudentProfileData,
  validateStudentProfileDataDetailed,
} from '../validation/studentProfileSchema'
import { clearDraft, clearDraftResetMark, getDraftMetadata, isDraftNewerThan, isDraftResetMarked, loadDraft } from '../utils/studentProfileDraft'

export const STUDENT_PROFILE_STEP_COUNT = 5
const DRAFT_RESTORE_TOAST_SUPPRESSION_MS = 3000

const recentDraftRestoreToasts = new Map<string, number>()

function shouldShowDraftRestoreToast(draftKey: string) {
  const now = Date.now()
  const lastShownAt = recentDraftRestoreToasts.get(draftKey) || 0
  if (now - lastShownAt < DRAFT_RESTORE_TOAST_SUPPRESSION_MS) {
    return false
  }

  recentDraftRestoreToasts.set(draftKey, now)
  return true
}

interface StudentProfileState {
  status: 'idle' | 'loading' | 'ready'
  step: number
  data: Record<string, unknown>
  error: string
  saveStatus: 'idle' | 'saving'
  submitStatus: 'idle' | 'submitting'
  draftKey: string
  draftUpdatedAt: string | null
  draftRestored: boolean
}

const initialState: StudentProfileState = {
  status: 'idle',
  step: 0,
  data: {},
  error: '',
  saveStatus: 'idle',
  submitStatus: 'idle',
  draftKey: '',
  draftUpdatedAt: null,
  draftRestored: false,
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function preferNonEmptyString(primary: unknown, fallback: unknown) {
  if (typeof primary === 'string' && primary.trim()) return primary
  if (typeof fallback === 'string' && fallback.trim()) return fallback
  return primary ?? fallback
}

function mergeStudentProfileData(
  serverData: Record<string, unknown>,
  draftData: Record<string, unknown>,
): Record<string, unknown> {
  const merged: Record<string, unknown> = {
    ...serverData,
    ...draftData,
  }

  const serverPersonalInfo = isRecord(serverData.personal_info) ? serverData.personal_info : {}
  const draftPersonalInfo = isRecord(draftData.personal_info) ? draftData.personal_info : {}

  merged.personal_info = {
    ...serverPersonalInfo,
    ...draftPersonalInfo,
    photoUrl: preferNonEmptyString(draftPersonalInfo.photoUrl, serverPersonalInfo.photoUrl),
    photo_public_id: preferNonEmptyString(draftPersonalInfo.photo_public_id, serverPersonalInfo.photo_public_id),
    photoPreviewUrl: preferNonEmptyString(draftPersonalInfo.photoPreviewUrl, serverPersonalInfo.photoPreviewUrl),
    photo_preview_url: preferNonEmptyString(draftPersonalInfo.photo_preview_url, serverPersonalInfo.photo_preview_url),
  }

  return merged
}

function isBlank(value: unknown) {
  return value === null || value === undefined || String(value).trim() === ''
}

export function deriveDraftKey(state: RootState): string {
  const user = selectAuthUser(state)
  const identity = String(user?.id || user?.username || 'guest')
  return `kys_student_profile_draft_${identity}`
}

/**
 * Returns true when the student profile data contains a valid uploaded photo.
 * Covers all representations used by the application:
 *   - pi.photoUrl       (set immediately after upload via the upload endpoint response)
 *   - pi.photo_url      (returned by the server GET endpoint from the DB column)
 *   - pi.photoPreviewUrl / pi.photo_preview_url  (preview URL stored alongside the photo)
 *
 * An existing student whose saved profile has any of these set is considered to already
 * have a photo and will not be blocked.
 *
 * Exported so unit tests can verify all four representations directly.
 */
export function hasStudentPhoto(data: Record<string, unknown>): boolean {
  const pi = (data.personal_info as Record<string, unknown>) || {}
  return (
    Boolean(pi.photoUrl) ||
    Boolean(pi.photo_url) ||
    Boolean(pi.photoPreviewUrl) ||
    Boolean(pi.photo_preview_url)
  )
}

function getMissingRequiredFields(step: number, data: Record<string, unknown>) {
  const pi = (data.personal_info as Record<string, unknown>) || {}
  const past = (data.past_education_records as Record<string, unknown>[]) || []
  const swoc = (data.swoc as Record<string, unknown>) || {}
  const co = (data.career_objective as Record<string, unknown>) || {}
  const sk = (data.skills as Record<string, unknown>) || {}
  const admissionType = (data.admission_type as string)
    || (past.some((record) => record.exam_name === 'DIPLOMA')
      ? 'diploma'
      : past.some((record) => record.exam_name === 'HSSC' || record.exam_name === 'ENTRANCE_EXAM')
        ? 'hsc'
        : '')

  const getPast = (examName: string) =>
    past.find((record) => record.exam_name === examName) || {}

  if (step === 0) {
    const missing: string[] = []
    if (isBlank(data.full_name)) missing.push('Full Name')
    if (isBlank(data.semester)) missing.push('Semester')
    if (isBlank(data.section)) missing.push('Section')
    if (isBlank(pi.category) || pi.category === 'Other') missing.push('Category')
    if (isBlank(pi.mis_uid)) missing.push('MIS UID')
    if (isBlank(pi.dob)) missing.push('Date of Birth')
    if (isBlank(pi.gender)) missing.push('Gender')
    if (isBlank(pi.mobile_no)) missing.push('WhatsApp Mobile No.')
    if (isBlank(pi.personal_email)) missing.push('Personal Email')
    if (isBlank(pi.college_email)) missing.push('College Email (Professional)')
    if (isBlank(pi.state)) missing.push('State')
    if (isBlank(pi.city) || pi.city === 'Other') missing.push('City')
    if (isBlank(pi.pincode)) missing.push('Pincode')
    if (isBlank(pi.permanent_address)) missing.push('Permanent Address')

    // Parents Info (formerly step 1)
    if (isBlank(pi.father_name)) missing.push("Father's Name")
    if (isBlank(pi.father_mobile_no)) missing.push("Father's WhatsApp Mobile No.")
    if (isBlank(pi.father_occupation)) missing.push("Father's Occupation")
    if (isBlank(pi.mother_name)) missing.push("Mother's Name")
    if (isBlank(pi.mother_mobile_no)) missing.push("Mother's WhatsApp Mobile No.")
    if (isBlank(pi.mother_occupation)) missing.push("Mother's Occupation")
    // Photo is required for new submissions. Existing saved photos on any known field satisfy this.
    if (!hasStudentPhoto(data)) missing.push('Profile Photo')
    return missing
  }

  if (step === 1) {
    const missing: string[] = []
    const ssc = getPast('SSC')
    if (isBlank(ssc.board)) missing.push('SSC Board')
    if (isBlank(ssc.percentage)) missing.push('SSC Percentage / Grade')
    if (isBlank(ssc.year_of_passing)) missing.push('SSC Year of Passing')
    if (isBlank(admissionType)) missing.push('Admission Type (after 10th)')

    if (admissionType === 'hsc') {
      const hssc = getPast('HSSC')
      const entrance = getPast('ENTRANCE_EXAM')
      if (isBlank(hssc.board)) missing.push('HSC Board')
      if (isBlank(hssc.percentage)) missing.push('HSC Percentage / Grade')
      if (isBlank(hssc.year_of_passing)) missing.push('HSC Year of Passing')
      if (isBlank(entrance.exam_type)) missing.push('Entrance Exam Type')
      if (isBlank(entrance.percentage)) missing.push('Entrance Percentile')
      if (isBlank(entrance.year_of_passing)) missing.push('Entrance Exam Year of Passing')
    }

    if (admissionType === 'diploma') {
      const diploma = getPast('DIPLOMA')
      if (isBlank(diploma.board)) missing.push('Diploma Board')
      if (isBlank(diploma.percentage)) missing.push('Diploma Percentage / Grade')
      if (isBlank(diploma.year_of_passing)) missing.push('Diploma Year of Passing')
    }

    const extraProgram = getPast('EXTRA_PROGRAM')
    if (
      !isBlank(extraProgram.exam_name) &&
      (!isBlank(extraProgram.exam_type) || !isBlank(extraProgram.percentage) || !isBlank(extraProgram.year_of_passing))
    ) {
      if (isBlank(extraProgram.exam_type)) missing.push('Extra Program Title')
      if (isBlank(extraProgram.percentage)) missing.push('Extra Program Score')
      if (isBlank(extraProgram.year_of_passing)) missing.push('Extra Program Year')
    }

    const currentSem = Number(data.semester || 8)
    const postAdmissionRecords = (data.post_admission_records as Record<string, unknown>[]) || []
    const semesters = Array.from({ length: Math.max(currentSem - 1, 0) }, (_, i) => i + 1)
    for (const sem of semesters) {
      const rec = postAdmissionRecords.find((r) => Number(r.semester) === sem) || {}
      if (isBlank(rec.sgpa)) {
        missing.push(`Semester ${sem} SGPA / Percentage`)
      }
    }

    return missing
  }

  if (step === 2) {
    const missing: string[] = []
    const projects = (data.projects as Record<string, unknown>[]) || []
    const miniProject = projects[0] || {}
    const majorProject = projects[1] || {}

    if (isBlank(miniProject.title)) missing.push('Mini Project Title')
    if (isBlank(miniProject.domain) || miniProject.domain === 'Other') missing.push('Mini Project Domain')
    if (isBlank(majorProject.title)) missing.push('Major Project Title')
    if (isBlank(majorProject.domain) || majorProject.domain === 'Other') missing.push('Major Project Domain')

    return missing
  }

  if (step === 3) {
    const missing: string[] = []
    if (isBlank(swoc.strengths)) missing.push('Strengths')
    if (isBlank(swoc.weaknesses)) missing.push('Weaknesses / Areas of Improvement')
    if (isBlank(swoc.opportunities)) missing.push('Opportunities')
    if (isBlank(swoc.challenges)) missing.push('Challenges')
    if (isBlank(co.career_goal) || co.career_goal === 'Other') missing.push('Career Goal')
    if (isBlank(co.clarity_preparedness)) missing.push('Clarity and Preparedness Level')
    if (co.interested_in_campus_placement !== true && co.interested_in_campus_placement !== false) {
      missing.push('Interested in Campus Placement?')
    }
    if (isBlank(sk.domains_of_interest)) missing.push('Domains of Interest')
    return missing
  }

  return []
}

function getPayloadForStep(step: number, data: Record<string, unknown>) {
  const payload: Record<string, unknown> = {}
  const personalInfo = data.personal_info as Record<string, unknown> | undefined

  if (step === 0) {
    if ('full_name' in data) payload.full_name = data.full_name
    if ('section' in data) payload.section = data.section
    if ('semester' in data) payload.semester = data.semester
    if ('year_of_admission' in data) payload.year_of_admission = data.year_of_admission
    if (personalInfo) payload.personal_info = personalInfo
    return payload
  }

  if (step === 1) {
    if ('admission_type' in data) payload.admission_type = data.admission_type
    if ('past_education_records' in data) {
      const records = (data.past_education_records as Record<string, unknown>[]) || []
      payload.past_education_records = records.filter(r => {
        if (r.exam_name === 'EXTRA_PROGRAM') {
          return !isBlank(r.exam_type) || !isBlank(r.percentage) || !isBlank(r.year_of_passing)
        }
        return true
      })
    }
    return payload
  }

  if (step === 2) {
    if ('projects' in data) payload.projects = data.projects
    if ('internships' in data) payload.internships = data.internships
    if ('cocurricular_participations' in data) payload.cocurricular_participations = data.cocurricular_participations
    if ('cocurricular_organizations' in data) payload.cocurricular_organizations = data.cocurricular_organizations
    if ('skill_programs' in data) payload.skill_programs = data.skill_programs
    return payload
  }

  if (step === 3) {
    if ('swoc' in data) payload.swoc = data.swoc
    if ('career_objective' in data) payload.career_objective = data.career_objective
    if ('skills' in data) payload.skills = data.skills
    return payload
  }

  if (step === 4) {
    return payload
  }

  return data
}

export const loadStudentProfileWizard = createAsyncThunk(
  'studentProfile/loadStudentProfileWizard',
  async (_arg: void, { dispatch, getState }): Promise<{
    data: Record<string, unknown>
    draftUpdatedAt: string | null
    draftRestored: boolean
    draftKey: string
    step: number
  }> => {
    const state = getState() as RootState
    const draftKey = deriveDraftKey(state)
    const draft = loadDraft(draftKey)
    const draftMetadata = getDraftMetadata(draftKey)
    const resetMarked = isDraftResetMarked(draftKey)

    if (resetMarked) {
      return {
        data: {},
        draftUpdatedAt: null,
        draftRestored: false,
        draftKey,
        step: 0,
      }
    }

    try {
      const response = await getProfile()
      const serverData = (response.data || {}) as Record<string, unknown>
      const serverUpdatedAt = typeof serverData.updated_at === 'string' ? serverData.updated_at : null
      const draftUpdatedAt = draft ? draft.updatedAt : null

      // If profile is locked on backend, MUST use serverData (do not allow draft to bypass lock)
      const isLocked = Boolean(serverData.is_profile_locked)
      const shouldRestoreDraft = !isLocked && Boolean(draft && draftMetadata?.updatedAt && isDraftNewerThan(draftUpdatedAt, serverUpdatedAt))

      return {
        data: shouldRestoreDraft && draft ? mergeStudentProfileData(serverData, draft.data) : serverData,
        draftUpdatedAt: shouldRestoreDraft ? draftUpdatedAt : serverUpdatedAt,
        draftRestored: shouldRestoreDraft,
        draftKey,
        step: 0,
      }
    } catch {
      if (draft && draftMetadata?.updatedAt) {
        if (shouldShowDraftRestoreToast(draftKey)) {
          dispatch(enqueueToast({ title: 'Info', message: 'Draft restored from local storage.', intent: 'info' }))
        }
        return {
          data: draft.data,
          draftUpdatedAt: draft.updatedAt,
          draftRestored: true,
          draftKey,
          step: 0,
        }
      }

      return {
        data: {},
        draftUpdatedAt: null,
        draftRestored: false,
        draftKey,
        step: 0,
      }
    }
  },
)

export const saveStudentProfileStep = createAsyncThunk<
  { nextStep: number },
  void,
  { state: RootState; rejectValue: string }
>(
  'studentProfile/saveStudentProfileStep',
  async (_arg, { dispatch, getState, rejectWithValue }) => {
    const state = getState().studentProfile

    if (state.data.is_profile_locked) {
      const message = 'Your profile is locked by your faculty mentor and cannot be edited.'
      dispatch(enqueueToast({
        title: 'Profile Locked',
        message,
        intent: 'error',
      }))
      return rejectWithValue(message)
    }

    const missing = getMissingRequiredFields(state.step, state.data)
    if (missing.length > 0) {
      const message = `Please fill required fields: ${missing.join(', ')}`
      dispatch(enqueueToast({
        title: 'Error',
        message: 'Required fields are missing. Please complete this step.',
        intent: 'error',
      }))
      return rejectWithValue(message)
    }

    let formatCheck: { isValid: boolean; errors: string[] } = { isValid: true, errors: [] }
    if (state.step === 0) {
      formatCheck = validateStep0FormatErrors(state.data)
    } else if (state.step === 1) {
      formatCheck = validateStep1FormatErrors(state.data)
    } else if (state.step === 2) {
      formatCheck = validateStep2FormatErrors(state.data)
    } else if (state.step === 3) {
      formatCheck = validateStep3FormatErrors(state.data)
    }

    if (!formatCheck.isValid) {
      const message = formatCheck.errors[0] || 'Please fix highlighted validation issues before proceeding.'
      dispatch(enqueueToast({
        title: 'Error',
        message: 'Please fix highlighted validation issues before proceeding.',
        intent: 'error',
      }))
      return rejectWithValue(message)
    }

    const payload = getPayloadForStep(state.step, state.data)

    try {
      await updateProfile(payload)
      dispatch(enqueueToast({
        title: 'Success',
        message: 'Step saved.',
        intent: 'success',
      }))

      return { nextStep: Math.min(state.step + 1, STUDENT_PROFILE_STEP_COUNT - 1) }
    } catch (error) {
      const messageStr = error instanceof Error ? error.message : String(error)
      const isLockedErr = messageStr.includes('PROFILE_LOCKED') || messageStr.includes('locked')

      if (isLockedErr) {
        dispatch(studentProfileActions.patchStudentProfileData({ is_profile_locked: true }))
        const lockedMsg = 'Your profile is locked by your faculty mentor and cannot be edited.'
        dispatch(enqueueToast({
          title: 'Profile Locked',
          message: lockedMsg,
          intent: 'error',
        }))
        return rejectWithValue(lockedMsg)
      }

      const message = error instanceof Error
        ? error.message || 'Failed to save this step on server. Please try again.'
        : 'Failed to save this step on server. Please try again.'

      dispatch(enqueueToast({
        title: 'Error',
        message,
        intent: 'error',
      }))
      return rejectWithValue(message)
    }
  },
)

export const submitStudentProfile = createAsyncThunk<
  void,
  void,
  { state: RootState; rejectValue: string }
>(
  'studentProfile/submitStudentProfile',
  async (_arg, { dispatch, getState, rejectWithValue }) => {
    const state = getState().studentProfile

    if (state.data.is_profile_locked) {
      const message = 'Your profile is locked by your faculty mentor and cannot be edited.'
      dispatch(enqueueToast({
        title: 'Profile Locked',
        message,
        intent: 'error',
      }))
      return rejectWithValue(message)
    }

    const validation = validateStudentProfileData(state.data)
    if (!validation.isValid) {
      dispatch(enqueueToast({
        title: 'Error',
        message: 'Please fix validation issues before submitting.',
        intent: 'error',
      }))
      return rejectWithValue(validation.errors[0] || 'Validation failed.')
    }

    // Photo is required for final submission. This is a second-layer guard; the
    // per-step check in getMissingRequiredFields already enforces it on step 0.
    // Re-checking here ensures the final submit cannot be bypassed (e.g., via direct
    // API call or if the student clears the photo between steps).
    if (!hasStudentPhoto(state.data)) {
      const photoMsg = 'Please fill required fields: Profile Photo'
      dispatch(enqueueToast({
        title: 'Error',
        message: 'A profile photo is required before submitting.',
        intent: 'error',
      }))
      return rejectWithValue(photoMsg)
    }

    try {
      const finalData = { ...state.data }
      if (finalData.past_education_records) {
        const records = (finalData.past_education_records as Record<string, unknown>[]) || []
        finalData.past_education_records = records.filter(r => {
          if (r.exam_name === 'EXTRA_PROGRAM') {
            return !isBlank(r.exam_type) || !isBlank(r.percentage) || !isBlank(r.year_of_passing)
          }
          return true
        })
      }
      await updateProfile(finalData)
      clearDraft(state.draftKey)
    } catch (error) {
      const messageStr = error instanceof Error ? error.message : String(error)
      const isLockedErr = messageStr.includes('PROFILE_LOCKED') || messageStr.includes('locked')

      if (isLockedErr) {
        dispatch(studentProfileActions.patchStudentProfileData({ is_profile_locked: true }))
        const lockedMsg = 'Your profile is locked by your faculty mentor and cannot be edited.'
        dispatch(enqueueToast({
          title: 'Profile Locked',
          message: lockedMsg,
          intent: 'error',
        }))
        return rejectWithValue(lockedMsg)
      }

      const message = error instanceof Error ? error.message || 'Failed to save profile' : 'Failed to save profile'
      dispatch(enqueueToast({
        title: 'Error',
        message,
        intent: 'error',
      }))
      return rejectWithValue(message)
    }
  },
)

const studentProfileSlice = createSlice({
  name: 'studentProfile',
  initialState,
  reducers: {
    patchStudentProfileData(state, action: PayloadAction<Record<string, unknown>>) {
      for (const [key, value] of Object.entries(action.payload)) {
        if (isRecord(value)) {
          state.data[key] = {
            ...(state.data[key] as Record<string, unknown> || {}),
            ...value,
          }
        } else {
          state.data[key] = value
        }
      }

      if (state.error && state.error.startsWith('Please fill required fields:')) {
        const missing = getMissingRequiredFields(state.step, state.data)
        if (missing.length === 0) {
          state.error = ''
        } else {
          state.error = `Please fill required fields: ${missing.join(', ')}`
        }
      }

      if (state.error && !state.error.startsWith('Please fill required fields:')) {
        const validation = validateStudentProfileDataDetailed(state.data)
        if (validation.isValid && (state.error.includes('must be') || state.error.includes('not allowed'))) {
          state.error = ''
        }
      }
    },
    restoreStudentProfileDraft(state, action: PayloadAction<Record<string, unknown>>) {
      state.data = {
        ...action.payload,
      }
    },
    clearStudentProfileDraft(state) {
      state.data = {}
    },
    goToPreviousStudentProfileStep(state) {
      state.error = ''
      state.step = Math.max(state.step - 1, 0)
    },
    setStudentProfileStep(state, action: PayloadAction<number>) {
      state.error = ''
      state.step = Math.max(0, Math.min(action.payload, STUDENT_PROFILE_STEP_COUNT - 1))
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadStudentProfileWizard.pending, (state) => {
        state.status = 'loading'
        state.error = ''
      })
      .addCase(loadStudentProfileWizard.fulfilled, (state, action) => {
        state.status = 'ready'
        state.data = action.payload.data
        state.step = action.payload.step
        state.draftKey = action.payload.draftKey
        state.draftUpdatedAt = action.payload.draftUpdatedAt
        state.draftRestored = action.payload.draftRestored
      })
      .addCase(saveStudentProfileStep.pending, (state) => {
        state.saveStatus = 'saving'
        state.error = ''
      })
      .addCase(saveStudentProfileStep.fulfilled, (state, action) => {
        state.saveStatus = 'idle'
        state.error = ''
        state.step = action.payload.nextStep
      })
      .addCase(saveStudentProfileStep.rejected, (state, action) => {
        state.saveStatus = 'idle'
        state.error = action.payload ?? 'Unable to save this step.'
      })
      .addCase(submitStudentProfile.pending, (state) => {
        state.submitStatus = 'submitting'
        state.error = ''
      })
      .addCase(submitStudentProfile.fulfilled, (state) => {
        state.submitStatus = 'idle'
        state.error = ''
        state.draftUpdatedAt = null
        state.draftRestored = false
        clearDraftResetMark(state.draftKey)
      })
      .addCase(submitStudentProfile.rejected, (state, action) => {
        state.submitStatus = 'idle'
        state.error = action.payload ?? 'Failed to save profile'
      })
      .addCase(authExpired, () => initialState)
      .addCase(logoutCurrentUser.fulfilled, () => initialState)
  },
})

export const studentProfileActions = studentProfileSlice.actions

export const selectStudentProfileState = (state: RootState) => state.studentProfile
export const selectStudentProfileData = (state: RootState) => state.studentProfile.data
export const selectStudentProfileStep = (state: RootState) => state.studentProfile.step
export const selectStudentProfileError = (state: RootState) => state.studentProfile.error
export const selectStudentProfileStatus = (state: RootState) => state.studentProfile.status
export const selectStudentProfileIsLoading = (state: RootState) =>
  state.studentProfile.status === 'idle' || state.studentProfile.status === 'loading'
export const selectStudentProfileIsSaving = (state: RootState) =>
  state.studentProfile.saveStatus === 'saving' || state.studentProfile.submitStatus === 'submitting'
export const selectStudentProfileCanSubmit = (state: RootState) =>
  Boolean(state.studentProfile.data.declaration_accepted)

export const selectStudentProfileProgress = createSelector(
  [selectStudentProfileStep],
  (step) => Math.round((step / Math.max(STUDENT_PROFILE_STEP_COUNT - 1, 1)) * 100),
)

export default studentProfileSlice.reducer
