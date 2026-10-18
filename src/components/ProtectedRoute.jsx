import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { selectCurrentUser } from '../features/auth/authSlice'

// Wrap a page in <ProtectedRoute> so only logged-in users can see it.
// Logged-out visitors go to /login; we pass the page they wanted in
// `state.from`, and Login sends them back there after a successful login.
function ProtectedRoute({ children }) {
  const user = useSelector(selectCurrentUser)
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}

export default ProtectedRoute
