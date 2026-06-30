import { useState, useEffect } from 'react'
import { useDebounce } from '../../../hooks/useDebounce'
import { UNIT_STATUS_LABELS, UNIT_TYPE_LABELS } from '../../../utils/constants'

export default function UnitFilter({ filters, onChange }) {
  const [search, setSearch] = useState(filters.search ?? '')
  const debounced = useDebounce(search, 300)

  useEffect(() => {
    onChange({ ...filters, search: debounced })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  const sel = (key) => (e) => onChange({ ...filters, [key]: e.target.value })

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <input
        type="text"
        placeholder="Search units…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-56 rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
      />
      <select value={filters.type ?? ''} onChange={sel('type')} className="rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500">
        <option value="">All types</option>
        {Object.entries(UNIT_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
      <select value={filters.status ?? ''} onChange={sel('status')} className="rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500">
        <option value="">All statuses</option>
        {Object.entries(UNIT_STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  )
}
