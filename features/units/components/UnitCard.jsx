import { UNIT_STATUS_LABELS, UNIT_TYPE_LABELS } from '../../../utils/constants'
import { STATUS_BADGE_CLASSES } from '../utils/unitHelpers'
import { formatCurrency, formatPercent } from '../../../utils/formatters'

export default function UnitCard({ unit }) {
  return (
    <div className="rounded-lg border border-brand-100 bg-white shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-brand-900">{unit.name}</h2>
          <p className="text-sm text-brand-500">
            {UNIT_TYPE_LABELS[unit.type] ?? unit.type} · Floor {unit.floor} · {unit.size_sqm} m²
          </p>
          {unit.location && <p className="mt-1 text-sm text-brand-500">{unit.location}</p>}
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_BADGE_CLASSES[unit.status]}`}
        >
          {UNIT_STATUS_LABELS[unit.status] ?? unit.status}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-brand-100 pt-5">
        <div>
          <p className="text-xs text-brand-500">Price</p>
          <p className="font-display text-lg font-semibold text-brand-900">
            {formatCurrency(unit.price)}
          </p>
        </div>
        <div>
          <p className="text-xs text-brand-500">Expected ROI</p>
          <p className="font-display text-lg font-semibold text-brand-900">
            {formatPercent(unit.expected_roi)}
          </p>
        </div>
      </div>

      {unit.description && (
        <p className="mt-5 border-t border-brand-100 pt-5 text-sm text-brand-900">
          {unit.description}
        </p>
      )}
    </div>
  )
}
