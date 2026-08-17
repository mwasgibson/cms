import { http } from '../../../lib/apiClient'
import { API } from '../../../utils/constants'
import { auditLog } from '../../../lib/auditLog'

/**
 * Hotel API contract (Express, not Laravel):
 *   GET    /documents       -> Document[]  (public)
 *   GET    /documents/:id   -> Document     (public)
 *   POST   /documents       -> Document     (admin only, multipart/form-data)
 *   DELETE /documents/:id   -> { message }  (admin only, hard delete — also removes the R2 object)
 *
 * Document shape:
 *   { id, title, category, file_key, file_name, mime_type, size_bytes,
 *     uploaded_by, created_at, download_url }
 *   download_url is a signed URL valid for ~1 hour — re-fetch the list/item
 *   rather than caching it long-term.
 *
 * Like Deals/Rooms/Auth, Documents always talks to the real Express API
 * regardless of VITE_USE_MOCKS.
 */

const unwrap = (res) => {
  const d = res.data
  return Array.isArray(d) ? d : (d?.data ?? d)
}

export const listDocuments = async () => unwrap(await http.get(API.DOCUMENTS))
export const getDocument   = async (id) => unwrap(await http.get(API.DOCUMENT(id)))

export const uploadDocument = async ({ title, category, file }) => {
  const form = new FormData()
  form.append('title', title)
  form.append('category', category)
  form.append('file', file)

  const result = unwrap(await http.post(API.DOCUMENTS, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }))
  auditLog.record('create', 'documents', result.id, { title, category })
  return result
}

export const deleteDocument = async (id) => {
  await http.delete(API.DOCUMENT(id))
  auditLog.record('delete', 'documents', id)
}
export const restoreDocument = async (id) => {
  const result = unwrap(await http.patch(`${API.DOCUMENT(id)}/restore`))
  auditLog.record('restore', 'documents', id)
  return result
}