import { useDocuments } from '../hooks/useDocuments'
import DocumentsForm from '../components/DocumentsForm'
import DocumentsTable from '../components/DocumentsTable'
import { useToast } from '../../../hooks/useToast'
import { usePermission } from '../../../hooks/usePermission'

export default function Documents() {
  const { documents, loading, error, uploadDocument, deleteDocument } = useDocuments()
  const { showToast } = useToast()
  const perms = usePermission().for('documents')

  const handleUpload = async (payload) => {
    try {
      await uploadDocument(payload)
      showToast('Document uploaded', 'success')
    } catch (err) {
      showToast(err.message || 'Upload failed. Try again.', 'error')
      throw err
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteDocument(id)
      showToast('Document deleted', 'success')
    } catch (err) {
      showToast(err.message || 'Could not delete this document.', 'error')
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-brand-900">Documents</h1>
        <p className="text-sm text-brand-500">Menus, policies, floor plans, and brochures — {documents.length} file{documents.length === 1 ? '' : 's'}</p>
      </div>

      {perms.canCreate && (
        <DocumentsForm onUpload={handleUpload} />
      )}

      {error && <p className="mb-4 text-sm text-red-600">Couldn't load documents. Try refreshing.</p>}
      <DocumentsTable documents={documents} loading={loading} onDelete={handleDelete} />
    </div>
  )
}