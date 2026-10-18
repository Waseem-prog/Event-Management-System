import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import { clearError, registerUser, selectAuthError } from '../features/auth/authSlice'
import { useDocumentTitle } from '../utils/useDocumentTitle'
import { validateRegister } from '../utils/validators'
import './Auth.css'

function Register() {
  useDocumentTitle('Register')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  // Where to go after success: the page the user came from, or the events list.
  const from = location.state?.from
  const returnTo = from ? from.pathname + (from.search || '') : '/events'
  const authError = useSelector(selectAuthError)
  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Clear stale errors (e.g. from the login page) when this page opens.
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = validateRegister(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    setSubmitting(true)
    const result = await dispatch(registerUser(values))
    setSubmitting(false)
    if (registerUser.fulfilled.match(result)) navigate(returnTo, { replace: true })
  }

  return (
    <main className="page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Create account</h1>
        {authError && <p className="form-error" role="alert">{authError}</p>}
        <FormField label="Name" id="name" name="name" autoComplete="name"
          value={values.name} onChange={handleChange} error={errors.name} />
        <FormField label="Email" id="email" name="email" type="email" autoComplete="email"
          value={values.email} onChange={handleChange} error={errors.email} />
        <FormField label="Password" id="password" name="password" type="password"
          autoComplete="new-password" value={values.password}
          onChange={handleChange} error={errors.password} />
        <FormField label="Confirm password" id="confirmPassword" name="confirmPassword"
          type="password" autoComplete="new-password" value={values.confirmPassword}
          onChange={handleChange} error={errors.confirmPassword} />
        <button className="btn btn--block" type="submit" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Register'}
        </button>
        <p className="auth-card__switch">
          Already have an account? <Link to="/login" state={location.state}>Log in</Link>
        </p>
      </form>
    </main>
  )
}

export default Register
