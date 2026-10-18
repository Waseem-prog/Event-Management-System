// Format an event's local date/time for display (e.g. "Sat, 25 Oct 2026, 7:30 PM").
// Ticketmaster gives localDate (YYYY-MM-DD) and localTime (HH:mm:ss) separately.
export function formatEventDate(localDate, localTime) {
  if (!localDate) return 'Date to be announced'
  const date = new Date(`${localDate}T${localTime || '00:00:00'}`)
  const day = date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  if (!localTime) return day
  const time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  return `${day}, ${time}`
}

// An event is "completed" once its start time has passed. Prefer the exact UTC
// dateTime; fall back to the local date (treated as the end of that day) when
// Ticketmaster gives no time.
export function isPastEvent(event, now = new Date()) {
  if (event.dateTime) return new Date(event.dateTime) < now
  if (event.localDate) return new Date(`${event.localDate}T23:59:59`) < now
  return false
}
