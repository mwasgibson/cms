export default function Loader({ label = 'Loading…', fullScreen = false }) {
  const wrapperClass = fullScreen
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-white/70'
    : 'flex items-center justify-center py-10'

  return (
    <div className={wrapperClass}>
      <div className="flex flex-col items-center gap-3">
        <span className="size-8 animate-spin rounded-full border-2 border-brand-100 border-t-brand-500" />
        <span className="text-sm text-brand-500">{label}</span>
      </div>
    </div>
  )
}
