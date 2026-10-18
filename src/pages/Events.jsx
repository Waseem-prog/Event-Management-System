import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CategoryChips from '../components/CategoryChips'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import FilterBar from '../components/FilterBar'
import EventCard from '../components/EventCard'
import EventCardSkeleton from '../components/EventCardSkeleton'
import Pagination from '../components/Pagination'
import SearchBar from '../components/SearchBar'
import {
  clearFilters,
  fetchCategories,
  fetchEvents,
  selectEvents,
  setFilters,
  setPage,
} from '../features/events/eventsSlice'
import { useDocumentTitle } from '../utils/useDocumentTitle'
import '../components/Skeleton.css'
import '../components/States.css'

function Events() {
  useDocumentTitle('Events')
  const dispatch = useDispatch()
  const { items, status, error, page, totalPages, filters, categories } = useSelector(selectEvents)

  // Load the category list once (it never changes during a session).
  useEffect(() => {
    if (categories.length === 0) dispatch(fetchCategories())
  }, [dispatch, categories.length])

  // Reload whenever the page number changes (and once on first visit).
  useEffect(() => {
    const request = dispatch(fetchEvents())
    return () => request.abort() // cancel in-flight request if we leave or re-fetch
  }, [dispatch, page, filters])

  const handleSearch = useCallback(
    (keyword) => dispatch(setFilters({ keyword })),
    [dispatch],
  )

  const handleFilterChange = (changes) => dispatch(setFilters(changes))
  const handleClear = () => dispatch(clearFilters())

  const retry = () => dispatch(fetchEvents())

  return (
    <main className="page">
      <h1>{filters.upcoming ? 'Upcoming events' : 'All events'}</h1>
      <SearchBar value={filters.keyword} onSearch={handleSearch} />
      <CategoryChips
        categories={categories}
        selected={filters.category}
        onSelect={(category) => handleFilterChange({ category })}
      />
      <FilterBar filters={filters} onChange={handleFilterChange} onClear={handleClear} />
      {status === 'loading' && <EventCardSkeleton />}
      {status === 'failed' && <ErrorMessage message={error} onRetry={retry} />}
      {status === 'succeeded' && items.length === 0 && (
        <EmptyState title="No events found" message="Try a different search or clear the filters." />
      )}
      {status === 'succeeded' && items.length > 0 && (
        <>
          <div className="event-grid">
            {items.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(next) => {
              dispatch(setPage(next))
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        </>
      )}
    </main>
  )
}

export default Events
