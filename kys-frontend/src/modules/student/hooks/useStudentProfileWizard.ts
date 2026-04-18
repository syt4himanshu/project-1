import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks'
import {
  loadStudentProfileWizard,
  saveStudentProfileStep,
  selectStudentProfileCanSubmit,
  selectStudentProfileData,
  selectStudentProfileError,
  selectStudentProfileIsLoading,
  selectStudentProfileIsSaving,
  selectStudentProfileProgress,
  selectStudentProfileStatus,
  selectStudentProfileStep,
  studentProfileActions,
  submitStudentProfile,
} from '../store/studentProfileSlice'

export function useStudentProfileDraft() {
  const dispatch = useAppDispatch()
  const data = useAppSelector(selectStudentProfileData)

  const update = useCallback((patch: Record<string, unknown>) => {
    dispatch(studentProfileActions.patchStudentProfileData(patch))
  }, [dispatch])

  return { data, update }
}

export function useStudentProfileWizard() {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectStudentProfileStatus)
  const step = useAppSelector(selectStudentProfileStep)
  const data = useAppSelector(selectStudentProfileData)
  const loading = useAppSelector(selectStudentProfileIsLoading)
  const saving = useAppSelector(selectStudentProfileIsSaving)
  const error = useAppSelector(selectStudentProfileError)
  const progress = useAppSelector(selectStudentProfileProgress)
  const canSubmit = useAppSelector(selectStudentProfileCanSubmit)

  useEffect(() => {
    if (status !== 'idle') return
    void dispatch(loadStudentProfileWizard())
  }, [dispatch, status])

  const next = useCallback(async () => {
    try {
      await dispatch(saveStudentProfileStep()).unwrap()
    } catch {
      // State already captures the validation or save error.
    }
  }, [dispatch])

  const prev = useCallback(() => {
    dispatch(studentProfileActions.goToPreviousStudentProfileStep())
  }, [dispatch])

  const submit = useCallback(async () => {
    try {
      await dispatch(submitStudentProfile()).unwrap()
      return true
    } catch {
      return false
    }
  }, [dispatch])

  return {
    step,
    data,
    loading,
    saving,
    error,
    progress,
    canSubmit,
    next,
    prev,
    submit,
  }
}
