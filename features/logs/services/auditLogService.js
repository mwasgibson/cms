import { http } from '../../../lib/apiClient'

/**
 * Audit API contract (hotel backend):
 *   GET /audits
 *   GET /audits/:id
 *
 * Query params supported by the backend include:
 *   action, entity_type, user_id, page, limit
 */
export async function getAuditLogs(params = {}) {
  const { data } = await http.get('/audits', { params })
  return data
}

export async function getAuditLog(id) {
  const { data } = await http.get(`/audits/${id}`)
  return data
}
