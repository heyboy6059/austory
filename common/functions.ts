export const generateExcerpt = (strContent: string, maxLength: number) => {
  if (!strContent) return ''
  if (strContent.length > maxLength) return strContent.substring(0, maxLength)
  return strContent
}

export const generateHtmlExcerpt = (
  htmlContent: string,
  maxLength: number
): string => {
  // replaced <br> to blank
  const cleanHtmlContent = htmlContent.replace(/<p><br><\/p>/g, '<p> </p>')

  const textContent = new DOMParser().parseFromString(
    cleanHtmlContent,
    'text/html'
  ).documentElement.textContent

  return generateExcerpt(textContent, maxLength)
}

// extract filename and extension separately from full filename using the last dot
export const extractFilenameExtension = (
  fullFilename: string,
  includeDotInExt?: boolean
): {
  filename: string
  extension: string
} => {
  // blank string
  if (!fullFilename) {
    return {
      filename: '',
      extension: ''
    }
  }

  // no dot = no extension
  if (!fullFilename.includes('.')) {
    return {
      filename: fullFilename,
      extension: ''
    }
  }

  const filename = fullFilename.substring(0, fullFilename.lastIndexOf('.'))
  const extension = fullFilename.slice(fullFilename.lastIndexOf('.'))
  return {
    filename,
    extension: includeDotInExt ? extension : extension.replace(extension[0], '')
  }
}
