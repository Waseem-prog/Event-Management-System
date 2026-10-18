import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import eventsReducer from '../features/events/eventsSlice'
import registrationsReducer from '../features/registrations/registrationsSlice'
import { STORAGE_KEYS, removeKey, saveJSON } from '../utils/storage'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    registrations: registrationsReducer,
  },
})

// Persistence: after every state change, write users, the session and the
// registrations to localStorage. Only write a key when its slice of state actually changed.
let prevUsers = store.getState().auth.users
let prevUser = store.getState().auth.currentUser
let prevRegistrations = store.getState().registrations.items
store.subscribe(() => {
  const { users, currentUser } = store.getState().auth
  const registrations = store.getState().registrations.items
  if (users !== prevUsers) {
    prevUsers = users
    saveJSON(STORAGE_KEYS.users, users)
  }
  if (currentUser !== prevUser) {
    prevUser = currentUser
    if (currentUser) saveJSON(STORAGE_KEYS.session, currentUser)
    else removeKey(STORAGE_KEYS.session)
  }
  if (registrations !== prevRegistrations) {
    prevRegistrations = registrations
    saveJSON(STORAGE_KEYS.registrations, registrations)
  }
})
