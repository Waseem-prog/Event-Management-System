import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import EventCard from '../components/EventCard'
import Loader from '../components/Loader'
import { fetchEvents, selectEvents } from '../features/events/eventsSlice'
import '../components/States.css'

function Events() {
  const dispatch = useDispatch()
  const { items, status, error, page } = useSelector(selectEvents)

  // Reload whenever the page number changes (and once on first visit).
  useEffect(() => {
    const request = dispatch(fetchEvents())
    return () => request.abort() // cancel in-flight request if we leave or re-fetch
  }, [dispatch, page])

  const retry = () => dispatch(fetchEvents())

  return (
    <main className="page">
      <h1>Upcoming events</h1>
      {status === 'loading' && <Loader label="Loading events..." />}
      {status === 'failed' && <ErrorMessage message={error} onRetry={retry} />}
      {status === 'succeeded' && items.length === 0 && (
        <EmptyState title="No events found" message="Try again later." />
      )}
      {status === 'succeeded' && items.length > 0 && (
        <div className="event-grid">
          {items.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </main>
  )
}

export default Events
