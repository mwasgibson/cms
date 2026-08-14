export function isRequired(value) {
  return value !== undefined && value !== null && String(value).trim() !== ''
    ? null
    : 'This field is required.'
}

export function isEmail(value) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(value) ? null : 'Enter a valid email address.'
}

export function isPhone(value) {
  // Loose check for Kenyan + international formats
  const pattern = /^\+?[0-9]{7,15}$/
  return pattern.test(value.replace(/\s/g, '')) ? null : 'Enter a valid phone number.'
}

export function minLength(value, length) {
  return value && value.length >= length ? null : `Must be at least ${length} characters.`
}
