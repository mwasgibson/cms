const TONES = {
  success: 'bg-emerald-600',
  error: 'bg-red-600',
  info: 'bg-brand-500',
}

export default function Toast({ message, tone = 'info', onDismiss }) {
  if (!message) return null

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-md px-4 py-3
        text-sm text-white shadow-lg ${TONES[tone]}`}
    >
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} aria-label="Dismiss" className="text-white/80 hover:text-white">
          ✕
        </button>
      )}
    </div>
  )
}
