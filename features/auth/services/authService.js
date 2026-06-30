import { http, isMock, withLatency } from '../../../lib/apiClient'
import { API } from '../../../utils/constants'
import { auditLog } from '../../../lib/auditLog'

const TOKEN_KEY    = 'pt_token'
const MOCK_USER_KEY = 'pt_mock_user'

const DEFAULT_MOCK_USER = {
  id: 1, name: 'Admin', email: 'admin@pandatowers.africa', role: 'admin',
}

export async function login({ email, password }) {
  if (isMock()) {
    if (!email || !password) throw Object.assign(new Error('Email and password are required.'), { response: { data: { message: 'Email and password are required.' } } })
    const user = { ...DEFAULT_MOCK_USER, email }
    await withLatency(null, 400)
    localStorage.setItem(TOKEN_KEY, 'mock-token')
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user))
    auditLog.record('login', 'auth', user.id)
    return user
  }
  const { data } = await http.post(API.LOGIN, { email, password })
  localStorage.setItem(TOKEN_KEY, data.token)
  auditLog.record('login', 'auth', data.user?.id)
  return data.user
}

export async function logout() {
  if (isMock()) {
    auditLog.record('logout', 'auth', JSON.parse(localStorage.getItem(MOCK_USER_KEY) || '{}').id)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(MOCK_USER_KEY)
    return
  }
  try { await http.post(API.LOGOUT) } finally { localStorage.removeItem(TOKEN_KEY) }
}

export async function fetchCurrentUser() {
  if (isMock()) {
    const stored = localStorage.getItem(MOCK_USER_KEY)
    return withLatency(stored ? JSON.parse(stored) : DEFAULT_MOCK_USER, 200)
  }
  const { data } = await http.get(API.ME)
  return data
}

export const getToken = () => localStorage.getItem(TOKEN_KEY)
