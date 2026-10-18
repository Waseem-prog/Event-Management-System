import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import CancelButton from '../components/CancelButton'
import EmptyState from '../components/EmptyState'
import RegistrationCard from '../components/RegistrationCard'
import { useToast } from '../components/toastContext'
import { selectCurrentUser } from '../features/auth/authSlice'
import {
  cancelRegistration,
  selectUserRegistrations,
} from '../features/registrations/registrationsSlice'
import { isPastEvent } from '../utils/dates'
import '../components/States.css'

function MyEvents() {
  const dispatch = useDispatch()
  const { showToast } = useToast()
  const user = useSelector(selectCurrentUser)
  const registrations = useSelector(selectUserRegistrations)

  // Split by date: soonest upcoming first, most recent completed first.
  const when = (r) => r.event.dateTime || r.event.localDate || ''
  const byDate = (a, b) => when(a).localeCompare(when(b))
  const upcoming = registrations.filter((r) => !isPastEvent(r.event)).sort(byDate)
  const completed = registrations.filter((r) => isPastEvent(r.event)).sort(byDate).reverse()

  const handleCancel = (registration) => {
    dispatch(cancelRegistration({ userId: user.id, eventId: registration.eventId }))
    showToast(`Registration cancelled for "${registration.event.name}".`, 'info')
  }

  if (registrations.length === 0) {
    return (
      <main className="page">
        <h1>My Events</h1>
        <EmptyState
          title="No registrations yet"
          message="Find an event and click Register to see it here."
        />
        <p style={{ textAlign: 'center' }}>
          <Link to="/events">Browse events</Link>
        </p>
      </main>
    )
  }

  return (
    <main className="page">
      <h1>My Events</h1>

      <section aria-labelledby="upcoming-heading">
        <h2 id="upcoming-heading">Upcoming ({upcoming.length})</h2>
        {upcoming.length === 0 ? (
          <EmptyState title="No upcoming events" message="Register for an event to see it here." />
        ) : (
          <div className="event-grid">
            {upcoming.map((r) => (
              <RegistrationCard key={r.id} registration={r}>
                <CancelButton onConfirm={() => handleCancel(r)} />
              </RegistrationCard>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="completed-heading">
        <h2 id="completed-heading">Completed ({completed.length})</h2>
        {completed.length === 0 ? (
          <EmptyState title="No completed events" message="Events you attended will appear here." />
        ) : (
          <div className="event-grid">
            {completed.map((r) => (
              <RegistrationCard key={r.id} registration={r} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default MyEvents
