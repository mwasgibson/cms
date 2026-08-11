import { http } from '../../../lib/apiClient'
import { restoreRoom }     from '../../rooms/services/roomService'
import { restoreDocument } from '../../documents/services/documentService'
import { restorePost }     from '../../blog/services/blogService'
import { restoreDeal } from '../../deals/services/dealService'

/**
 * Laravel API contract:
 *   GET /trash       -> { deals: [], documents: [], posts: [], projects: [], rooms: [] }
 *   All existing restore endpoints handle individual record restoration:
 *     PATCH /room/{id}/restore, /deals/{id}/restore, etc.
 *
 * Hard-delete (permanent) — admin only:
 *   DELETE /deals/{id}/force
 *   DELETE /documents/{id}/force
 *   DELETE /posts/{id}/force
 *   DELETE /rooms/{id}/force
 */

// ─── Aggregate all soft-deleted records from all features ─────────────────────
export async function getTrash() {
  const { data } = await http.get('/trash')
  return data
}

// ─── Restore helpers (delegate to each feature's service) ─────────────────────
export const restoreTrashItem = {
  deals:     (id) => restoreDeal(id),
  documents: (id) => restoreDocument(id),
  posts:     (id) => restorePost(id),
  rooms:     (id) => restoreRoom(id),
}

// ─── Hard delete (permanent) — admin only ─────────────────────────────────────
export async function hardDelete(resource, id) {
  await http.delete(`/${resource}/${id}/force`)
}
