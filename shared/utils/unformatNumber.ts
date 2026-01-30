export default (value: string) => {
  // Elimina los separadores de miles y convierte el string a número
  if (typeof value !== 'string') return 0
  const normalized = value.replace(/\./g, '').replace(/,/g, '.')
  const numberValue = parseFloat(normalized)
  return isNaN(numberValue) ? 0 : numberValue
}
