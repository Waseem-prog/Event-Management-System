import { useEffect, useState } from 'react'
import { useDebounce } from '../utils/useDebounce'
import './Filters.css'

// Search box. It keeps its own text state for instant typing and reports the
// debounced value to the parent. To reset it from outside ("Clear filters"),
// the parent changes its `key`, which remounts it with fresh text and debounce.
function SearchBar({ value, onSearch }) {
  const [text, setText] = useState(value)
  const debounced = useDebounce(text)

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
