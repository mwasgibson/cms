import { useNavigate } from 'react-router-dom'
import Table from '../../../components/Table'
import { formatDate } from '../../../utils/formatters'

export default function DealTable({ deals, loading }) {
  const navigate = useNavigate()
  const today = new Date().toISOString().slice(0, 10)

  const columns = [
    { key: 'title', header: 'Deal' },
    {
      key: 'discount',
      header: 'Discount',
      render: (row) => row.discount_type === 'percentage'
        ? `${row.discount_value}%`
        : `KES ${row.discount_value}`,
    },
    { key: 'promo_code', header: 'Promo code', render: (row) => row.promo_code || '—' },
    { key: 'start_date', header: 'Starts', render: (row) => formatDate(row.start_date) },
    { key: 'end_date', header: 'Ends', render: (row) => formatDate(row.end_date) },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const expired = row.end_date < today
        const label = !row.active ? 'Inactive' : expired ? 'Expired' : 'Active'
        const classes = !row.active || expired
          ? 'bg-brand-100 text-brand-500'
          : 'bg-emerald-50 text-emerald-700'
        return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}>{label}</span>
      },
    },
  ]

  if (loading) {
    return <p className="py-10 text-center text-sm text-brand-500">Loading deals…</p>
  }

  return (
    <Table
      columns={columns}
      rows={deals}
      emptyMessage="No deals yet."
      onRowClick={(row) => navigate(`/admin/deals/${row.id}/edit`)}
    />
  )
}