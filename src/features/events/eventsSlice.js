import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getCategories, getEventById, getEvents } from '../../services/ticketmaster'

export const DEFAULT_FILTERS = {
  keyword: '',
  city: '',
  countryCode: '', // empty = search worldwide (Ticketmaster has little inventory in PK)
  category: '',
  startDate: '', // YYYY-MM-DD from the date inputs
  endDate: '',
  sort: 'date,asc',
  upcoming: true, // default view: only events from now onwards
}

const initialState = {
  items: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  filters: DEFAULT_FILTERS,
  page: 0, // Ticketmaster pages are 0-based
  totalPages: 0,
  totalElements: 0,
  currentRequestId: null, // used to ignore stale responses
  selected: null,
  selectedStatus: 'idle',
  selectedError: null,
  categories: [],
}

// Local date-time in the format Ticketmaster expects for localStartDateTime
// (YYYY-MM-DDTHH:mm:ss, no timezone, no milliseconds).
const pad = (n) => String(n).padStart(2, '0')
const nowLocal = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export const fetchEvents = createAsyncThunk('events/fetchEvents', async (_, { getState, signal }) => {
  const { page, filters } = getState().events
  // Upcoming mode: the start is "now" unless a later start date is chosen.
  // With the toggle off, only the chosen dates (if any) limit the results.
  // localStartDateTime ("from,to", "*" = open end) filters on when the event
  // itself starts. The plain startDateTime/endDateTime pair also returns
  // long-running events that began years ago, which looked wrong.
  let from = filters.startDate ? `${filters.startDate}T00:00:00` : ''
  const now = nowLocal()
  if (filters.upcoming && from < now) from = now
  const to = filters.endDate ? `${filters.endDate}T23:59:59` : ''
  return getEvents(
    {
      page,
      keyword: filters.keyword,
      city: filters.city,
      countryCode: filters.countryCode,
      classificationName: filters.category,
      localStartDateTime: from || to ? `${from || '*'},${to || '*'}` : '',
      sort: filters.sort,
    },
    signal,
  )
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
    clearFilters(state) {
      state.filters = DEFAULT_FILTERS
      state.page = 0
    },
    // Merge new filter values; any filter change goes back to the first page.
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload }
      state.page = 0
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

export const { setPage, setFilters, clearFilters } = eventsSlice.actions
export const selectEvents = (state) => state.events
export default eventsSlice.reducer
