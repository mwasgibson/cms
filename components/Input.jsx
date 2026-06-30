export default function Input({ label, id, error, className = '', ...rest }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-brand-900">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`rounded-md border px-3 py-2 text-sm outline-none transition-colors
          focus:border-brand-500 focus:ring-1 focus:ring-brand-500
          ${error ? 'border-red-500' : 'border-brand-100'} ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
}
