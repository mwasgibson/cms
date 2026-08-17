import { http } from '../../../lib/apiClient'

/**
 * Trash API contract (hotel backend):
 *   GET    /trash       -> deleted trash records
 *   GET    /trash/:id   -> one trash record
 *   PATCH  /trash/:id/restore
 *   DELETE /trash/:id  -> permanently delete the trash record
 *
 * The backend owns restore behavior. The CMS uses the trash item's id,
 * not the original resource id, when restoring or permanently deleting.
 */

export async function getTrash() {
  const { data } = await http.get('/trash')
  return data
}

export async function getTrashItem(id) {
  const { data } = await http.get(`/trash/${id}`)
  return data
}

export async function restoreTrashItem(id) {
  const { data } = await http.patch(`/trash/${id}/restore`)
  return data
}

export async function hardDelete(id) {
  const { data } = await http.delete(`/trash/${id}`)
  return data
}

export async function permanentlyDelete(id) {
  return hardDelete(id)
}

export function getTrashItemId(item) {
  return item?.id
}
