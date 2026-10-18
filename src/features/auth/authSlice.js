import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { hashPassword } from '../../utils/hash'
import { STORAGE_KEYS, loadJSON } from '../../utils/storage'

// Initial state is read from localStorage so users and the session survive a refresh.
const initialState = {
  users: loadJSON(STORAGE_KEYS.users, []),
  currentUser: loadJSON(STORAGE_KEYS.session, null),
  error: null,
}

// Thunks are used because hashing the password (crypto.subtle) is asynchronous.
// They read the current users list with getState to check for duplicates / credentials.
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }, { getState, rejectWithValue }) => {
    const normalized = email.trim().toLowerCase()
    const exists = getState().auth.users.some((u) => u.email === normalized)
    if (exists) return rejectWithValue('An account with this email already exists.')
    const passwordHash = await hashPassword(password)
    return { id: crypto.randomUUID(), name: name.trim(), email: normalized, passwordHash }
  },
)

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { getState, rejectWithValue }) => {
    const normalized = email.trim().toLowerCase()
    const user = getState().auth.users.find((u) => u.email === normalized)
    const passwordHash = await hashPassword(password)
    if (!user || user.passwordHash !== passwordHash)
      return rejectWithValue('Invalid email or password.')
    return user
  },
)

// Only safe fields go into currentUser (never the password hash).
const toSession = ({ id, name, email }) => ({ id, name, email })

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.currentUser = null
      state.error = null
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.users.push(action.payload)
        state.currentUser = toSession(action.payload) // auto-login after sign up
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.currentUser = toSession(action.payload)
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload || 'Registration failed.'
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload || 'Login failed.'
      })
  },
})

export const { logout, clearError } = authSlice.actions
export const selectCurrentUser = (state) => state.auth.currentUser
export const selectAuthError = (state) => state.auth.error
export default authSlice.reducer
