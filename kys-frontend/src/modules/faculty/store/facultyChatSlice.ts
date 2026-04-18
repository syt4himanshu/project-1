import {
  createAsyncThunk,
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import { authExpired, logoutCurrentUser } from '../../../app/store/authSlice'
import type { RootState } from '../../../app/store'
import { facultyClient } from '../api/client'
import { normalizeMentees } from '../api/normalizers'
import {
  formatContextLabel,
  parseStructuredResponse,
  toErrorMessage,
} from '../chatbot/utils/chatFormatters'
import type {
  ChatMessageModel,
  ChatbotRequest,
  MenteeRow,
  ScopeMode,
} from '../api/types'

interface FacultyChatState {
  mentees: MenteeRow[]
  menteeStatus: 'idle' | 'loading' | 'ready' | 'failed'
  menteeError: string
  scopeMode: ScopeMode
  selectedStudentUid: string
  studentSearch: string
  composerQuery: string
  messages: ChatMessageModel[]
  requestError: string
  loadingMessageId: string
  lastPayload: ChatbotRequest | null
}

const initialState: FacultyChatState = {
  mentees: [],
  menteeStatus: 'idle',
  menteeError: '',
  scopeMode: 'all',
  selectedStudentUid: '',
  studentSearch: '',
  composerQuery: '',
  messages: [],
  requestError: '',
  loadingMessageId: '',
  lastPayload: null,
}

let activeRequestController: AbortController | null = null

function isAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === 'AbortError') ||
    (error as { code?: string })?.code === 'ERR_CANCELED'
  )
}

export const loadFacultyChatMentees = createAsyncThunk(
  'facultyChat/loadMentees',
  async (): Promise<MenteeRow[]> => normalizeMentees(await facultyClient.getMentees()),
)

export const submitFacultyChatPayload = createAsyncThunk(
  'facultyChat/submitPayload',
  async (payload: ChatbotRequest, { dispatch, getState }): Promise<void> => {
    const state = (getState() as RootState).facultyChat
    const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const assistantId = `assistant-${uid}`
    const contextLabel = formatContextLabel(state.scopeMode, state.selectedStudentUid, state.mentees)

    const userMsg: ChatMessageModel = {
      id: `user-${uid}`,
      role: 'user',
      content: payload.query,
      contextLabel,
      createdAt: new Date().toISOString(),
    }
    const loadingMsg: ChatMessageModel = {
      id: assistantId,
      role: 'assistant',
      content: '',
      contextLabel,
      createdAt: new Date().toISOString(),
      loading: true,
    }

    dispatch(facultyChatActions.requestStarted({
      assistantId,
      payload,
      userMessage: userMsg,
      loadingMessage: loadingMsg,
    }))

    const controller = new AbortController()
    activeRequestController = controller

    try {
      const result = await facultyClient.askChatbot(payload, controller.signal)
      const responseText = String(result?.response ?? '').trim()

      dispatch(facultyChatActions.requestSucceeded({
        assistantId,
        responseText,
        sections: parseStructuredResponse(responseText),
      }))
    } catch (error) {
      if (isAbortError(error)) {
        dispatch(facultyChatActions.requestAborted({ assistantId }))
        return
      }

      dispatch(facultyChatActions.requestFailed({
        assistantId,
        message: toErrorMessage(error),
      }))
    } finally {
      activeRequestController = null
      dispatch(facultyChatActions.requestSettled())
    }
  },
)

export const stopFacultyChatResponse = createAsyncThunk(
  'facultyChat/stopResponse',
  async (): Promise<void> => {
    activeRequestController?.abort()
  },
)

export const regenerateFacultyChatResponse = createAsyncThunk(
  'facultyChat/regenerate',
  async (_arg: void, { dispatch, getState }): Promise<void> => {
    const state = (getState() as RootState).facultyChat
    if (!state.lastPayload || state.loadingMessageId) return

    await dispatch(submitFacultyChatPayload(state.lastPayload))
  },
)

