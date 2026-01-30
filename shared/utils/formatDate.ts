export default (date: string | null | undefined) => {
  if (!date) return null
  // Check if date is already in DD/MM/YYYY format
  if (date.includes('/')) return date

  const parsedDate = new Date(date)
  const formatter = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  if (isNaN(parsedDate.getTime())) {
    console.error(`Invalid date: ${date}`)
    return null
  }

  return formatter.format(parsedDate)
}
