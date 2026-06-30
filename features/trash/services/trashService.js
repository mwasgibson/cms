import { http, isMock } from '../../../lib/apiClient'
import { unitsMock }     from '../../units/services/mockUnits'
import { leadsMock }     from '../../leads/services/mockLeads'
import { documentsMock } from '../../documents/services/mockDocuments'
import { postsMock }     from '../../blog/services/mockBlog'
import { projectsMock }  from '../../projects/services/mockProjects'

import { restoreUnit }     from '../../units/services/unitService'
import { restoreLead }     from '../../leads/services/leadService'
import { restoreDocument } from '../../documents/services/documentService'
import { restorePost }     from '../../blog/services/blogService'
import { restoreProject }  from '../../projects/services/projectService'

/**
 * Laravel API contract:
 *   GET /trash       -> { units: [], leads: [], documents: [], posts: [], projects: [] }
 *   All existing restore endpoints handle individual record restoration:
 *     PATCH /units/{id}/restore, /leads/{id}/restore, etc.
 *
 * Hard-delete (permanent) — admin only:
 *   DELETE /units/{id}/force
 *   DELETE /leads/{id}/force
 *   DELETE /documents/{id}/force
 *   DELETE /posts/{id}/force
 *   DELETE /projects/{id}/force
 */

// ─── Aggregate all soft-deleted records from all features ─────────────────────
export async function getTrash() {
  if (isMock()) {
    const [units, leads, documents, posts, projects] = await Promise.all([
      unitsMock.listDeleted(),
      leadsMock.listDeleted(),
      documentsMock.listDeleted(),
      postsMock.listDeleted(),
      projectsMock.listDeleted ? projectsMock.listDeleted() : Promise.resolve([]),
    ])
    return { units, leads, documents, posts, projects }
  }

  const { data } = await http.get('/trash')
  return data
}

// ─── Restore helpers (delegate to each feature's service) ─────────────────────
export const restoreTrashItem = {
  units:     (id) => restoreUnit(id),
  leads:     (id) => restoreLead(id),
  documents: (id) => restoreDocument(id),
  posts:     (id) => restorePost(id),
  projects:  (id) => restoreProject(id),
}

// ─── Hard delete (permanent) — admin only ─────────────────────────────────────
export async function hardDelete(resource, id) {
  if (isMock()) {
    const mockMap = { units: unitsMock, leads: leadsMock, documents: documentsMock, posts: postsMock, projects: projectsMock }
    const store   = mockMap[resource]
    if (store?.hardDelete) return store.hardDelete(id)
    // Fallback: remove from storage by ID
    const keys = { units: 'pt_mock_units', leads: 'pt_mock_leads', documents: 'pt_mock_documents', posts: 'pt_mock_posts', projects: 'pt_mock_projects' }
    const raw  = JSON.parse(localStorage.getItem(keys[resource]) || '[]')
    localStorage.setItem(keys[resource], JSON.stringify(raw.filter((r) => String(r.id) !== String(id))))
    return
  }
  await http.delete(`/${resource}/${id}/force`)
}
