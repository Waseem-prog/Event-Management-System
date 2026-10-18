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

// Ticketmaster wants UTC times as YYYY-MM-DDTHH:mm:ssZ (no milliseconds).
const nowUtc = () => new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')

export const fetchEvents = createAsyncThunk('events/fetchEvents', async (_, { getState, signal }) => {
  const { page, filters } = getState().events
  // Two different filters are used on purpose:
  // - startDateTime (an exact UTC moment) implements "Upcoming only", so events
  //   that already started anywhere in the world are hidden.
  // - localStartDateTime ("from,to", "*" = open end, venue-local time) implements
  //   the date range the user picks. Combining startDateTime with endDateTime
  //   would also return long-running events that began years ago.
  const from = filters.startDate ? `${filters.startDate}T00:00:00` : ''
  const to = filters.endDate ? `${filters.endDate}T23:59:59` : ''
  return getEvents(
    {
      page,
      keyword: filters.keyword,
      city: filters.city,
      countryCode: filters.countryCode,
      classificationName: filters.category,
      startDateTime: filters.upcoming ? nowUtc() : '',
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
