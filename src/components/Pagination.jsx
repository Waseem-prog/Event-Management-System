import './Pagination.css'


// Simple Previous / Next pager. `page` is 0-based internally, shown 1-based.
function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" className="btn" disabled={page === 0} onClick={() => onChange(page - 1)}>
        Previous
      </button>
      <span>
        Page {page + 1} of {totalPages}
      </span>
      <button
        type="button"
        className="btn"
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </nav>
  )
}

export default Pagination
