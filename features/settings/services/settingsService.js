import { http, isMock } from '../../../lib/apiClient'
import { API } from '../../../utils/constants'
import {
  mockGetSettings,
  mockUpdateGeneralSettings,
  mockUpdateContactSettings,
  mockUpdateSocialSettings,
  mockUpdateSeoSettings,
} from './mockSettings'

/**
 * Hotel backend settings API:
 *   GET    /settings       -> setting rows
 *   GET    /settings/:key  -> one setting row
 *   POST   /settings       -> create a setting
 *   PUT    /settings/:key  -> update a setting
 *   DELETE /settings/:key  -> move a setting to trash
 *
 * The CMS settings UI is section-based, while the hotel backend stores
 * individual key/value settings. This service keeps that difference out of
 * the pages by translating between the two shapes here.
 */

const SECTION_FIELDS = {
  general: ['site_name'],
  contact: ['contact_email', 'contact_phone', 'whatsapp_number', 'address'],
  social: ['facebook_url', 'instagram_url', 'twitter_url', 'linkedin_url'],
  seo: ['meta_title', 'meta_description', 'meta_keywords', 'og_image_url', 'twitter_handle'],
}

function emptySections() {
  return {
    general: {},
    contact: {},
    social: {},
    seo: {},
  }
}

function normalizeSettingValue(setting) {
  if (!setting) return null

  if (setting.setting_type === 'json') {
    try {
      return typeof setting.setting_value === 'string'
        ? JSON.parse(setting.setting_value)
        : setting.setting_value
    } catch {
      return setting.setting_value
    }
  }

  if (setting.setting_type === 'number') return Number(setting.setting_value)
  if (setting.setting_type === 'boolean') return setting.setting_value === 'true' || setting.setting_value === true
  return setting.setting_value
}

function groupSettings(rows) {
  const grouped = emptySections()

  for (const row of rows || []) {
    const key = row.setting_key
    const section = Object.entries(SECTION_FIELDS).find(([, fields]) => fields.includes(key))?.[0]
    if (section) grouped[section][key] = normalizeSettingValue(row)
  }

  return grouped
}

async function getAllSettingRows() {
  const { data } = await http.get(API.SETTINGS)
  return Array.isArray(data) ? data : []
}

export async function getSettings() {
  if (isMock()) return mockGetSettings()
  const rows = await getAllSettingRows()
  return groupSettings(rows)
}

function inferSettingType(value) {
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  if (value !== null && typeof value === 'object') return 'json'
  return 'text'
}

async function saveSetting(key, value) {
  const payload = {
    setting_value: typeof value === 'object' && value !== null ? JSON.stringify(value) : value,
    setting_type: inferSettingType(value),
  }

  try {
    const { data } = await http.put(API.SETTINGS_SECTION(key), payload)
    return data
  } catch (error) {
    // PUT only updates existing settings. If the key does not exist yet,
    // create it instead of leaking that implementation detail into the UI.
    if (error?.response?.status !== 404) throw error

    const { data } = await http.post(API.SETTINGS, {
      setting_key: key,
      ...payload,
    })
    return data
  }
}

async function updateSection(section, payload, mockFn) {
  if (isMock()) return mockFn(payload)

  const fields = SECTION_FIELDS[section] || []
  const entries = Object.entries(payload || {}).filter(([key]) => fields.includes(key))

  await Promise.all(entries.map(([key, value]) => saveSetting(key, value)))

  const rows = await getAllSettingRows()
  return groupSettings(rows)[section]
}

export const updateGeneralSettings = (payload) => updateSection('general', payload, mockUpdateGeneralSettings)
export const updateContactSettings = (payload) => updateSection('contact', payload, mockUpdateContactSettings)
export const updateSocialSettings = (payload) => updateSection('social', payload, mockUpdateSocialSettings)
export const updateSeoSettings = (payload) => updateSection('seo', payload, mockUpdateSeoSettings)
