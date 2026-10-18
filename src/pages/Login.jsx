import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import { clearError, loginUser, selectAuthError } from '../features/auth/authSlice'
import { validateLogin } from '../utils/validators'
import './Auth.css'

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const authError = useSelector(selectAuthError)
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = validateLogin(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    setSubmitting(true)
    const result = await dispatch(loginUser(values))
    setSubmitting(false)
    if (loginUser.fulfilled.match(result)) navigate('/events', { replace: true })
  }

  return (
    <main className="page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Log in</h1>
        {authError && <p className="form-error" role="alert">{authError}</p>}
        <FormField label="Email" id="email" name="email" type="email" autoComplete="email"
          value={values.email} onChange={handleChange} error={errors.email} />
        <FormField label="Password" id="password" name="password" type="password"
          autoComplete="current-password" value={values.password}
          onChange={handleChange} error={errors.password} />
        <button className="btn btn--block" type="submit" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
        <p className="auth-card__switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </main>
  )
}

export default Login
