export function formatCurrency(amount, currency = 'KES') {
  if (amount === null || amount === undefined) return '—'
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatPercent(value, decimals = 1) {
  if (value === null || value === undefined) return '—'
  return `${Number(value).toFixed(decimals)}%`
}
