export default (value: number, fixed: number = 1) => {
  // Formatea un número con separadores de miles y un número fijo de decimales
  if (isNaN(value) || value === null) return '0'
  if (value === 0) return '0'
  const n = new Intl.NumberFormat('es-ES', {
    maximumFractionDigits: fixed,
    minimumFractionDigits: fixed,
    useGrouping: true
  })
  return n.format(value)
}
