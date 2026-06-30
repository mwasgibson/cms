import { useNavigate } from 'react-router-dom'
import Table from '../../../components/Table'
import { LEAD_STATUS_LABELS, LEAD_SOURCE_LABELS, UNIT_TYPE_LABELS } from '../../../utils/constants'
import { LEAD_STATUS_BADGE_CLASSES } from '../utils/leadHelpers'
import { formatDate } from '../../../utils/formatters'

export default function LeadTable({ leads, loading }) {
  const navigate = useNavigate()

  const columns = [
    { key: 'name', header: 'Name' },
    {
      key: 'contact',
      header: 'Contact',
      render: (row) => (
        <div className="flex flex-col">
          <span>{row.email}</span>
          <span className="text-xs text-brand-500">{row.phone}</span>
        </div>
      ),
    },
    {
      key: 'unit_interest',
      header: 'Interested in',
      render: (row) => UNIT_TYPE_LABELS[row.unit_interest] ?? '—',
    },
    {
      key: 'source',
      header: 'Source',
      render: (row) => LEAD_SOURCE_LABELS[row.source] ?? row.source,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${LEAD_STATUS_BADGE_CLASSES[row.status]}`}
        >
          {LEAD_STATUS_LABELS[row.status] ?? row.status}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Received',
      render: (row) => formatDate(row.created_at),
    },
  ]

  if (loading) {
    return <p className="py-10 text-center text-sm text-brand-500">Loading leads…</p>
  }

  return (
    <Table
      columns={columns}
      rows={leads}
      emptyMessage="No leads match these filters."
      onRowClick={(row) => navigate(`/admin/leads/${row.id}`)}
    />
  )
}
