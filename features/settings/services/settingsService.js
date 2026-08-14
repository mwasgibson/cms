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
 * Laravel API contract:
 *   GET /settings          -> { general, contact, social, seo }
 *   PUT /settings/general  -> general
 *   PUT /settings/contact  -> contact
 *   PUT /settings/social   -> social
 *   PUT /settings/seo      -> seo
 */

export async function getSettings() {
  if (isMock()) return mockGetSettings()
  const { data } = await http.get(API.SETTINGS)
  return data
}

async function updateSection(section, payload, mockFn) {
  if (isMock()) return mockFn(payload)
  const { data } = await http.put(API.SETTINGS_SECTION(section), payload)
  return data
}

export const updateGeneralSettings = (p) => updateSection('general', p, mockUpdateGeneralSettings)
export const updateContactSettings = (p) => updateSection('contact', p, mockUpdateContactSettings)
export const updateSocialSettings  = (p) => updateSection('social',  p, mockUpdateSocialSettings)
export const updateSeoSettings     = (p) => updateSection('seo',     p, mockUpdateSeoSettings)
