import './Skeleton.css'

// Grey placeholder cards shown while events load (feels faster than a spinner).
function EventCardSkeleton({ count = 6 }) {
  return (
    <div className="event-grid" role="status" aria-label="Loading events">
      {Array.from({ length: count }, (_, i) => (
        <div className="event-card skeleton-card" key={i} aria-hidden="true">
          <div className="skeleton skeleton--image" />
          <div className="event-card__body">
            <div className="skeleton skeleton--line skeleton--short" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line skeleton--medium" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default EventCardSkeleton
