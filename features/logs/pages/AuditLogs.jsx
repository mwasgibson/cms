import { useEffect, useState } from 'react'
import Table from '../../../components/Table'
import { auditLog } from '../../../lib/auditLog'
import { AUDIT_ACTION_LABELS } from '../../../utils/constants'

export default function AuditLogs() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    setLogs(auditLog.all())
  }, [])

  const columns = [
    { key: 'timestamp', header: 'When', render: (row) => new Date(row.timestamp).toLocaleString() },
    { key: 'user', header: 'Who', render: (row) => row.user?.name ?? 'Unknown' },
    { key: 'action', header: 'Action', render: (row) => AUDIT_ACTION_LABELS[row.action] ?? row.action },
    { key: 'resource', header: 'Resource' },
    { key: 'resource_id', header: 'Record' },
  ]

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-900">Audit Logs</h1>
          <p className="text-sm text-brand-500">{logs.length} recorded action{logs.length === 1 ? '' : 's'}</p>
        </div>
      </div>
      <p className="mb-4 text-sm text-brand-500">
        This shows actions recorded by this browser. It is a local convenience log, not a full server-side audit trail.
      </p>
      <Table columns={columns} rows={logs} emptyMessage="No actions recorded yet." />
    </div>
  )
}