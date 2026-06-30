import { useNavigate } from 'react-router-dom'
import Table from '../../../components/Table'
import { PROJECT_STATUS_LABELS } from '../../../utils/constants'
import { PROJECT_STATUS_BADGE_CLASSES } from '../utils/projectHelpers'
import { formatDate } from '../../../utils/formatters'

export default function ProjectTable({ projects, loading }) {
  const navigate = useNavigate()

  const columns = [
    { key: 'name', header: 'Project' },
    { key: 'location', header: 'Location' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${PROJECT_STATUS_BADGE_CLASSES[row.status]}`}
        >
          {PROJECT_STATUS_LABELS[row.status] ?? row.status}
        </span>
      ),
    },
    {
      key: 'percent_complete',
      header: 'Progress',
      render: (row) => `${row.percent_complete}%`,
    },
    {
      key: 'expected_completion_date',
      header: 'Expected completion',
      render: (row) => (row.expected_completion_date ? formatDate(row.expected_completion_date) : '—'),
    },
  ]

  if (loading) {
    return <p className="py-10 text-center text-sm text-brand-500">Loading projects…</p>
  }

  return (
    <Table
      columns={columns}
      rows={projects}
      emptyMessage="No projects yet."
      onRowClick={(row) => navigate(`/admin/projects/${row.id}`)}
    />
  )
}
