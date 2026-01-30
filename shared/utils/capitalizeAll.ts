export default (text: string | undefined) => {
  if (!text) return ''
  return text.replace(/[_-]/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())
}
