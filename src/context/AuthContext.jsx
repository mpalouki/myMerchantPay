import React, { createContext, useContext, useMemo, useState } from 'react'
import { login as loginRequest, getMerchantProfile } from '../api/client.js'
import { decodeJwt, isTokenExpired } from '../api/jwt.js'

const AuthContext = createContext(null)

const TOKEN_KEY = 'mmp_token'
const USER_KEY = 'mmp_user'

function readStoredSession() {
  const token = sessionStorage.getItem(TOKEN_KEY)
  if (!token || isTokenExpired(token)) {
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)
    return { token: null, user: null }
  }

  const saved = sessionStorage.getItem(USER_KEY)
  let user = null
  try {
    user = saved ? JSON.parse(saved) : null
  } catch {
    user = null
  }

  return { token, user }
}

export function AuthProvider({ children }) {
  const initial = readStoredSession()
  const [token, setToken] = useState(initial.token)
  const [user, setUser] = useState(initial.user)

  // 1) POST /api/login -> { token }. 2) decode the JWT for username/roles.
  // 3) GET /api/merchant/me (Bearer <token>) -> { email, merchant: {...} }.
  const login = async (email, password) => {
    const { token: nextToken } = await loginRequest(email, password)
    const claims = decodeJwt(nextToken) || {}

    let profile = null
    try {
      profile = await getMerchantProfile(nextToken)
    } catch {
      profile = null
    }

    const nextUser = {
      email: profile?.email || claims.username || email,
      roles: claims.roles || [],
      merchant: profile?.merchant || null,
    }

    setToken(nextToken)
    setUser(nextUser)
    sessionStorage.setItem(TOKEN_KEY, nextToken)
    sessionStorage.setItem(USER_KEY, JSON.stringify(nextUser))

    return nextUser
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)
  }

  const value = useMemo(
    () => ({
      user,
      token,
      merchant: user?.merchant ?? null,
      isAuthenticated: !!token,
      login,
      logout,
    }),
    [user, token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
