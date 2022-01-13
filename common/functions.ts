export const generateExcerpt = (strContent: string, maxLength: number) => {
  if (!strContent) return ""
  if (strContent.length > maxLength) return strContent.substring(0, maxLength)
  return strContent
}
