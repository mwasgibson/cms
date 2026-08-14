import { POST_STATUS } from '../../../utils/constants'

export const POST_STATUS_BADGE_CLASSES = {
  [POST_STATUS.DRAFT]: 'bg-brand-100 text-brand-500',
  [POST_STATUS.PUBLISHED]: 'bg-emerald-50 text-emerald-700',
}

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
