export default (text: string, maxLength: number = 32): string => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
}
