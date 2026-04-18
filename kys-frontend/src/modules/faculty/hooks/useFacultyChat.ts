import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks'
import {
  facultyChatActions,
  loadFacultyChatMentees,
  regenerateFacultyChatResponse,
  selectFacultyChatAnalysisText,
  selectFacultyChatCanSend,
  selectFacultyChatComposerQuery,
  selectFacultyChatContextLabel,
  selectFacultyChatFilteredMentees,
  selectFacultyChatIsLoading,
  selectFacultyChatIsStudentSelectionInvalid,
  selectFacultyChatLastPayloadExists,
  selectFacultyChatMenteeError,
  selectFacultyChatMenteeLoading,
  selectFacultyChatMenteeStatus,
  selectFacultyChatMentees,
  selectFacultyChatMessages,
  selectFacultyChatRequestError,
  selectFacultyChatScopeMode,
  selectFacultyChatSelectedStudentUid,
  selectFacultyChatStudentSearch,
  stopFacultyChatResponse,
  submitFacultyChatPayload,
} from '../store/facultyChatSlice'
import type { ChatMessageModel, ChatbotRequest, MenteeRow, ScopeMode } from '../api/types'

export interface UseFacultyChatResult {
  mentees: MenteeRow[]
  filteredMentees: MenteeRow[]
  menteeLoading: boolean
  menteeError: string
  scopeMode: ScopeMode
  selectedStudentUid: string
  studentSearch: string
  messages: ChatMessageModel[]
  requestError: string
  isLoading: boolean
  analysisText: string
  lastPayloadExists: boolean
  query: string
  contextLabel: string
  canSend: boolean
  isStudentSelectionInvalid: boolean
  setScopeMode: (mode: ScopeMode) => void
  setSelectedStudentUid: (uid: string) => void
  setStudentSearch: (query: string) => void
  setQuery: (query: string) => void
  reloadMentees: () => Promise<void>
  submitPayload: (payload: ChatbotRequest) => Promise<void>
  stopResponse: () => void
  regenerate: () => Promise<void>
}

export function useFacultyChat(): UseFacultyChatResult {
  const dispatch = useAppDispatch()
  const mentees = useAppSelector(selectFacultyChatMentees)
  const menteeStatus = useAppSelector(selectFacultyChatMenteeStatus)
  const filteredMentees = useAppSelector(selectFacultyChatFilteredMentees)
  const menteeLoading = useAppSelector(selectFacultyChatMenteeLoading)
  const menteeError = useAppSelector(selectFacultyChatMenteeError)
  const scopeMode = useAppSelector(selectFacultyChatScopeMode)
  const selectedStudentUid = useAppSelector(selectFacultyChatSelectedStudentUid)
  const studentSearch = useAppSelector(selectFacultyChatStudentSearch)
  const messages = useAppSelector(selectFacultyChatMessages)
  const requestError = useAppSelector(selectFacultyChatRequestError)
  const isLoading = useAppSelector(selectFacultyChatIsLoading)
  const analysisText = useAppSelector(selectFacultyChatAnalysisText)
  const lastPayloadExists = useAppSelector(selectFacultyChatLastPayloadExists)
  const query = useAppSelector(selectFacultyChatComposerQuery)
  const contextLabel = useAppSelector(selectFacultyChatContextLabel)
  const canSend = useAppSelector(selectFacultyChatCanSend)
  const isStudentSelectionInvalid = useAppSelector(selectFacultyChatIsStudentSelectionInvalid)

  useEffect(() => {
    if (menteeStatus !== 'idle') return
    void dispatch(loadFacultyChatMentees())
  }, [dispatch, menteeStatus])

  const setScopeMode = useCallback((mode: ScopeMode) => {
    dispatch(facultyChatActions.setScopeMode(mode))
  }, [dispatch])

  const setSelectedStudentUid = useCallback((uid: string) => {
    dispatch(facultyChatActions.setSelectedStudentUid(uid))
  }, [dispatch])

  const setStudentSearch = useCallback((value: string) => {
    dispatch(facultyChatActions.setStudentSearch(value))
  }, [dispatch])

  const setQuery = useCallback((value: string) => {
    dispatch(facultyChatActions.setComposerQuery(value))
  }, [dispatch])

  const reloadMentees = useCallback(async () => {
    await dispatch(loadFacultyChatMentees())
  }, [dispatch])

  const submitPayload = useCallback(async (payload: ChatbotRequest) => {
    await dispatch(submitFacultyChatPayload(payload))
  }, [dispatch])

  const stopResponse = useCallback(() => {
    void dispatch(stopFacultyChatResponse())
  }, [dispatch])

  const regenerate = useCallback(async () => {
    await dispatch(regenerateFacultyChatResponse())
  }, [dispatch])

  return {
    mentees,
    filteredMentees,
    menteeLoading,
    menteeError,
    scopeMode,
    selectedStudentUid,
    studentSearch,
    messages,
    requestError,
    isLoading,
    analysisText,
    lastPayloadExists,
    query,
    contextLabel,
    canSend,
    isStudentSelectionInvalid,
    setScopeMode,
    setSelectedStudentUid,
    setStudentSearch,
    setQuery,
    reloadMentees,
    submitPayload,
    stopResponse,
    regenerate,
  }
}
