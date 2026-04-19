import { createAsyncThunk, createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { authExpired, logoutCurrentUser, selectAuthUser } from '../../../app/store/authSlice'
import type { RootState } from '../../../app/store'
import { enqueueToast } from '../../../app/store/toastSlice'
import { getProfile, updateProfile } from '../api/student'
import { validateStudentProfileData } from '../validation/studentProfileSchema'

const DRAFT_RETENTION_DAYS = 180
const DRAFT_VERSION = 1
export const STUDENT_PROFILE_STEP_COUNT = 9

interface DraftPayload {
  version: number
  savedAt: number
  expiresAt: number
  step: number
  data: Record<string, unknown>
}

interface StudentProfileState {
  status: 'idle' | 'loading' | 'ready'
  step: number
  data: Record<string, unknown>
  error: string
  saveStatus: 'idle' | 'saving'
  submitStatus: 'idle' | 'submitting'
  draftKey: string
}

const initialState: StudentProfileState = {
  status: 'idle',
  step: 0,
  data: {},
  error: '',
  saveStatus: 'idle',
  submitStatus: 'idle',
  draftKey: '',
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
    photo_url: preferNonEmptyString(draftPersonalInfo.photo_url, serverPersonalInfo.photo_url),
    photo_public_id: preferNonEmptyString(draftPersonalInfo.photo_public_id, serverPersonalInfo.photo_public_id),
  }

  return merged
}

function isBlank(value: unknown) {
  return value === null || value === undefined || String(value).trim() === ''
}

function deriveDraftKey(state: RootState): string {
  const user = selectAuthUser(state)
  const identity = String(user?.id || user?.username || 'guest')
  return `kys_student_profile_draft_${identity}`
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
    if (isBlank(pi.dob)) missing.push('Date of Birth')
    if (isBlank(pi.gender)) missing.push('Gender')
    if (isBlank(pi.mobile_no)) missing.push('WhatsApp Mobile No.')
    if (isBlank(pi.personal_email)) missing.push('Personal Email')
    if (isBlank(pi.college_email)) missing.push('College Email (Professional)')
    if (isBlank(pi.permanent_address)) missing.push('Permanent Address')
    return missing
  }

  if (step === 1) {
    const missing: string[] = []
    if (isBlank(pi.father_name)) missing.push("Father's Name")
    if (isBlank(pi.father_mobile_no)) missing.push("Father's WhatsApp Mobile No.")
    if (isBlank(pi.father_occupation)) missing.push("Father's Occupation")
    if (isBlank(pi.mother_name)) missing.push("Mother's Name")
    if (isBlank(pi.mother_mobile_no)) missing.push("Mother's WhatsApp Mobile No.")
    if (isBlank(pi.mother_occupation)) missing.push("Mother's Occupation")
    return missing
  }

  if (step === 2) {
    const missing: string[] = []
    const ssc = getPast('SSC')
    if (isBlank(ssc.percentage)) missing.push('SSC Percentage / Grade')
    if (isBlank(ssc.year_of_passing)) missing.push('SSC Year of Passing')
    if (isBlank(admissionType)) missing.push('Admission Type (after 10th)')

    if (admissionType === 'hsc') {
      const hssc = getPast('HSSC')
      const entrance = getPast('ENTRANCE_EXAM')
      if (isBlank(hssc.percentage)) missing.push('HSC Percentage / Grade')
      if (isBlank(hssc.year_of_passing)) missing.push('HSC Year of Passing')
      if (isBlank(entrance.exam_type)) missing.push('Entrance Exam Type')
      if (isBlank(entrance.percentage)) missing.push('Entrance Percentile')
      if (isBlank(entrance.year_of_passing)) missing.push('Entrance Exam Year of Passing')
    }

    if (admissionType === 'diploma') {
      const diploma = getPast('DIPLOMA')
      if (isBlank(diploma.percentage)) missing.push('Diploma Percentage / Grade')
      if (isBlank(diploma.year_of_passing)) missing.push('Diploma Year of Passing')
    }

    return missing
  }

  if (step === 6) {
    const missing: string[] = []
    if (isBlank(swoc.strengths)) missing.push('Strengths')
    if (isBlank(swoc.weaknesses)) missing.push('Weaknesses / Areas of Improvement')
    if (isBlank(swoc.opportunities)) missing.push('Opportunities')
    if (isBlank(swoc.challenges)) missing.push('Challenges')
    return missing
  }

  if (step === 7) {
    const missing: string[] = []
    if (isBlank(co.career_goal)) missing.push('Career Goal')
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
    if (personalInfo) payload.personal_info = personalInfo
    return payload
  }

  if (step === 2) {
    if ('admission_type' in data) payload.admission_type = data.admission_type
    if ('past_education_records' in data) payload.past_education_records = data.past_education_records
    return payload
  }

  if (step === 3) {
    if ('post_admission_records' in data) payload.post_admission_records = data.post_admission_records
    return payload
  }

  if (step === 4) {
    if ('projects' in data) payload.projects = data.projects
    if ('internships' in data) payload.internships = data.internships
    return payload
  }

  if (step === 5) {
    if ('cocurricular_participations' in data) payload.cocurricular_participations = data.cocurricular_participations
    if ('cocurricular_organizations' in data) payload.cocurricular_organizations = data.cocurricular_organizations
    return payload
  }

  if (step === 6) {
    if ('swoc' in data) payload.swoc = data.swoc
    return payload
  }

  if (step === 7) {
    if ('career_objective' in data) payload.career_objective = data.career_objective
    if ('skills' in data) payload.skills = data.skills
    return payload
  }

  return data
}

