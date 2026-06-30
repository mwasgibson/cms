import { LEAD_STATUS } from '../../../utils/constants'

export const LEAD_STATUS_BADGE_CLASSES = {
  [LEAD_STATUS.NEW]: 'bg-blue-50 text-blue-700',
  [LEAD_STATUS.CONTACTED]: 'bg-amber-50 text-amber-700',
  [LEAD_STATUS.SITE_VISIT_BOOKED]: 'bg-purple-50 text-purple-700',
  [LEAD_STATUS.CONVERTED]: 'bg-emerald-50 text-emerald-700',
  [LEAD_STATUS.LOST]: 'bg-brand-100 text-brand-500',
}
