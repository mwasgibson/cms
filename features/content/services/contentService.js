import api from '../../../app/api'
import { shouldUseMocks } from '../../../utils/mockMode'
import { mockGetContent, mockUpdateSection } from './mockContent'

/**
 * Expected Laravel routes:
 *   GET /content                -> full content object { hero, about, investment_calculator,
 *                                  payment_plans, project_specs, faq, track_record, seo }
 *   PUT /content/hero           -> updated hero section
 *   PUT /content/about          -> updated about section
 *   PUT /content/investment-calculator -> updated calculator params
 *   PUT /content/payment-plans  -> updated payment plan pricing
 *   PUT /content/project-specs  -> updated project specs
 *   PUT /content/faq            -> updated FAQ array
 *   PUT /content/track-record   -> updated track record array
 *   PUT /content/seo/{slug}     -> updated per-page SEO for home|about|investment|faq|blog|contact
 *
 * NOTE: This is the feature that unblocks the public site from having hardcoded content.
 * Each section PUT endpoint should correspond to a Laravel model or JSON column that the
 * public site's API endpoints serve. The public pandatowers.africa SPA needs to be updated
 * to fetch these sections dynamically instead of having them compiled into the JS bundle.
 * Until that public-site update happens, changes made here don't affect the live site.
 */

export async function getContent() {
  if (shouldUseMocks()) return mockGetContent()
  const { data } = await api.get('/content')
  return data
}

export async function updateSection(section, payload) {
  if (shouldUseMocks()) return mockUpdateSection(section, payload)
  const slug = section.replace(/_/g, '-')
  const { data } = await api.put(`/content/${slug}`, payload)
  return data
}
