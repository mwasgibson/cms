import { useEffect, useState, useCallback } from 'react'
import { AuthContext } from './auth-context'
import {
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from '../services/authService'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore the authenticated session when the app starts.
  // The JWT is stored in an HTTP-only cookie, so we cannot
  // check it from JavaScript. Instead, ask the backend.
  useEffect(() => {
    let cancelled = false

    fetchCurrentUser()
      .then((fetchedUser) => {
        if (!cancelled) {
          setUser(fetchedUser)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

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
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}