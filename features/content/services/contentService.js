import api from '../../../app/api'
import { shouldUseMocks } from '../../../utils/mockMode'
import { mockGetContent, mockUpdateSection } from './mockContent'

/**
 * CMS website content API.
 *
 * The content resource is owned by the CMS and stores website copy as
 * page/section/key/value records in the hotel backend database.
 *
 * GET    /content          -> all content records
 * GET    /content/:page    -> content for one page
 * POST   /content          -> create a content record
 * PUT    /content/:id      -> update a content record
 * DELETE /content/:id      -> remove a content record
 */

export async function getContent() {
  if (shouldUseMocks()) return mockGetContent()

  const { data } = await api.get('/content')
  return data
}

export async function getPageContent(page) {
  if (shouldUseMocks()) {
    const content = await mockGetContent()
    return content?.[page] ?? {}
  }

  const { data } = await api.get(`/content/${encodeURIComponent(page)}`)
  return data
}

export async function createContent(payload) {
  if (shouldUseMocks()) return mockUpdateSection(payload?.section, payload)

  const { data } = await api.post('/content', payload)
  return data
}

export async function updateContent(id, payload) {
  if (shouldUseMocks()) return mockUpdateSection(payload?.section, payload)

  const { data } = await api.put(`/content/${id}`, payload)
  return data
}

export async function deleteContent(id) {
  if (shouldUseMocks()) return { message: 'Content deleted' }

  const { data } = await api.delete(`/content/${id}`)
  return data
}

// Kept for existing Content pages that still save a named section.
// New code should prefer createContent/updateContent with the actual record ID.
export async function updateSection(section, payload) {
  if (shouldUseMocks()) return mockUpdateSection(section, payload)

  const content = await getContent()
  const records = Array.isArray(content) ? content : []
  const matchingRecords = records.filter((item) => item.section === section)

  if (matchingRecords.length === 0) {
    return createContent({ section, ...payload })
  }

  const results = await Promise.all(
    matchingRecords.map((item) => updateContent(item.id, payload))
  )

  return results.length === 1 ? results[0] : results
}
