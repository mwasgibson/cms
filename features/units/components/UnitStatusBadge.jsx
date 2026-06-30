import { UNIT_STATUS_LABELS, UNIT_STATUS_COLOURS } from '../../../utils/constants'

export default function UnitStatusBadge({ status, className = '' }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${UNIT_STATUS_COLOURS[status] ?? 'bg-brand-100 text-brand-500'} ${className}`}>
      {UNIT_STATUS_LABELS[status] ?? status}
    </span>
  )
}
