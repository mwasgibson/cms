import { UNIT_STATUS } from '../../../utils/constants'
import { formatCurrency } from '../../../utils/formatters'

export default function UnitStats({ units = [] }) {
  const active     = units.filter((u) => !u.deleted_at)
  const available  = active.filter((u) => u.status === UNIT_STATUS.AVAILABLE).length
  const reserved   = active.filter((u) => u.status === UNIT_STATUS.RESERVED).length
  const sold       = active.filter((u) => u.status === UNIT_STATUS.SOLD).length
  const totalValue = active.reduce((sum, u) => sum + (Number(u.price) || 0), 0)
  const avgRoi     = active.length
    ? (active.reduce((s, u) => s + (Number(u.expected_roi) || 0), 0) / active.length).toFixed(1)
    : '—'

  const tiles = [
    { label: 'Total units',    value: active.length },
    { label: 'Available',      value: available,  accent: true },
    { label: 'Reserved',       value: reserved },
    { label: 'Sold',           value: sold },
    { label: 'Portfolio value',value: formatCurrency(totalValue) },
    { label: 'Avg ROI',        value: avgRoi ? `${avgRoi}%` : '—' },
  ]

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {tiles.map((t) => (
        <div key={t.label} className="rounded-lg border border-brand-100 bg-white shadow-sm px-4 py-3">
          <p className="text-xs text-brand-500">{t.label}</p>
          <p className={`mt-1 font-display text-xl font-semibold ${t.accent ? 'text-accent-500' : 'text-brand-900'}`}>
            {t.value}
          </p>
        </div>
      ))}
    </div>
  )
}
