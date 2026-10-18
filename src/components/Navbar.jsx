import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <NavLink to="/events" className="navbar__brand">
        EventHub
      </NavLink>
      <nav className="navbar__links">
        <NavLink to="/events">Events</NavLink>
        <NavLink to="/my-events">My Events</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/register">Register</NavLink>
      </nav>
    </header>
  )
}

export default Navbar
