import { createSelector, createSlice } from '@reduxjs/toolkit'
import { STORAGE_KEYS, loadJSON } from '../../utils/storage'

// Each registration: { id, userId, eventId, event: {snapshot}, registeredAt }.
// The snapshot keeps the event data so My Events works without calling the API again.
const initialState = {
  items: loadJSON(STORAGE_KEYS.registrations, []),
}

// Keep only the fields we need from the full event object.
function toSnapshot(event) {
  const { id, name, localDate, localTime, dateTime, venue, city, image, url, category } = event
  return { id, name, localDate, localTime, dateTime, venue, city, image, url, category }
}

const registrationsSlice = createSlice({
  name: 'registrations',
  initialState,
  reducers: {
    registerForEvent(state, action) {
      const { userId, event } = action.payload
      // Duplicate prevention: the same user cannot register for the same event twice.
      const exists = state.items.some((r) => r.userId === userId && r.eventId === event.id)
      if (exists) return
      state.items.push({
        id: crypto.randomUUID(),
        userId,
        eventId: event.id,
        event: toSnapshot(event),
        registeredAt: new Date().toISOString(),
      })
    },
    cancelRegistration(state, action) {
      const { userId, eventId } = action.payload
      state.items = state.items.filter((r) => !(r.userId === userId && r.eventId === eventId))
    },
  },
})

export const { registerForEvent, cancelRegistration } = registrationsSlice.actions

const selectAllRegistrations = (state) => state.registrations.items
const selectCurrentUserId = (state) => state.auth.currentUser?.id

// Memoized: only the logged-in user's registrations, so users never see each other's.
export const selectUserRegistrations = createSelector(
  [selectAllRegistrations, selectCurrentUserId],
  (items, userId) => items.filter((r) => r.userId === userId),
)

export const selectIsRegistered = (userId, eventId) => (state) =>
  state.registrations.items.some((r) => r.userId === userId && r.eventId === eventId)

export default registrationsSlice.reducer
