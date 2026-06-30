export default function ProgressGallery({ milestones }) {
  const photos = milestones.flatMap((m) =>
    (m.images ?? []).map((src) => ({ src, caption: m.title })),
  )

  if (photos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-brand-100 p-6 text-center text-sm text-brand-500">
        No progress photos uploaded yet. Add images on a milestone once uploads are wired
        up to storage.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {photos.map((photo, i) => (
        <figure key={i} className="overflow-hidden rounded-md border border-brand-100">
          <img src={photo.src} alt={photo.caption} className="aspect-square w-full object-cover" />
          <figcaption className="px-2 py-1.5 text-xs text-brand-500">{photo.caption}</figcaption>
        </figure>
      ))}
    </div>
  )
}
