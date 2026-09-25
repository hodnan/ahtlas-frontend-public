// utils/percentInput.js
export const percentInput = (event) => {
  const value = event.target.value
  if (value !== null && typeof value === 'string') {
    let sanitizedValue = value.replace(',', '.')
    sanitizedValue = sanitizedValue.replace(/[^0-9.]/g, '')
    const parts = sanitizedValue.split('.')
    if (parts.length > 2) {
      sanitizedValue = parts[0] + '.' + parts.slice(1).join('')
    }
    event.target.value = sanitizedValue
  }
}
