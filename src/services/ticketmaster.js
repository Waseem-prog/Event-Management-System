// All calls to the Ticketmaster Discovery API live here.
// The key is read from the environment (.env, never committed).
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2'
const API_KEY = import.meta.env.VITE_TM_API_KEY

// API limit: page * size must stay below 1000 ("deep paging" restriction).
export const PAGE_SIZE = 12
export const MAX_PAGES = Math.floor(1000 / PAGE_SIZE) - 1

// Turn HTTP / network problems into messages a user can understand.
function friendlyError(status) {
  if (status === 401) return 'The Ticketmaster API key is missing or invalid.'
  if (status === 429) return 'Too many requests. Please wait a moment and try again.'
  if (status >= 500) return 'Ticketmaster is having problems. Please try again later.'
  return `Request failed (error ${status}).`
}

// Central fetch helper: adds the key, skips empty params, handles errors.
async function request(path, params = {}, signal) {
  if (!API_KEY) throw new Error('Missing VITE_TM_API_KEY. Add it to your .env file.')
  const url = new URL(`${BASE_URL}/${path}`)
  url.searchParams.set('apikey', API_KEY)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value)
  })

  let response
  try {
    response = await fetch(url, { signal })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new Error('Network error. Check your internet connection and try again.', { cause: err })
  }
  if (!response.ok) throw new Error(friendlyError(response.status))
  return response.json()
}

// Pick a 16:9 image of reasonable width (falls back to any image).
function pickImage(images = []) {
  const wide = images.filter((img) => img.ratio === '16_9' && img.width >= 500)
  const best = wide.sort((a, b) => a.width - b.width)[0] || images[0]
  return best?.url || null
}

// Reduce the big API object to the fields the UI needs. Many fields are
// optional, so everything uses optional chaining with fallbacks.
export function normalizeEvent(raw) {
  const venue = raw._embedded?.venues?.[0]
  const classification = raw.classifications?.[0]
  const price = raw.priceRanges?.[0]
  return {
    id: raw.id,
    name: raw.name,
    url: raw.url,
    image: pickImage(raw.images),
    localDate: raw.dates?.start?.localDate || null,
    localTime: raw.dates?.start?.localTime || null,
    dateTime: raw.dates?.start?.dateTime || null,
    status: raw.dates?.status?.code || null,
    category: classification?.segment?.name || null,
    genre: classification?.genre?.name || null,
    venue: venue?.name || null,
    city: venue?.city?.name || null,
    state: venue?.state?.stateCode || null,
    country: venue?.country?.name || null,
    address: venue?.address?.line1 || null,
    price: price ? { min: price.min, max: price.max, currency: price.currency } : null,
    info: raw.info || null,
    pleaseNote: raw.pleaseNote || null,
    seatmap: raw.seatmap?.staticUrl || null,
  }
}

// Search / list events. `_embedded.events` is missing when nothing matches.
export async function getEvents(params, signal) {
  const data = await request('events.json', { size: PAGE_SIZE, ...params }, signal)
  return {
    events: (data._embedded?.events || []).map(normalizeEvent),
    totalPages: Math.min(data.page?.totalPages || 0, MAX_PAGES + 1),
    totalElements: data.page?.totalElements || 0,
  }
}

export async function getEventById(id, signal) {
  return normalizeEvent(await request(`events/${id}.json`, {}, signal))
}

// Category list = the "segments" (Music, Sports, ...) of all classifications.
export async function getCategories(signal) {
  const data = await request('classifications.json', { size: 50 }, signal)
  const names = (data._embedded?.classifications || [])
    .map((c) => c.segment?.name)
    .filter((name) => name && name !== 'Undefined') // API returns a placeholder segment
  return [...new Set(names)]
}
