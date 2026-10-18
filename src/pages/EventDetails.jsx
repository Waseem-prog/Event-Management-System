import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import Loader from '../components/Loader'
import { fetchEventById, selectEvents } from '../features/events/eventsSlice'
import { formatEventDate } from '../utils/dates'
import '../components/States.css'
import '../components/EventCard.css'
import './EventDetails.css'

function EventDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selected, selectedStatus, selectedError } = useSelector(selectEvents)

  useEffect(() => {
    const request = dispatch(fetchEventById(id))
    return () => request.abort()
  }, [dispatch, id])

  // Go back to wherever the user came from (keeps their search and page);
  // if the page was opened directly there is no history, so go to the list.
  const goBack = () => (window.history.length > 1 ? navigate(-1) : navigate('/events'))
  const retry = () => dispatch(fetchEventById(id))

  // `selected` may still hold the previously viewed event for one render,
  // so make sure it matches the id in the URL before showing it.
  const event = selected?.id === id ? selected : null

  return (
    <main className="page">
      <button type="button" className="btn btn--secondary back-link" onClick={goBack}>
        &larr; Back
      </button>
      {(selectedStatus === 'loading' || (selectedStatus === 'idle' && !event)) && (
        <Loader label="Loading event..." />
      )}
      {selectedStatus === 'failed' && (
        <ErrorMessage message={selectedError} onRetry={retry} />
      )}
      {event && selectedStatus === 'succeeded' && (
        <article className="details">
          {event.image && <img className="details__image" src={event.image} alt={event.name} />}
          <div className="details__body">
            {event.category && <span className="event-card__badge">{event.category}</span>}
            <h1 className="details__title">{event.name}</h1>
            <dl className="details__list">
              <dt>Date &amp; time</dt>
              <dd>{formatEventDate(event.localDate, event.localTime)}</dd>
              <dt>Venue</dt>
              <dd>{event.venue || 'To be announced'}</dd>
              <dt>Location</dt>
              <dd>
                {[event.address, event.city, event.state, event.country]
                  .filter(Boolean)
                  .join(', ') || 'To be announced'}
              </dd>
              <dt>Type</dt>
              <dd>{[event.category, event.genre].filter(Boolean).join(' / ') || 'Not specified'}</dd>
            </dl>
            <div className="details__actions">
              {event.url && (
                <a
                  className="btn btn--link"
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buy tickets on Ticketmaster
                </a>
              )}
            </div>
          </div>
        </article>
      )}
    </main>
  )
}

export default EventDetails
