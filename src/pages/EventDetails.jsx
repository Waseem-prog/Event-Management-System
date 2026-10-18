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

// Format a price range like "$45 - $120"; one number if min equals max.
function formatPrice(price) {
  if (!price) return null
  const fmt = (n) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency: price.currency || 'USD' }).format(n)
  return price.min === price.max ? fmt(price.min) : `${fmt(price.min)} - ${fmt(price.max)}`
}

// Ticketmaster status codes -> readable text.
const STATUS_LABELS = {
  cancelled: 'Cancelled',
  postponed: 'Postponed',
  rescheduled: 'Rescheduled',
  offsale: 'Off sale',
}

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
              {event.price && (
                <>
                  <dt>Price</dt>
                  <dd>{formatPrice(event.price)}</dd>
                </>
              )}
              {STATUS_LABELS[event.status] && (
                <>
                  <dt>Status</dt>
                  <dd className="details__status">{STATUS_LABELS[event.status]}</dd>
                </>
              )}
              <dt>Type</dt>
              <dd>{[event.category, event.genre].filter(Boolean).join(' / ') || 'Not specified'}</dd>
            </dl>
            {event.info && (
              <section className="details__section">
                <h2>Event info</h2>
                <p>{event.info}</p>
              </section>
            )}
            {event.pleaseNote && (
              <section className="details__section">
                <h2>Please note</h2>
                <p>{event.pleaseNote}</p>
              </section>
            )}
            {event.seatmap && (
              <section className="details__section">
                <h2>Seat map</h2>
                <img className="details__seatmap" src={event.seatmap} alt="Venue seat map" loading="lazy" />
              </section>
            )}
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
