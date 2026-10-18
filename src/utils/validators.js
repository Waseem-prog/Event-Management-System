// Each validator returns an object of field -> error message ({} means valid).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLogin({ email, password }) {
  const errors = {}
  if (!email.trim()) errors.email = 'Email is required.'
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address.'
  if (!password) errors.password = 'Password is required.'
  return errors
}

export function validateRegister({ name, email, password, confirmPassword }) {
  const errors = validateLogin({ email, password })
  if (!name.trim()) errors.name = 'Name is required.'
  else if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters.'
  if (password) {
    if (password.length < 8) errors.password = 'Password must be at least 8 characters.'
    else if (!/[A-Za-z]/.test(password) || !/\d/.test(password))
      errors.password = 'Password must contain a letter and a number.'
  }
  if (!confirmPassword) errors.confirmPassword = 'Please confirm your password.'
  else if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match.'
  return errors
}
