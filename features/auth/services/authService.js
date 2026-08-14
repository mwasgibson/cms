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

/**
 * Authenticate an admin user.
 *
 * The backend sets the HTTP-only authentication cookie when
 * the credentials are valid. We then fetch the current user
 * from the backend rather than storing the JWT ourselves.
 */
export async function login({ email, password }) {
  const { data } = await http.post(API.LOGIN, {
    email,
    password,
  })

  // The hotel backend authenticates valid users regardless of role.
  // The CMS itself is restricted to administrators.
  if (data.role !== 'admin') {
    // Ask the backend to clear the authentication cookie.
    // The frontend cannot remove an HTTP-only cookie directly.
    try {
      await http.post(API.LOGOUT)
    } catch {
      // Ignore logout errors here. The original login succeeded,
      // but this user is not allowed to access the admin panel.
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

  // The JWT is stored in the HTTP-only cookie by the backend.
  // Fetch the authenticated user's information using that cookie.
  const user = await fetchCurrentUser()

  auditLog.record('login', 'auth', user?.id)

  return user
}

/**
 * Log the current user out.
 *
 * The backend is responsible for clearing the HTTP-only
 * authentication cookie.
 */
export async function logout() {
  try {
    await http.post(API.LOGOUT)
  } finally {
    // No localStorage cleanup is required.
    // The JWT is stored in an HTTP-only cookie owned by the backend.
  }
}

/**
 * Fetch the currently authenticated user.
 *
 * The browser automatically sends the HTTP-only `token` cookie
 * with the request because the Axios client uses withCredentials.
 */
export async function fetchCurrentUser() {
  const { data } = await http.get(API.ME)
  return data
}