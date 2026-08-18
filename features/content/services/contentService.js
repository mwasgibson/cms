import api from '../../../app/api'
import { shouldUseMocks } from '../../../utils/mockMode'
import { mockGetContent, mockUpdateSection } from './mockContent'

const EMPTY_CONTENT = {
  home: {},
  navigation: {},
  contact: {},
  footer: {},
  seo: {},
}

function normalizeContent(raw) {
  if (!raw) return EMPTY_CONTENT

  if (!Array.isArray(raw) && typeof raw === 'object') {
    const source = raw.data && !Array.isArray(raw.data) ? raw.data : raw
    if (source.home || source.navigation || source.contact || source.footer || source.seo) {
      return {
        ...EMPTY_CONTENT,
        ...source,
        home: { ...EMPTY_CONTENT.home, ...(source.home || {}) },
        navigation: { ...EMPTY_CONTENT.navigation, ...(source.navigation || {}) },
        contact: { ...EMPTY_CONTENT.contact, ...(source.contact || {}) },
        footer: { ...EMPTY_CONTENT.footer, ...(source.footer || {}) },
        seo: { ...EMPTY_CONTENT.seo, ...(source.seo || {}) },
      }
    }
  }

  const records = Array.isArray(raw)
    ? raw
    : Array.isArray(raw.data)
      ? raw.data
      : []

  const grouped = {}

  for (const record of records) {
    if (!record || typeof record !== 'object') continue

    const section = record.section || record.slug || record.page
    const key = record.key || record.field || record.name
    if (!section) continue

    if (record.data && typeof record.data === 'object' && !Array.isArray(record.data)) {
      grouped[section] = { ...(grouped[section] || {}), ...record.data }
      continue
    }

    if (key) {
      if (!grouped[section]) grouped[section] = {}
      grouped[section][key] = record.value ?? record.content ?? ''
    } else if (record.value !== undefined) {
      grouped[section] = record.value
    }
  }

  return {
    ...EMPTY_CONTENT,
    ...grouped,
    home: { ...EMPTY_CONTENT.home, ...(grouped.home || {}) },
    navigation: { ...EMPTY_CONTENT.navigation, ...(grouped.navigation || {}) },
    contact: { ...EMPTY_CONTENT.contact, ...(grouped.contact || {}) },
    footer: { ...EMPTY_CONTENT.footer, ...(grouped.footer || {}) },
    seo: { ...EMPTY_CONTENT.seo, ...(grouped.seo || {}) },
  }
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

export async function updateSection(section, payload) {
  if (shouldUseMocks()) return mockUpdateSection(section, payload)

  const { data } = await api.get('/content')
  const records = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : [])
  const matchingRecords = records.filter((item) => item?.section === section)

  if (matchingRecords.length === 0) {
    return createContent({ section, ...payload })
  }

  const results = await Promise.all(
    matchingRecords.map((item) => updateContent(item.id, payload))
  )

  return results.length === 1 ? results[0] : results
}
