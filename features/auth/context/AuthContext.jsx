import { useEffect, useState, useCallback } from 'react'
import { AuthContext } from './auth-context'
import { getToken, fetchCurrentUser, login as loginRequest, logout as logoutRequest } from '../services/authService'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // If there's no token, we already know there's nothing to check — start "not loading".
  const [loading, setLoading] = useState(() => !!getToken())

  useEffect(() => {
    if (!loading) return

    let cancelled = false

    fetchCurrentUser()
      .then((fetchedUser) => {
        if (!cancelled) setUser(fetchedUser)
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [loading])

  const login = useCallback(async (credentials) => {
    const loggedInUser = await loginRequest(credentials)
    setUser(loggedInUser)
    return loggedInUser
  }, [])

  const logout = useCallback(async () => {
    await logoutRequest()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}
