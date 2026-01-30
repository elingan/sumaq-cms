export default (str: string) => {
  // convierte un snake_case a camelCase
  return str.replace(/(_\w)/g, m => m?.[1]?.toUpperCase() || m)
}
