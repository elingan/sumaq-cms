// Muestra un número con formato de moneda 1.234,56 €
export default (amount: number | null | undefined, options?: Intl.NumberFormatOptions) => {
  const defaultOptions = {
    style: 'currency', currency: 'EUR', minimumFractionDigits: 2
  } as Intl.NumberFormatOptions

  if (amount === undefined || amount === null) return null

  const formatter = new Intl.NumberFormat('de-DE', {
    ...defaultOptions,
    ...options
  })
  return formatter.format(amount)
}
