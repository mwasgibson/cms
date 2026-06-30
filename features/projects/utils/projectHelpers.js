import { PROJECT_STATUS, MILESTONE_STATUS } from '../../../utils/constants'

export const PROJECT_STATUS_BADGE_CLASSES = {
  [PROJECT_STATUS.PLANNING]: 'bg-brand-100 text-brand-500',
  [PROJECT_STATUS.IN_PROGRESS]: 'bg-amber-50 text-amber-700',
  [PROJECT_STATUS.COMPLETED]: 'bg-emerald-50 text-emerald-700',
}

export const MILESTONE_STATUS_BADGE_CLASSES = {
  [MILESTONE_STATUS.UPCOMING]: 'bg-brand-100 text-brand-500',
  [MILESTONE_STATUS.IN_PROGRESS]: 'bg-amber-50 text-amber-700',
  [MILESTONE_STATUS.COMPLETED]: 'bg-emerald-50 text-emerald-700',
}
