import { http } from '../../../lib/apiClient'
import { API } from '../../../utils/constants'
import { auditLog } from '../../../lib/auditLog'

/**
 * Authentication service
 * ──────────────────────
 * Authentication is handled by the hotel backend.
 *
 * The backend:
 *   - Validates the user's credentials
 *   - Creates the JWT
 *   - Stores the JWT in an HTTP-only `token` cookie
 *   - Expires the cookie after the configured lifetime
 *
 * The frontend never reads or stores the JWT.
 * Axios sends the cookie automatically via `withCredentials: true`.
 *
 * The admin panel is restricted to users with the `admin` role.
 */

export async function login({ email, password }) {
  const { data } = await http.post(API.LOGIN, {
    email,
    password,
  })

  if (data.role !== 'admin') {
    try {
      await http.post(API.LOGOUT)
    } catch {
      // Ignore logout errors.
    }

    throw Object.assign(
      new Error(
        'This admin panel is restricted to hotel administrators.',
      ),
      {
        response: {
          data: {
            message:
              'This admin panel is restricted to hotel administrators.',
          },
        },
      },
    )
  }

  const user = await fetchCurrentUser()

  auditLog.record('login', 'auth', user?.id)

  return user
}

export async function logout() {
  try {
    await http.post(API.LOGOUT)
  } finally {
    // JWT is stored in an HTTP-only cookie.
    // The backend is responsible for clearing it.
  }
}

export async function fetchCurrentUser() {
  const { data } = await http.get(API.ME)
  return data
}

/**
 * Kept for compatibility with existing CMS code.
 *
 * The JWT is now stored in an HTTP-only cookie, so JavaScript
 * cannot and should not read it.
 */
export const getToken = () => null