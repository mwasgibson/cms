/**
 * API Abstraction Layer
 * ─────────────────────
 * All services import from here, not from individual mock files or axios directly.
 * The mock/real decision is made once in this file via VITE_USE_MOCKS.
 *
 * Pattern:
 *   import { createResource } from '../../lib/apiClient'
 *   export const unitsApi = createResource('units', unitsMock)
 *
 * createResource returns an object with list/get/create/update/remove that
 * transparently delegates to mock or real axios depending on the env flag.
 */
import axios from 'axios'
import { auditLog } from './auditLog'

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'

// ─── Real Axios instance ──────────────────────────────────────────────────────
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { Accept: 'application/json' },
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('pt_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('pt_token')
      window.location.href = '/login'
    }
    // Normalise error shape so callers don't need to dig into axios structure
    const message = err.response?.data?.message || err.message || 'Unknown error'
    const status  = err.response?.status || 0
    const normalised = new Error(message)
    normalised.status  = status
    normalised.data    = err.response?.data
    return Promise.reject(normalised)
  },
)

export { http }

// ─── Simulated latency for mocks ─────────────────────────────────────────────
export function withLatency(value, ms = 300) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

// ─── createResource ───────────────────────────────────────────────────────────
/**
 * Creates a CRUD API for a resource, switching between mock and real.
 *
 * @param {string} resource  - Used for audit log labels (e.g. 'units')
 * @param {object} mock      - Object with list/get/create/update/remove/[extras]
 * @param {object} endpoints - Object with url functions, falls back to API constants
 */
export function createResource(resource, mock, endpoints = {}) {
  const ep = {
    list:   endpoints.list   || (() => `/${resource}`),
    get:    endpoints.get    || ((id) => `/${resource}/${id}`),
    create: endpoints.create || (() => `/${resource}`),
    update: endpoints.update || ((id) => `/${resource}/${id}`),
    remove: endpoints.remove || ((id) => `/${resource}/${id}`),
    ...endpoints,
  }

  const unwrap = (res) => {
    const d = res.data
    return Array.isArray(d) ? d : (d?.data ?? d)
  }

  return {
    list: async (params) => {
      if (USE_MOCKS) return mock.list(params)
      return unwrap(await http.get(ep.list(), { params }))
    },

    get: async (id) => {
      if (USE_MOCKS) return mock.get(id)
      return unwrap(await http.get(ep.get(id)))
    },

    create: async (payload) => {
      if (USE_MOCKS) return mock.create(payload)
      const result = unwrap(await http.post(ep.create(), payload))
      auditLog.record('create', resource, result.id, payload)
      return result
    },

    update: async (id, payload) => {
      if (USE_MOCKS) return mock.update(id, payload)
      const result = unwrap(await http.put(ep.update(id), payload))
      auditLog.record('update', resource, id, payload)
      return result
    },

    // Soft delete — sends DELETE but backend marks deleted_at, not hard removes
    remove: async (id) => {
      if (USE_MOCKS) return mock.remove(id)
      await http.delete(ep.remove(id))
      auditLog.record('delete', resource, id)
    },

    restore: async (id) => {
      if (USE_MOCKS) return mock.restore?.(id)
      const result = unwrap(await http.patch(`${ep.remove(id)}/restore`))
      auditLog.record('restore', resource, id)
      return result
    },

    // Passthrough for custom methods
    raw: http,
  }
}

export const isMock = () => USE_MOCKS
