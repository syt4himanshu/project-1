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
  isSnapshotRefreshQuery,
  parseFirstResponse,
  parseFollowUpResponse,
} from '../chatbot/utils/chatFormatters'
import { logChatbotError, mapChatbotError } from '../chatbot/utils/chatErrorMapper'
import type {
  ChatMessageModel,
  ChatbotRequest,
  ConversationTurn,
  MenteeRow,
} from '../api/types'

interface FacultyChatState {
  mentees: MenteeRow[]
  menteeStatus: 'idle' | 'loading' | 'ready' | 'failed'
  menteeError: string
  selectedStudentUid: string
  studentSearch: string
  composerQuery: string
  messages: ChatMessageModel[]
  /** Flat history sent to the backend for multi-turn context */
  conversationHistory: ConversationTurn[]
  /** ID of the assistant message that holds the pinned student snapshot */
  snapshotMessageId: string
  requestError: string
  loadingMessageId: string
  lastPayload: ChatbotRequest | null
}

const initialState: FacultyChatState = {
  mentees: [],
  menteeStatus: 'idle',
  menteeError: '',
  selectedStudentUid: '',
  studentSearch: '',
  composerQuery: '',
  messages: [],
  conversationHistory: [],
  snapshotMessageId: '',
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
  async (payload: ChatbotRequest & { conversationHistory?: ConversationTurn[] }, { dispatch, getState }): Promise<void> => {
    const state = (getState() as RootState).facultyChat
    const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const assistantId = `assistant-${uid}`
    const contextLabel = formatContextLabel(state.selectedStudentUid, state.mentees)

    // Determine if this is a first response or a follow-up
    const isFirst = state.snapshotMessageId === '' || isSnapshotRefreshQuery(payload.query)

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
      isFirst,
    }))

    const controller = new AbortController()
    activeRequestController = controller

    // Use explicit history override (regenerate) or current state history
    const historyToSend = payload.conversationHistory ?? state.conversationHistory

    try {
      const result = await facultyClient.askChatbot(
        { query: payload.query, studentId: payload.studentId, conversationHistory: historyToSend },
        controller.signal,
      )
      const responseText = String(result?.response ?? '').trim()

      if (isFirst) {
        const { directAnswer, sections } = parseFirstResponse(responseText)
        dispatch(facultyChatActions.firstResponseSucceeded({
          assistantId,
          responseText,
          directAnswer,
          sections: sections ?? undefined,
        }))
      } else {
        const conversationalText = parseFollowUpResponse(responseText)
        dispatch(facultyChatActions.followUpSucceeded({
          assistantId,
          responseText: conversationalText,
        }))
      }
    } catch (error) {
      if (isAbortError(error)) {
        dispatch(facultyChatActions.requestAborted({ assistantId }))
        return
      }

      logChatbotError(error)
      dispatch(facultyChatActions.requestFailed({
        assistantId,
        message: mapChatbotError(error),
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

    // Roll back history by 2 turns (remove the last user+assistant exchange)
    // so the regenerated response doesn't see itself as prior context
    const historyWithoutLastExchange = state.conversationHistory.slice(0, -2)

    await dispatch(submitFacultyChatPayload({
      ...state.lastPayload,
      conversationHistory: historyWithoutLastExchange,
    }))
  },
)

const facultyChatSlice = createSlice({
  name: 'facultyChat',
  initialState,
  reducers: {
    setSelectedStudentUid(state, action: PayloadAction<string>) {
      // Changing student resets the entire conversation
      if (action.payload !== state.selectedStudentUid) {
        state.messages = []
        state.conversationHistory = []
        state.snapshotMessageId = ''
        state.requestError = ''
        state.lastPayload = null
      }
      state.selectedStudentUid = action.payload
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
        isFirst: boolean
      }>,
    ) {
      state.requestError = ''
      state.loadingMessageId = action.payload.assistantId
      state.lastPayload = action.payload.payload
      state.messages.push(action.payload.userMessage, action.payload.loadingMessage)
    },
    firstResponseSucceeded(
      state,
      action: PayloadAction<{
        assistantId: string
        responseText: string
        directAnswer: string
        sections?: ChatMessageModel['sections']
      }>,
    ) {
      const { assistantId, responseText, directAnswer, sections } = action.payload

      // Find the user message that immediately precedes this assistant message
      const assistantIndex = state.messages.findIndex((m) => m.id === assistantId)
      const precedingUserMsg = assistantIndex > 0 ? state.messages[assistantIndex - 1] : null

      state.messages = state.messages.map((message) =>
        message.id === assistantId
          ? {
            ...message,
            loading: false,
            content: directAnswer || responseText,
            directAnswer,
            sections,
            isSnapshot: Boolean(sections),
          }
          : message,
      )

      // Track which message holds the snapshot
      if (sections) {
        state.snapshotMessageId = assistantId
      }

      // Append to conversation history (cap at 12 turns = 6 exchanges)
      if (precedingUserMsg?.role === 'user') {
        state.conversationHistory.push({ role: 'user', content: precedingUserMsg.content })
      }
      state.conversationHistory.push({ role: 'assistant', content: responseText })
      if (state.conversationHistory.length > 12) {
        state.conversationHistory = state.conversationHistory.slice(-12)
      }
    },
    followUpSucceeded(
      state,
      action: PayloadAction<{
        assistantId: string
        responseText: string
      }>,
    ) {
      const { assistantId, responseText } = action.payload

      const msgIndex = state.messages.findIndex((m) => m.id === assistantId)
      const precedingUserMsg = msgIndex > 0 ? state.messages[msgIndex - 1] : null

      state.messages = state.messages.map((message) =>
        message.id === assistantId
          ? {
            ...message,
            loading: false,
            content: responseText,
          }
          : message,
      )

      // Append to conversation history (cap at 12 turns = 6 exchanges)
      if (precedingUserMsg?.role === 'user') {
        state.conversationHistory.push({ role: 'user', content: precedingUserMsg.content })
      }
      state.conversationHistory.push({ role: 'assistant', content: responseText })
      if (state.conversationHistory.length > 12) {
        state.conversationHistory = state.conversationHistory.slice(-12)
      }
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
          state.selectedStudentUid = ''
          state.messages = []
          state.conversationHistory = []
          state.snapshotMessageId = ''
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
export const selectFacultyChatSnapshotMessageId = (state: RootState) => state.facultyChat.snapshotMessageId

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
  [selectFacultyChatSelectedStudentUid, selectFacultyChatMentees],
  (selectedStudentUid, mentees) =>
    formatContextLabel(selectedStudentUid, mentees),
)

export const selectFacultyChatAnalysisText = createSelector(
  [selectFacultyChatSelectedStudentUid],
  (selectedStudentUid) =>
    selectedStudentUid ? 'Analyzing mentee profile...' : '',
)

export const selectFacultyChatIsStudentSelectionInvalid = (state: RootState) =>
  !state.facultyChat.selectedStudentUid

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
