export default (value: number, fixed: number = 1) => {
  return `${value.toFixed(fixed).replace('.', ',')}%`
}
