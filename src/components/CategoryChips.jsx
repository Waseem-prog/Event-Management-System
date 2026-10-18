import './Filters.css'

// Row of category buttons (Music, Sports, ...). "All" clears the category.
function CategoryChips({ categories, selected, onSelect }) {
  if (categories.length === 0) return null
  return (
    <div className="chips" role="group" aria-label="Event categories">
      {['', ...categories].map((name) => (
        <button
          key={name || 'all'}
          type="button"
          className={`chip ${selected === name ? 'chip--active' : ''}`}
          aria-pressed={selected === name}
          onClick={() => onSelect(name)}
        >
          {name || 'All'}
        </button>
      ))}
    </div>
  )
}

export default CategoryChips
