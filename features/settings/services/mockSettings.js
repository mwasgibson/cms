import { withLatency } from '../../../utils/mockMode'

const STORAGE_KEY = 'pt_mock_settings'

const SEED_SETTINGS = {
  general: {
    site_name: 'Panda Towers 001',
  },
  contact: {
    contact_email: 'invest@pandatowers.africa',
    contact_phone: '+254700000000',
    whatsapp_number: '+254700000000',
    address: 'Nairobi, Kenya',
  },
  social: {
    facebook_url: '',
    instagram_url: '',
    twitter_url: 'https://twitter.com/skypandatowers',
    linkedin_url: '',
  },
  seo: {
    meta_title: 'Panda Towers 001 | Premium Residential Investment',
    meta_description:
      'Build long-term passive rental income confidently with Panda Towers 001. Premium residential development designed for value-driven investors.',
    meta_keywords: 'real estate investment Kenya, passive rental income, property investment, residential development, investment opportunity',
    og_image_url: '',
    twitter_handle: '@skypandatowers',
  },
}

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // fall through to reseed if storage is corrupted
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_SETTINGS))
  return SEED_SETTINGS
}

function saveStore(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export async function mockGetSettings() {
  return withLatency(loadStore())
}

function makeSectionUpdater(section) {
  return async (payload) => {
    const data = loadStore()
    data[section] = { ...data[section], ...payload }
    saveStore(data)
    return withLatency(data[section])
  }
}

export const mockUpdateGeneralSettings = makeSectionUpdater('general')
export const mockUpdateContactSettings = makeSectionUpdater('contact')
export const mockUpdateSocialSettings = makeSectionUpdater('social')
export const mockUpdateSeoSettings = makeSectionUpdater('seo')
