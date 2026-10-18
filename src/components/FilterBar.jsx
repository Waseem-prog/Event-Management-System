import './Filters.css'

const COUNTRIES = [
  { code: '', name: 'All countries' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IE', name: 'Ireland' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'MX', name: 'Mexico' },
]

const SORT_OPTIONS = [
  { value: 'date,asc', label: 'Date (soonest first)' },
  { value: 'date,desc', label: 'Date (latest first)' },
  { value: 'name,asc', label: 'Name (A-Z)' },
  { value: 'relevance,desc', label: 'Most relevant' },
]

// City / country / date range / sort controls. Every change is sent up
// immediately; the slice resets to page 1 and the events are fetched again.
function FilterBar({ filters, onChange, onClear }) {
  const update = (e) => onChange({ [e.target.name]: e.target.value })

  return (
    <section className="filter-bar" aria-label="Filters">
      <div className="filter-bar__field">
        <label htmlFor="city">City</label>
        <input
          id="city"
          name="city"
          type="text"
          placeholder="e.g. London"
          defaultValue={filters.city}
          key={`city-${filters.city}`}
          onBlur={update}
          onKeyDown={(e) => e.key === 'Enter' && update(e)}
        />
      </div>
      <div className="filter-bar__field">
        <label htmlFor="countryCode">Country</label>
        <select id="countryCode" name="countryCode" value={filters.countryCode} onChange={update}>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-bar__field">
        <label htmlFor="startDate">From</label>
        <input id="startDate" name="startDate" type="date" value={filters.startDate} onChange={update} />
      </div>
      <div className="filter-bar__field">
        <label htmlFor="endDate">To</label>
        <input
          id="endDate"
          name="endDate"
          type="date"
          min={filters.startDate || undefined}
          value={filters.endDate}
          onChange={update}
        />
      </div>
      <div className="filter-bar__field">
        <label htmlFor="sort">Sort by</label>
        <select id="sort" name="sort" value={filters.sort} onChange={update}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <label className="filter-bar__toggle">
        <input
          type="checkbox"
          checked={filters.upcoming}
          onChange={(e) => onChange({ upcoming: e.target.checked })}
        />
        Upcoming only
      </label>
      <button type="button" className="btn btn--secondary" onClick={onClear}>
        Clear filters
      </button>
    </section>
  )
}

export default FilterBar
