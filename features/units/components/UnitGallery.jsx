import { useRef, useState } from 'react'
import { uploadImage } from '../../../lib/imageUpload'
import { useToast } from '../../../hooks/useToast'

export default function UnitGallery({ images = [], onChange }) {
  const { showToast } = useToast()
  const inputRef  = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handleFiles = async (files) => {
    if (!files?.length) return
    setUploading(true)
    try {
      const uploaded = await Promise.all(
        Array.from(files).map((f) => uploadImage(f)),
      )
      onChange([...images, ...uploaded])
    } catch {
      showToast('Could not upload image. Try again.', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = (index) => onChange(images.filter((_, i) => i !== index))

  const handleDrop = (e) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="rounded-lg border border-brand-100 bg-white shadow-sm p-5">
      <h3 className="font-display text-lg font-semibold text-brand-900">Photos</h3>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-brand-100 px-4 py-8 text-center transition-colors hover:border-accent-500 hover:bg-sand-100"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <p className="text-sm text-brand-500">Uploading…</p>
        ) : (
          <>
            <p className="text-sm font-medium text-brand-900">Drop images here or click to browse</p>
            <p className="mt-1 text-xs text-brand-500">PNG, JPG, WEBP up to 10MB each</p>
          </>
        )}
      </div>

      {images.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-brand-100 pt-5 sm:grid-cols-3">
          {images.map((src, i) => (
            <div key={i} className="group relative overflow-hidden rounded-md border border-brand-100">
              <img src={src} alt="" className="aspect-square w-full object-cover" />
              <button
                onClick={(e) => { e.stopPropagation(); handleRemove(i) }}
                aria-label="Remove photo"
                className="absolute right-1 top-1 rounded-full bg-brand-900/70 px-2 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
