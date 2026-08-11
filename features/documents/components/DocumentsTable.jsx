import { useState } from 'react'
import { DOCUMENT_CATEGORY_LABELS, DOCUMENT_CATEGORY_COLOURS } from '../../../utils/constants'
import Button from '../../../components/Button'

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function DocumentsTable({ documents, loading, onDelete }) {
  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = async (doc) => {
    if (!window.confirm(`Delete "${doc.title}"? This can't be undone.`)) return
    setDeletingId(doc.id)
    try {
      await onDelete(doc.id)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <p className="py-10 text-center text-sm text-brand-500">Loading documents…</p>
  if (documents.length === 0) return <p className="py-10 text-center text-sm text-brand-500">No documents uploaded yet.</p>

  return (
    <div className="divide-y divide-brand-100 rounded-lg border border-brand-100 bg-white">
      {documents.map((doc) => (
        <div key={doc.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="truncate font-medium text-brand-900">{doc.title}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-brand-500">
              <span className={`rounded-full px-2 py-0.5 font-medium ${DOCUMENT_CATEGORY_COLOURS[doc.category] ?? 'bg-brand-100 text-brand-500'}`}>
                {DOCUMENT_CATEGORY_LABELS[doc.category] ?? doc.category}
              </span>
              <span>{formatSize(doc.size_bytes)}</span>
              <span>{new Date(doc.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={doc.download_url} target="_blank" rel="noreferrer">
              <Button variant="ghost">Download</Button>
            </a>
            <Button variant="danger" onClick={() => handleDelete(doc)} loading={deletingId === doc.id}>
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}