import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getCategories, getEventById, getEvents } from '../../services/ticketmaster'

const initialState = {
  items: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  page: 0, // Ticketmaster pages are 0-based
  totalPages: 0,
  totalElements: 0,
  currentRequestId: null, // used to ignore stale responses
  selected: null,
  selectedStatus: 'idle',
  selectedError: null,
  categories: [],
}

// Ticketmaster wants dates as YYYY-MM-DDTHH:mm:ssZ (no milliseconds).
const nowIso = () => new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')

export const fetchEvents = createAsyncThunk('events/fetchEvents', async (_, { getState, signal }) => {
  const { page } = getState().events
  // Default view: upcoming events sorted by date.
  return getEvents({ page, startDateTime: nowIso(), sort: 'date,asc' }, signal)
})

export const fetchEventById = createAsyncThunk('events/fetchEventById', (id, { signal }) =>
  getEventById(id, signal),
)

export const fetchCategories = createAsyncThunk('events/fetchCategories', (_, { signal }) =>
  getCategories(signal),
)

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state, action) => {
        state.status = 'loading'
        state.error = null
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        // Stale response guard: only the latest request may update the list.
        if (action.meta.requestId !== state.currentRequestId) return
        state.status = 'succeeded'
        state.items = action.payload.events
        state.totalPages = action.payload.totalPages
        state.totalElements = action.payload.totalElements
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        if (action.meta.requestId !== state.currentRequestId) return
        if (action.meta.aborted) return
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(fetchEventById.pending, (state) => {
        state.selectedStatus = 'loading'
        state.selectedError = null
        state.selected = null
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.selectedStatus = 'succeeded'
        state.selected = action.payload
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        if (action.meta.aborted) return
        state.selectedStatus = 'failed'
        state.selectedError = action.error.message
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
  },
})

export const { setPage } = eventsSlice.actions
export const selectEvents = (state) => state.events
export default eventsSlice.reducer
