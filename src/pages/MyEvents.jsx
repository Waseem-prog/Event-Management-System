import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import RegistrationCard from '../components/RegistrationCard'
import { selectCurrentUser } from '../features/auth/authSlice'
import { selectUserRegistrations } from '../features/registrations/registrationsSlice'
import '../components/States.css'

function MyEvents() {
  const user = useSelector(selectCurrentUser)
  const registrations = useSelector(selectUserRegistrations)

  if (!user) {
    return (
      <main className="page">
        <h1>My Events</h1>
        <EmptyState title="Please log in" message="Log in to see the events you registered for." />
      </main>
    )
  }

  return (
    <main className="page">
      <h1>My Events</h1>
      {registrations.length === 0 ? (
        <EmptyState
          title="No registrations yet"
          message="Find an event and click Register to see it here."
        />
      ) : (
        <div className="event-grid">
          {registrations.map((r) => (
            <RegistrationCard key={r.id} registration={r} />
          ))}
        </div>
      )}
      {registrations.length === 0 && (
        <p style={{ textAlign: 'center' }}>
          <Link to="/events">Browse events</Link>
        </p>
      )}
    </main>
  )
}

export default MyEvents
