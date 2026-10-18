import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../utils/useDocumentTitle'
import '../components/States.css'

function NotFound() {
  useDocumentTitle('Page not found')
  return (
    <main className="page">
      <div className="state-box">
        <h1>404 - Page not found</h1>
        <p>The page you are looking for does not exist or has moved.</p>
        <Link className="btn" to="/events">
          Browse events
        </Link>
      </div>
    </main>
  )
}

export default NotFound
