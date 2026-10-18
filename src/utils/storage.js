// Thin localStorage wrapper. JSON.parse is wrapped in try/catch so corrupt
// or blocked storage never crashes the app - we just fall back to a default.
export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable: ignore, the app still works for this session.
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

export const STORAGE_KEYS = {
  users: 'ems_users',
  session: 'ems_session',
  registrations: 'ems_registrations',
}
