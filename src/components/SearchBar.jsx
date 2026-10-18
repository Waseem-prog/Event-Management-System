import { useEffect, useState } from 'react'
import { useDebounce } from '../utils/useDebounce'
import './Filters.css'

// Controlled search box. It keeps its own text state for instant typing and
// reports the debounced value to the parent.
function SearchBar({ value, onSearch }) {
  const [text, setText] = useState(value)
  const debounced = useDebounce(text)

  // If the parent changes the value (e.g. "Clear filters"), update the box.
  // Done during render (React's recommended pattern) instead of in an effect.
  const [prevValue, setPrevValue] = useState(value)
  if (value !== prevValue) {
    setPrevValue(value)
    if (value !== text.trim()) setText(value)
  }

  useEffect(() => {
    if (debounced.trim() !== value) onSearch(debounced.trim())
  }, [debounced, value, onSearch])

  return (
    <div className="search-bar">
      <label htmlFor="search" className="sr-only">
        Search events
      </label>
      <input
        id="search"
        type="search"
        placeholder="Search events, artists, teams..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  )
}

export default SearchBar
