// Reads the payload claims out of a JWT without verifying the signature —
// verification happens server-side; this is only for display/UX decisions
// (e.g. knowing the token's expiry) on the client.
export function decodeJwt(token) {
  if (!token) return null
  const [, payload] = token.split('.')
  if (!payload) return null

  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function isTokenExpired(token) {
  const claims = decodeJwt(token)
  if (!claims?.exp) return false
  return claims.exp * 1000 <= Date.now()
}
