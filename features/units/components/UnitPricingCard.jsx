import { formatCurrency, formatPercent } from '../../../utils/formatters'

export default function UnitPricingCard({ unit }) {
  const annualIncome  = unit.price && unit.expected_roi ? (Number(unit.price) * Number(unit.expected_roi)) / 100 : null
  const monthlyIncome = annualIncome ? annualIncome / 12 : null

  return (
    <div className="rounded-lg border border-brand-100 bg-white shadow-sm p-5">
      <h3 className="font-display text-lg font-semibold text-brand-900">Pricing & Returns</h3>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-brand-500">Purchase price</p>
          <p className="font-display text-2xl font-semibold text-brand-900">{formatCurrency(unit.price)}</p>
        </div>
        <div>
          <p className="text-xs text-brand-500">Expected ROI</p>
          <p className="font-display text-2xl font-semibold text-accent-500">{formatPercent(unit.expected_roi)}</p>
        </div>
      </div>

      {annualIncome && (
        <div className="mt-4 grid grid-cols-1 gap-4 rounded-md bg-sand-100 p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-brand-500">Est. annual income</p>
            <p className="font-display text-lg font-semibold text-brand-900">{formatCurrency(annualIncome)}</p>
          </div>
          <div>
            <p className="text-xs text-brand-500">Est. monthly income</p>
            <p className="font-display text-lg font-semibold text-brand-900">{formatCurrency(monthlyIncome)}</p>
          </div>
        </div>
      )}

      <p className="mt-3 text-xs text-brand-500">Projections only — not a guarantee of returns.</p>
    </div>
  )
}