const facultyChatSlice = createSlice({
  name: 'facultyChat',
  initialState,
  reducers: {
    setScopeMode(state, action: PayloadAction<ScopeMode>) {
      state.scopeMode = action.payload
      if (action.payload === 'all') {
        state.selectedStudentUid = ''
      }
    },
    setSelectedStudentUid(state, action: PayloadAction<string>) {
      state.selectedStudentUid = action.payload
      state.scopeMode = action.payload ? 'student' : 'all'
    },
    setStudentSearch(state, action: PayloadAction<string>) {
      state.studentSearch = action.payload
    },
    setComposerQuery(state, action: PayloadAction<string>) {
      state.composerQuery = action.payload
    },
    requestStarted(
      state,
      action: PayloadAction<{
        assistantId: string
        payload: ChatbotRequest
        userMessage: ChatMessageModel
        loadingMessage: ChatMessageModel
      }>,
    ) {
      state.requestError = ''
      state.loadingMessageId = action.payload.assistantId
      state.lastPayload = action.payload.payload
      state.messages.push(action.payload.userMessage, action.payload.loadingMessage)
    },
    requestSucceeded(
      state,
      action: PayloadAction<{
        assistantId: string
        responseText: string
        sections: ChatMessageModel['sections']
      }>,
    ) {
      state.messages = state.messages.map((message) =>
        message.id === action.payload.assistantId
          ? {
            ...message,
            loading: false,
            content: action.payload.responseText,
            sections: action.payload.sections,
          }
          : message,
      )
    },
    requestFailed(state, action: PayloadAction<{ assistantId: string; message: string }>) {
      state.messages = state.messages.map((message) =>
        message.id === action.payload.assistantId
          ? {
            ...message,
            loading: false,
            error: true,
            content: action.payload.message,
          }
          : message,
      )
      state.requestError = action.payload.message
    },
    requestAborted(state, action: PayloadAction<{ assistantId: string }>) {
      state.messages = state.messages.map((message) =>
        message.id === action.payload.assistantId
          ? {
            ...message,
            loading: false,
            error: true,
            content: 'Response stopped by user.',
          }
          : message,
      )
    },
    requestSettled(state) {
      state.loadingMessageId = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFacultyChatMentees.pending, (state) => {
        state.menteeStatus = 'loading'
        state.menteeError = ''
      })
      .addCase(loadFacultyChatMentees.fulfilled, (state, action) => {
        state.mentees = action.payload
        state.menteeStatus = 'ready'

        if (
          state.selectedStudentUid &&
          !action.payload.some((row) => row.uid === state.selectedStudentUid)
        ) {
          state.scopeMode = 'all'
          state.selectedStudentUid = ''
        }
      })
      .addCase(loadFacultyChatMentees.rejected, (state) => {
        state.menteeStatus = 'failed'
        state.menteeError = 'Could not load assigned students.'
      })
      .addCase(authExpired, () => initialState)
      .addCase(logoutCurrentUser.fulfilled, () => initialState)
  },
})

export const facultyChatActions = facultyChatSlice.actions

const selectFacultyChatState = (state: RootState) => state.facultyChat

export const selectFacultyChatMentees = (state: RootState) => state.facultyChat.mentees
export const selectFacultyChatMenteeStatus = (state: RootState) => state.facultyChat.menteeStatus
export const selectFacultyChatScopeMode = (state: RootState) => state.facultyChat.scopeMode
export const selectFacultyChatSelectedStudentUid = (state: RootState) => state.facultyChat.selectedStudentUid
export const selectFacultyChatStudentSearch = (state: RootState) => state.facultyChat.studentSearch
export const selectFacultyChatComposerQuery = (state: RootState) => state.facultyChat.composerQuery
export const selectFacultyChatMessages = (state: RootState) => state.facultyChat.messages
export const selectFacultyChatRequestError = (state: RootState) => state.facultyChat.requestError
export const selectFacultyChatLoadingMessageId = (state: RootState) => state.facultyChat.loadingMessageId
export const selectFacultyChatLastPayloadExists = (state: RootState) => Boolean(state.facultyChat.lastPayload)
export const selectFacultyChatMenteeLoading = (state: RootState) =>
  state.facultyChat.menteeStatus === 'idle' || state.facultyChat.menteeStatus === 'loading'
export const selectFacultyChatMenteeError = (state: RootState) => state.facultyChat.menteeError
export const selectFacultyChatIsLoading = (state: RootState) => Boolean(state.facultyChat.loadingMessageId)

export const selectFacultyChatFilteredMentees = createSelector(
  [selectFacultyChatMentees, selectFacultyChatStudentSearch],
  (mentees, studentSearch) => {
    const search = studentSearch.trim().toLowerCase()
    if (!search) return mentees

    return mentees.filter((row) =>
      `${row.full_name} ${row.uid} ${row.semester}`.toLowerCase().includes(search),
    )
  },
)

export const selectFacultyChatContextLabel = createSelector(
  [
    selectFacultyChatScopeMode,
    selectFacultyChatSelectedStudentUid,
    selectFacultyChatMentees,
  ],
  (scopeMode, selectedStudentUid, mentees) =>
    formatContextLabel(scopeMode, selectedStudentUid, mentees),
)

export const selectFacultyChatAnalysisText = createSelector(
  [selectFacultyChatScopeMode, selectFacultyChatMentees],
  (scopeMode, mentees) =>
    scopeMode === 'all'
      ? `Analyzing ${mentees.length} student(s)...`
      : 'Analyzing 1 student...',
)

export const selectFacultyChatIsStudentSelectionInvalid = createSelector(
  [selectFacultyChatScopeMode, selectFacultyChatSelectedStudentUid],
  (scopeMode, selectedStudentUid) => scopeMode === 'student' && !selectedStudentUid,
)

export const selectFacultyChatCanSend = createSelector(
  [
    selectFacultyChatComposerQuery,
    selectFacultyChatIsLoading,
    selectFacultyChatIsStudentSelectionInvalid,
  ],
  (query, isLoading, isStudentSelectionInvalid) =>
    Boolean(query.trim()) && !isLoading && !isStudentSelectionInvalid,
)

export const selectFacultyChatViewModel = createSelector(
  [selectFacultyChatState, selectFacultyChatFilteredMentees, selectFacultyChatAnalysisText],
  (state, filteredMentees, analysisText) => ({
    ...state,
    filteredMentees,
    analysisText,
  }),
)

export default facultyChatSlice.reducer
