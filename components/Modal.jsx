export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6">
          <h2 className="font-display text-lg font-semibold text-brand-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-brand-500 hover:text-brand-900"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-brand-100 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
