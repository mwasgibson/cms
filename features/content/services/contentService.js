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

const EMPTY_CONTENT = {
  hero: {
    headline: '',
    subheadline: '',
    cta_primary: '',
    cta_secondary: '',
    badge: '',
  },
  about: {
    tagline: '',
    developer_description: '',
    mission: '',
    vision: '',
  },
  investment_calculator: {},
  payment_plans: {},
  project_specs: {},
  faq: [],
  track_record: [],
  seo: {},
}

/**
 * The mock content service already returns the shape consumed by Content.jsx.
 * The real backend can return either that shape or normalized records such as:
 *   { section: 'hero', key: 'headline', value: '...' }
 *
 * Keep that API difference out of the page component. React should not have to
 * play detective every time the backend changes its response envelope.
 */
function normalizeContent(raw) {
  if (!raw) return EMPTY_CONTENT

  // Already in the shape expected by the editor.
  if (!Array.isArray(raw) && typeof raw === 'object') {
    const source = raw.data && !Array.isArray(raw.data) ? raw.data : raw
    if (source.hero || source.about || source.faq || source.seo) {
      return {
        ...EMPTY_CONTENT,
        ...source,
        hero: { ...EMPTY_CONTENT.hero, ...(source.hero || {}) },
        about: { ...EMPTY_CONTENT.about, ...(source.about || {}) },
        faq: Array.isArray(source.faq) ? source.faq : [],
        track_record: Array.isArray(source.track_record) ? source.track_record : [],
        seo: source.seo || {},
      }
    }
  }

  const records = Array.isArray(raw)
    ? raw
    : Array.isArray(raw.data)
      ? raw.data
      : []

  const result = {
    ...EMPTY_CONTENT,
    hero: { ...EMPTY_CONTENT.hero },
    about: { ...EMPTY_CONTENT.about },
    investment_calculator: {},
    payment_plans: {},
    project_specs: {},
    faq: [],
    track_record: [],
    seo: {},
  }

  const grouped = {}

  for (const record of records) {
    if (!record || typeof record !== 'object') continue

    const section = record.section || record.slug || record.page
    const key = record.key || record.field || record.name

    // Some APIs return { section, data: {...} } instead of individual records.
    if (section && record.data && typeof record.data === 'object' && !Array.isArray(record.data)) {
      grouped[section] = { ...(grouped[section] || {}), ...record.data }
      continue
    }

    if (!section) continue

    if (key) {
      if (!grouped[section]) grouped[section] = {}
      grouped[section][key] = record.value ?? record.content ?? record.data ?? ''
    } else if (record.value !== undefined) {
      grouped[section] = record.value
    }
  }

  for (const [section, value] of Object.entries(grouped)) {
    if (section.startsWith('seo_')) {
      result.seo[section.replace('seo_', '')] = value
    } else if (Object.prototype.hasOwnProperty.call(result, section)) {
      result[section] = value
    }
  }

  result.hero = { ...EMPTY_CONTENT.hero, ...(result.hero || {}) }
  result.about = { ...EMPTY_CONTENT.about, ...(result.about || {}) }
  result.faq = Array.isArray(result.faq) ? result.faq : []
  result.track_record = Array.isArray(result.track_record) ? result.track_record : []

  return result
}

export async function getContent() {
  if (shouldUseMocks()) return mockGetContent()

  const { data } = await api.get('/content')
  return normalizeContent(data)
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
