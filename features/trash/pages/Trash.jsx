import { useState } from 'react'
import { useFetch } from '../../../hooks/useFetch'
import { getTrash, restoreTrashItem, hardDelete } from '../services/trashService'
import { useToast } from '../../../hooks/useToast'
import { usePermission } from '../../../hooks/usePermission'
import Button from '../../../components/Button'
import Loader from '../../../components/Loader'
import Modal from '../../../components/Modal'
import { formatDate } from '../../../utils/formatters'
import { UNIT_TYPE_LABELS, DOCUMENT_CATEGORY_LABELS, POST_STATUS_LABELS } from '../../../utils/constants'

// ─── Row labels per resource ─────────────────────────────────────────────────
function getLabel(resource, record) {
  switch (resource) {
    case 'units':     return `${record.name} (${UNIT_TYPE_LABELS[record.type] ?? record.type})`
    case 'leads':     return `${record.name} — ${record.email}`
    case 'documents': return `${record.title} (${DOCUMENT_CATEGORY_LABELS[record.category] ?? record.category})`
    case 'posts':     return `${record.title} [${POST_STATUS_LABELS[record.status] ?? record.status}]`
    case 'projects':  return record.name
    default:          return `#${record.id}`
  }
}

// ─── Section ─────────────────────────────────────────────────────────────────
function TrashSection({ title, resource, records, onRestore, onHardDelete, canHardDelete }) {
  if (records.length === 0) return null

  return (
    <div>
      <h2 className="mb-2 font-display text-base font-semibold text-brand-900">{title}</h2>
      <div className="divide-y divide-brand-100 rounded-lg border border-brand-100 bg-white shadow-sm">
        {records.map((record) => (
          <div key={record.id} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-brand-900">{getLabel(resource, record)}</p>
              <p className="text-xs text-brand-500">
                Deleted {formatDate(record.deleted_at)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="ghost"
                className="px-3 py-1.5 text-xs text-accent-500"
                onClick={() => onRestore(resource, record)}
              >
                Restore
              </Button>
              {canHardDelete && (
                <Button
                  variant="ghost"
                  className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                  onClick={() => onHardDelete(resource, record)}
                >
                  Delete permanently
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function Trash() {
  const { data: trash, loading, error, setData: setTrash } = useFetch(getTrash)
  const { showToast } = useToast()
  const { role } = usePermission()
  const canHardDelete = role === 'admin'

  const [restoring, setRestoring] = useState(null)  // { resource, record }
  const [deleting, setDeleting]   = useState(null)   // { resource, record }
  const [saving, setSaving]       = useState(false)

  const totalItems = trash
    ? Object.values(trash).reduce((sum, arr) => sum + arr.length, 0)
    : 0

  // ── Restore ────────────────────────────────────────────────────────────────
  const handleRestore = async () => {
    if (!restoring) return
    setSaving(true)
    try {
      await restoreTrashItem[restoring.resource](restoring.record.id)
      setTrash((prev) => ({
        ...prev,
        [restoring.resource]: prev[restoring.resource].filter((r) => r.id !== restoring.record.id),
      }))
      showToast(`${getLabel(restoring.resource, restoring.record)} restored`, 'success')
      setRestoring(null)
    } catch {
      showToast('Could not restore this item. Try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  // ── Hard delete ────────────────────────────────────────────────────────────
  const handleHardDelete = async () => {
    if (!deleting) return
    setSaving(true)
    try {
      await hardDelete(deleting.resource, deleting.record.id)
      setTrash((prev) => ({
        ...prev,
        [deleting.resource]: prev[deleting.resource].filter((r) => r.id !== deleting.record.id),
      }))
      showToast(`${getLabel(deleting.resource, deleting.record)} permanently deleted`, 'success')
      setDeleting(null)
    } catch {
      showToast('Could not delete permanently. Try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader label="Loading trash…" />

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-brand-900">Trash</h1>
        <p className="text-sm text-brand-500">
          {totalItems === 0
            ? 'Nothing in the trash.'
            : `${totalItems} deleted item${totalItems === 1 ? '' : 's'} — restore them to put them back, or delete permanently to remove them for good.`}
        </p>
        {canHardDelete && totalItems > 0 && (
          <p className="mt-1 text-xs text-red-500">
            As admin you can permanently delete items. This cannot be undone.
          </p>
        )}
      </div>

      {error && <p className="mb-4 text-sm text-red-600">Couldn't load trash. Try refreshing.</p>}

      {totalItems === 0 && !loading && (
        <div className="rounded-md border border-dashed border-brand-100 py-16 text-center text-sm text-brand-500">
          The trash is empty.
        </div>
      )}

      {trash && totalItems > 0 && (
        <div className="space-y-6">
          <TrashSection title="Units"     resource="units"     records={trash.units}     onRestore={(r, rec) => setRestoring({ resource: r, record: rec })} onHardDelete={(r, rec) => setDeleting({ resource: r, record: rec })} canHardDelete={canHardDelete} />
          <TrashSection title="Leads"     resource="leads"     records={trash.leads}     onRestore={(r, rec) => setRestoring({ resource: r, record: rec })} onHardDelete={(r, rec) => setDeleting({ resource: r, record: rec })} canHardDelete={canHardDelete} />
          <TrashSection title="Documents" resource="documents" records={trash.documents} onRestore={(r, rec) => setRestoring({ resource: r, record: rec })} onHardDelete={(r, rec) => setDeleting({ resource: r, record: rec })} canHardDelete={canHardDelete} />
          <TrashSection title="Posts"     resource="posts"     records={trash.posts}     onRestore={(r, rec) => setRestoring({ resource: r, record: rec })} onHardDelete={(r, rec) => setDeleting({ resource: r, record: rec })} canHardDelete={canHardDelete} />
          <TrashSection title="Projects"  resource="projects"  records={trash.projects}  onRestore={(r, rec) => setRestoring({ resource: r, record: rec })} onHardDelete={(r, rec) => setDeleting({ resource: r, record: rec })} canHardDelete={canHardDelete} />
        </div>
      )}

      {/* Restore confirmation */}
      <Modal
        open={!!restoring}
        onClose={() => setRestoring(null)}
        title="Restore this item?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRestoring(null)}>Cancel</Button>
            <Button variant="accent" loading={saving} onClick={handleRestore}>Restore</Button>
          </>
        }
      >
        {restoring && (
          <p className="text-sm text-brand-500">
            <strong>{getLabel(restoring.resource, restoring.record)}</strong> will be restored and visible again.
          </p>
        )}
      </Modal>

      {/* Hard delete confirmation */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Permanently delete this item?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="danger" loading={saving} onClick={handleHardDelete}>Delete permanently</Button>
          </>
        }
      >
        {deleting && (
          <div className="space-y-2">
            <p className="text-sm text-brand-900">
              <strong>{getLabel(deleting.resource, deleting.record)}</strong>
            </p>
            <p className="text-sm text-red-600 font-medium">
              This will remove it from the database forever. There is no undo.
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}
