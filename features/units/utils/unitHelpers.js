import { UNIT_STATUS } from '../../../utils/constants'

export const STATUS_BADGE_CLASSES = {
  [UNIT_STATUS.AVAILABLE]: 'bg-emerald-50 text-emerald-700',
  [UNIT_STATUS.RESERVED]: 'bg-amber-50 text-amber-700',
  [UNIT_STATUS.SOLD]: 'bg-brand-100 text-brand-500',
}
