import { http } from '../../../lib/apiClient'
import { API } from '../../../utils/constants'
import { auditLog } from '../../../lib/auditLog'

const TOKEN_KEY = 'token'

/**
 * Auth always talks to the real hotel backend, regardless of VITE_USE_MOCKS.
 * Deals and Rooms are wired to the live API and need a real JWT to pass
 * authMiddleware — a mock token would just get rejected as invalid. Content,
 * Settings, and Blog can stay in mock/demo mode for their own data since they
 * never send this token anywhere; being logged in for real doesn't affect them.
 */

export async function login({ email, password }) {
  // Hotel backend returns { message, role, token } — no embedded user object,
  // and login succeeds for any valid account regardless of role. This admin
  // panel is admin-only, so we reject non-admins here even though their
  // credentials were valid against the hotel's own login.
  const { data } = await http.post(API.LOGIN, { email, password })
  if (data.role !== 'admin') {
    localStorage.removeItem(TOKEN_KEY)
    throw Object.assign(new Error('This admin panel is restricted to hotel administrators.'), {
      response: { data: { message: 'This admin panel is restricted to hotel administrators.' } },
    })
  }
  localStorage.setItem(TOKEN_KEY, data.token)
  const user = await fetchCurrentUser()
  auditLog.record('login', 'auth', user?.id)
  return user
}

export async function logout() {
  try {
    await http.post(API.LOGOUT)
  } finally {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export async function fetchCurrentUser() {
  const { data } = await http.get(API.ME)
  return data
}

export const getToken = () => localStorage.getItem(TOKEN_KEY)