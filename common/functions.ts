export const generateExcerpt = (strContent: string, maxLength: number) => {
  if (!strContent) return ""
  if (strContent.length > maxLength) return strContent.substring(0, maxLength)
  return strContent
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
      filename: "",
      extension: "",
    }
  }

  // no dot = no extension
  if (!fullFilename.includes(".")) {
    return {
      filename: fullFilename,
      extension: "",
    }
  }

  const filename = fullFilename.substring(0, fullFilename.lastIndexOf("."))
  const extension = fullFilename.slice(fullFilename.lastIndexOf("."))
  return {
    filename,
    extension: includeDotInExt
      ? extension
      : extension.replace(extension[0], ""),
  }
}
