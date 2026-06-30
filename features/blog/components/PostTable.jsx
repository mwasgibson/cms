import { useNavigate } from 'react-router-dom'
import Table from '../../../components/Table'
import { POST_STATUS_LABELS } from '../../../utils/constants'
import { POST_STATUS_BADGE_CLASSES } from '../utils/blogHelpers'
import { formatDate } from '../../../utils/formatters'

export default function PostTable({ posts, loading }) {
  const navigate = useNavigate()

  const columns = [
    { key: 'title', header: 'Title' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${POST_STATUS_BADGE_CLASSES[row.status]}`}
        >
          {POST_STATUS_LABELS[row.status] ?? row.status}
        </span>
      ),
    },
    {
      key: 'published_at',
      header: 'Published',
      render: (row) => (row.published_at ? formatDate(row.published_at) : '—'),
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (row) => formatDate(row.created_at),
    },
  ]

  if (loading) {
    return <p className="py-10 text-center text-sm text-brand-500">Loading posts…</p>
  }

  return (
    <Table
      columns={columns}
      rows={posts}
      emptyMessage="No posts match these filters."
      onRowClick={(row) => navigate(`/admin/blog/${row.id}/edit`)}
    />
  )
}
