import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { logout, selectCurrentUser } from '../features/auth/authSlice'
import './Navbar.css'

function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectCurrentUser)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <header className="navbar">
      <NavLink to="/events" className="navbar__brand">
        EventHub
      </NavLink>
      <nav className="navbar__links">
        <NavLink to="/events">Events</NavLink>
        <NavLink to="/my-events">My Events</NavLink>
        {user ? (
          <>
            <span className="navbar__user">Hi, {user.name}</span>
            <button type="button" className="navbar__logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  )
}

export default Navbar
