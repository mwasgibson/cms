import { useFetch } from '../../../hooks/useFetch'
import Table from '../../../components/Table'
import Loader from '../../../components/Loader'
import { getAuditLogs } from '../services/auditLogService'
import { AUDIT_ACTION_LABELS } from '../../../utils/constants'

export default function AuditLogs() {
  const { data, loading, error } = useFetch(() => getAuditLogs({ page: 1, limit: 100 }))
  const logs = Array.isArray(data) ? data : data?.logs ?? data?.results ?? []

  const columns = [
    {
      key: 'timestamp',
      header: 'When',
      render: (row) => new Date(row.timestamp || row.created_at).toLocaleString(),
    },
    {
      key: 'user',
      header: 'Who',
      render: (row) => row.user_name || row.fullname || row.user?.name || row.user?.email || 'Unknown',
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => AUDIT_ACTION_LABELS[row.action] ?? row.action,
    },
    {
      key: 'entity_type',
      header: 'Resource',
      render: (row) => row.entity_type || row.resource || '—',
    },
    {
      key: 'entity_id',
      header: 'Record',
      render: (row) => row.entity_id ?? row.resource_id ?? '—',
    },
  ]

  if (loading) return <Loader label="Loading audit logs…" />

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-brand-900">Audit Logs</h1>
        <p className="text-sm text-brand-500">
          {logs.length} recorded action{logs.length === 1 ? '' : 's'}
        </p>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600">Couldn&apos;t load audit logs. Try refreshing.</p>
      )}

      <p className="mb-4 text-sm text-brand-500">
        Persistent actions recorded by the hotel backend.
      </p>

      <Table columns={columns} rows={logs} emptyMessage="No audit actions recorded yet." />
    </div>
  )
}