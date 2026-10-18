// SHA-256 hash of a password using the browser's Web Crypto API.
// This is only a frontend simulation: real apps hash on the server with a salt.
export async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
