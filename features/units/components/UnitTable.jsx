import { useNavigate } from 'react-router-dom'
import Table from '../../../components/Table'
import { UNIT_STATUS_LABELS, UNIT_TYPE_LABELS } from '../../../utils/constants'
import { STATUS_BADGE_CLASSES } from '../utils/unitHelpers'
import { formatCurrency, formatPercent } from '../../../utils/formatters'

export default function UnitTable({ units, loading }) {
  const navigate = useNavigate()

  const columns = [
    { key: 'name', header: 'Unit' },
    {
      key: 'type',
      header: 'Type',
      render: (row) => UNIT_TYPE_LABELS[row.type] ?? row.type,
    },
    { key: 'location', header: 'Location' },
    {
      key: 'size_sqm',
      header: 'Size',
      render: (row) => `${row.size_sqm} m²`,
    },
    {
      key: 'price',
      header: 'Price',
      render: (row) => formatCurrency(row.price),
    },
    {
      key: 'expected_roi',
      header: 'ROI',
      render: (row) => formatPercent(row.expected_roi),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE_CLASSES[row.status]}`}
        >
          {UNIT_STATUS_LABELS[row.status] ?? row.status}
        </span>
      ),
    },
  ]

  if (loading) {
    return <p className="py-10 text-center text-sm text-brand-500">Loading units…</p>
  }

  return (
    <Table
      columns={columns}
      rows={units}
      emptyMessage="No units yet."
      onRowClick={(row) => navigate(`/admin/units/${row.id}`)}
    />
  )
}