function readDraft(draftKey: string): { data: Record<string, unknown>; step: number } | null {
  try {
    const raw = window.localStorage.getItem(draftKey)
    if (!raw) return null

    const parsed = JSON.parse(raw) as DraftPayload
    const validVersion = parsed?.version === DRAFT_VERSION
    const validData = parsed?.data && typeof parsed.data === 'object'
    const notExpired = Number(parsed?.expiresAt || 0) > Date.now()
    if (!validVersion || !validData || !notExpired) {
      window.localStorage.removeItem(draftKey)
      return null
    }

    return {
      data: parsed.data,
      step: Math.max(0, Math.min(Number(parsed.step || 0), STUDENT_PROFILE_STEP_COUNT - 1)),
    }
  } catch {
    window.localStorage.removeItem(draftKey)
    return null
  }
}

function saveDraft(draftKey: string, data: Record<string, unknown>, nextStep: number): boolean {
  try {
    const now = Date.now()
    const payload: DraftPayload = {
      version: DRAFT_VERSION,
      savedAt: now,
      expiresAt: now + DRAFT_RETENTION_DAYS * 24 * 60 * 60 * 1000,
      step: nextStep,
      data,
    }

    window.localStorage.setItem(draftKey, JSON.stringify(payload))
    return true
  } catch {
    return false
  }
}

export const loadStudentProfileWizard = createAsyncThunk(
  'studentProfile/loadStudentProfileWizard',
  async (_arg: void, { dispatch, getState }): Promise<{
    data: Record<string, unknown>
    draftKey: string
    step: number
  }> => {
    const state = getState() as RootState
    const draftKey = deriveDraftKey(state)
    const draft = readDraft(draftKey)

    try {
      const response = await getProfile()
      if (draft) {
        dispatch(enqueueToast({ title: 'Info', message: 'Draft restored from local storage.', intent: 'info' }))
        return {
          data: mergeStudentProfileData((response.data || {}) as Record<string, unknown>, draft.data),
          draftKey,
          step: draft.step,
        }
      }

      return {
        data: (response.data || {}) as Record<string, unknown>,
        draftKey,
        step: 0,
      }
    } catch {
      if (draft) {
        dispatch(enqueueToast({ title: 'Info', message: 'Draft restored from local storage.', intent: 'info' }))
        return {
          data: draft.data,
          draftKey,
          step: draft.step,
        }
      }

      return {
        data: {},
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

    if (state.step >= 2) {
      const validation = validateStudentProfileData(state.data)
      if (!validation.isValid) {
        const message = validation.errors[0] || 'Please correct invalid values in the form.'
        dispatch(enqueueToast({
          title: 'Error',
          message: 'Please fix highlighted validation issues before proceeding.',
          intent: 'error',
        }))
        return rejectWithValue(message)
      }
    }

    const payload = getPayloadForStep(state.step, state.data)

    try {
      await updateProfile(payload)
      const nextStep = Math.min(state.step + 1, STUDENT_PROFILE_STEP_COUNT - 1)
      const draftSaved = saveDraft(state.draftKey, state.data, nextStep)

      dispatch(enqueueToast({
        title: 'Success',
        message: draftSaved ? 'Step saved.' : 'Step saved on server. Unable to save local draft.',
        intent: draftSaved ? 'success' : 'info',
      }))

      return { nextStep }
    } catch (error) {
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
    const validation = validateStudentProfileData(state.data)
    if (!validation.isValid) {
      dispatch(enqueueToast({
        title: 'Error',
        message: 'Please fix validation issues before submitting.',
        intent: 'error',
      }))
      return rejectWithValue(validation.errors[0] || 'Validation failed.')
    }

    try {
      await updateProfile(state.data)
      window.localStorage.removeItem(state.draftKey)
    } catch (error) {
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
      state.data = {
        ...state.data,
        ...action.payload,
      }
    },
    goToPreviousStudentProfileStep(state) {
      state.error = ''
      state.step = Math.max(state.step - 1, 0)
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
  (step) => Math.round(((step + 1) / STUDENT_PROFILE_STEP_COUNT) * 100),
)

export default studentProfileSlice.reducer
