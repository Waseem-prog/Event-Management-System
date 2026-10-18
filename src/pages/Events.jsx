import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import EventCard from '../components/EventCard'
import Loader from '../components/Loader'
import Pagination from '../components/Pagination'
import SearchBar from '../components/SearchBar'
import { fetchEvents, selectEvents, setFilters, setPage } from '../features/events/eventsSlice'
import '../components/States.css'

function Events() {
  const dispatch = useDispatch()
  const { items, status, error, page, totalPages, filters } = useSelector(selectEvents)

  // Reload whenever the page number changes (and once on first visit).
  useEffect(() => {
    const request = dispatch(fetchEvents())
    return () => request.abort() // cancel in-flight request if we leave or re-fetch
  }, [dispatch, page, filters])

  const handleSearch = useCallback(
    (keyword) => dispatch(setFilters({ keyword })),
    [dispatch],
  )

  const retry = () => dispatch(fetchEvents())

  return (
    <main className="page">
      <h1>Upcoming events</h1>
      <SearchBar value={filters.keyword} onSearch={handleSearch} />
      {status === 'loading' && <Loader label="Loading events..." />}
      {status === 'failed' && <ErrorMessage message={error} onRetry={retry} />}
      {status === 'succeeded' && items.length === 0 && (
        <EmptyState title="No events found" message="Try a different search." />
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
