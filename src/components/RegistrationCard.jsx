import { Link } from 'react-router-dom'
import { formatEventDate } from '../utils/dates'
import './EventCard.css'

// Card for one registration. It reads the saved event snapshot, so no API call is needed.
function RegistrationCard({ registration, children }) {
  const { event, registeredAt } = registration
  const place = [event.venue, event.city].filter(Boolean).join(', ')
  return (
    <article className="event-card">
      {event.image ? (
        <img className="event-card__image" src={event.image} alt={event.name} loading="lazy" />
      ) : (
        <div className="event-card__image event-card__image--empty">No image</div>
      )}
      <div className="event-card__body">
        {event.category && <span className="event-card__badge">{event.category}</span>}
        <h3 className="event-card__title">
          <Link to={`/events/${event.id}`}>{event.name}</Link>
        </h3>
        <p className="event-card__meta">{formatEventDate(event.localDate, event.localTime)}</p>
        {place && <p className="event-card__meta">{place}</p>}
        <p className="event-card__meta">
          Registered on {new Date(registeredAt).toLocaleDateString()}
        </p>
        {children && <div className="event-card__actions">{children}</div>}
      </div>
    </article>
  )
}

export default RegistrationCard
