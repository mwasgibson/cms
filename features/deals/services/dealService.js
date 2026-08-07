import { http } from '../../../lib/apiClient'
import { API } from '../../../utils/constants'
import { auditLog } from '../../../lib/auditLog'

/**
 * Hotel API contract (Express, not Laravel):
 *   GET    /deals            -> Deal[]   (public: active + unexpired only)
 *   GET    /deals/admin      -> Deal[]   (admin: everything, including inactive/expired)
 *   GET    /deals/:id        -> Deal
 *   POST   /deals            -> Deal
 *   PUT    /deals/:id        -> Deal
 *   DELETE /deals/:id        -> { message }   (soft delete: sets active = 0)
 *   PATCH  /deals/:id/restore -> Deal
 *
 * Deal shape:
 *   { id, title, description, discount_type: 'percentage'|'fixed', discount_value,
 *     promo_code, start_date, end_date, image_url, active }
 *
 * Unlike the rest of the CMS, Deals always talks to the real Express API — it
 * doesn't check VITE_USE_MOCKS. This is the one resource with a fully verified
 * live backend integration; other features stay in mock/demo mode until their
 * backends exist, and the global mock flag shouldn't affect this one.
 */

const unwrap = (res) => {
  const d = res.data
  return Array.isArray(d) ? d : (d?.data ?? d)
}

export const listDeals   = async (params) => unwrap(await http.get(API.DEALS, { params }))
export const listAllDeals = async () => unwrap(await http.get(API.DEALS_ADMIN))
export const getDeal     = async (id) => unwrap(await http.get(API.DEAL(id)))

export const createDeal  = async (payload) => {
  const result = unwrap(await http.post(API.DEALS, payload))
  auditLog.record('create', 'deals', result.id, payload)
  return result
}
export const updateDeal  = async (id, payload) => {
  const result = unwrap(await http.put(API.DEAL(id), payload))
  auditLog.record('update', 'deals', id, payload)
  return result
}
export const deleteDeal  = async (id) => {
  await http.delete(API.DEAL(id))
  auditLog.record('delete', 'deals', id)
}
export const restoreDeal = async (id) => {
  const result = unwrap(await http.patch(`${API.DEAL(id)}/restore`))
  auditLog.record('restore', 'deals', id)
  return result
}