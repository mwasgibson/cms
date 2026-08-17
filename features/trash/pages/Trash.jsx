import { useState } from 'react'
import { useFetch } from '../../../hooks/useFetch'
import { getTrash, restoreTrashItem, hardDelete } from '../services/trashService'
import { useToast } from '../../../hooks/useToast'
import { usePermission } from '../../../hooks/usePermission'
import Button from '../../../components/Button'
import Loader from '../../../components/Loader'
import Modal from '../../../components/Modal'
import { formatDate } from '../../../utils/formatters'

function parseEntityData(item) {
  if (!item?.entity_data) return {}
  if (typeof item.entity_data === 'object') return item.entity_data

  try {
    return JSON.parse(item.entity_data)
  } catch {
    return {}
  }
}

function getLabel(item) {
  const data = parseEntityData(item)

  if (item.entity_type === 'blog_post') {
    return data.title || `Blog post #${item.entity_id}`
  }

  if (item.entity_type === 'setting') {
    return data.setting_key || data.key || `Setting #${item.entity_id}`
  }

  return `${item.entity_type || 'Item'} #${item.entity_id ?? item.id}`
}

function getResourceLabel(type) {
  return {
    blog_post: 'Blog post',
    setting: 'Setting',
  }[type] ?? type ?? 'Item'
}

export default function Trash() {
  const { data, loading, error, setData: setTrash } = useFetch(getTrash)
  const { showToast } = useToast()
  const { role } = usePermission()
  const canHardDelete = role === 'admin'

  const [restoring, setRestoring] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)

  const items = Array.isArray(data) ? data : data?.items ?? data?.trash ?? []
  const totalItems = items.length

  const removeItem = (id) => {
    setTrash((prev) => {
      const current = Array.isArray(prev) ? prev : prev?.items ?? prev?.trash ?? []
      const next = current.filter((item) => item.id !== id)
      return Array.isArray(prev) ? next : { ...prev, items: next }
    })
  }

  const handleRestore = async () => {
    if (!restoring) return
    setSaving(true)
    try {
      await restoreTrashItem(restoring.id)
      removeItem(restoring.id)
      showToast(`${getLabel(restoring)} restored`, 'success')
      setRestoring(null)
    } catch {
      showToast('Could not restore this item. Try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleHardDelete = async () => {
    if (!deleting) return
    setSaving(true)
    try {
      await hardDelete(deleting.id)
      removeItem(deleting.id)
      showToast(`${getLabel(deleting)} permanently deleted`, 'success')
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
            : `${totalItems} deleted item${totalItems === 1 ? '' : 's'} — restore them or permanently remove them.`}
        </p>
        {canHardDelete && totalItems > 0 && (
          <p className="mt-1 text-xs text-red-500">
            As admin you can permanently delete items. This cannot be undone.
          </p>
        )}
      </div>

      {error && <p className="mb-4 text-sm text-red-600">Couldn&apos;t load trash. Try refreshing.</p>}

      {totalItems === 0 && !loading && (
        <div className="rounded-md border border-dashed border-brand-100 py-16 text-center text-sm text-brand-500">
          The trash is empty.
        </div>
      )}

      {totalItems > 0 && (
        <div className="divide-y divide-brand-100 rounded-lg border border-brand-100 bg-white shadow-sm">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-brand-500">
                  {getResourceLabel(item.entity_type)}
                </p>
                <p className="truncate text-sm font-medium text-brand-900">{getLabel(item)}</p>
                <p className="text-xs text-brand-500">
                  Deleted {item.deleted_at ? formatDate(item.deleted_at) : '—'}
                  {item.deleted_by_name ? ` by ${item.deleted_by_name}` : ''}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  variant="ghost"
                  className="px-3 py-1.5 text-xs text-accent-500"
                  onClick={() => setRestoring(item)}
                >
                  Restore
                </Button>
                {canHardDelete && (
                  <Button
                    variant="ghost"
                    className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                    onClick={() => setDeleting(item)}
                  >
                    Delete permanently
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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
            <strong>{getLabel(restoring)}</strong> will be restored and visible again.
          </p>
        )}
      </Modal>

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
            <p className="text-sm text-brand-900"><strong>{getLabel(deleting)}</strong></p>
            <p className="text-sm font-medium text-red-600">
              This will remove the trash record from the database forever. There is no undo.
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}
