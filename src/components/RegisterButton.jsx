import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { selectCurrentUser } from '../features/auth/authSlice'
import {
  cancelRegistration,
  registerForEvent,
  selectIsRegistered,
} from '../features/registrations/registrationsSlice'
import { useToast } from './toastContext'

// Register / Cancel button used on event cards and the details page.
function RegisterButton({ event }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const user = useSelector(selectCurrentUser)
  const registered = useSelector(selectIsRegistered(user?.id, event.id))

  const handleClick = () => {
    if (!user) {
      // Remember where we were so Login can send the user back here afterwards.
      showToast('Please log in to register for events.', 'info')
      navigate('/login', { state: { from: location } })
      return
    }
    if (registered) {
      dispatch(cancelRegistration({ userId: user.id, eventId: event.id }))
      showToast(`Registration cancelled for "${event.name}".`, 'info')
    } else {
      dispatch(registerForEvent({ userId: user.id, event }))
      showToast(`You are registered for "${event.name}".`)
    }
  }

  return (
    <button
      type="button"
      className={`btn ${registered ? 'btn--secondary' : ''}`}
      onClick={handleClick}
    >
      {registered ? 'Cancel registration' : 'Register'}
    </button>
  )
}

export default RegisterButton
