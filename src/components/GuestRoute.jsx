import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { selectCurrentUser } from '../features/auth/authSlice'

// Wrap /login and /register in <GuestRoute>: logged-in users have no reason
// to see them, so they are sent on to the page they came from (or the events
// list). Using the same "from" target as the login form avoids a redirect clash
// right after a successful login.
function GuestRoute({ children }) {
  const user = useSelector(selectCurrentUser)
  const location = useLocation()
  if (user) {
    const from = location.state?.from
    return <Navigate to={from ? from.pathname + (from.search || '') : '/events'} replace />
  }
  return children
}

export default GuestRoute
