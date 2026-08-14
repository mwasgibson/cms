const VARIANTS = {
  primary: 'bg-brand-500 text-white shadow-sm hover:bg-brand-600 focus-visible:outline-brand-500',
  accent: 'bg-accent-500 text-white shadow-sm hover:bg-accent-400 focus-visible:outline-accent-500',
  ghost: 'bg-transparent text-brand-500 hover:bg-brand-50 focus-visible:outline-brand-500',
  danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:outline-red-600',
}

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  loading = false,
  disabled = false,
  className = '',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium
        transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
        ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {loading && (
        <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {children}
    </button>
  )
}
