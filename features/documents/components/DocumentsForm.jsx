import { useState } from 'react'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import { DOCUMENT_CATEGORY, DOCUMENT_CATEGORY_LABELS } from '../../../utils/constants'

export default function DocumentUploadForm({ onUpload, uploading }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(DOCUMENT_CATEGORY.OTHER)
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (f && f.type !== 'application/pdf') {
      setError('Only PDF files are allowed.')
      setFile(null)
      return
    }
    if (f && f.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB.')
      setFile(null)
      return
    }
    setError('')
    setFile(f || null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required.'); return }
    if (!file) { setError('Choose a PDF to upload.'); return }
    setError('')
    onUpload({ title, category, file }).then(() => {
      setTitle('')
      setCategory(DOCUMENT_CATEGORY.OTHER)
      setFile(null)
      e.target.reset()
    }).catch((err) => setError(err.message || 'Upload failed. Try again.'))
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-4 rounded-lg border border-brand-100 bg-white p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="doc-title"
          label="Title"
          placeholder="e.g. Room Service Menu"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="doc-category" className="text-sm font-medium text-brand-900">Category</label>
          <select
            id="doc-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-md border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          >
            {Object.values(DOCUMENT_CATEGORY).map((c) => (
              <option key={c} value={c}>{DOCUMENT_CATEGORY_LABELS[c]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="doc-file" className="text-sm font-medium text-brand-900">PDF file (max 10MB)</label>
        <input
          id="doc-file"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="text-sm text-brand-700 file:mr-3 file:rounded-md file:border-0 file:bg-brand-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-900 hover:file:bg-brand-100/80"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end">
        <Button type="submit" loading={uploading}>Upload</Button>
      </div>
    </form>
  )
}