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

export const calculateTaxReturn = (
  gross: number,
  taxWithheld: number
): number => {
  enum WHTaxRateThreshold {
    RATE_45000 = 45000,
    RATE_120000 = 120000,
    RATE_180000 = 180000
    // over 180000
  }
  let normalTax = 0

  if (gross <= WHTaxRateThreshold.RATE_45000) {
    return taxWithheld - gross * 0.15
  }

  normalTax += WHTaxRateThreshold.RATE_45000 * 0.15

  if (
    gross > WHTaxRateThreshold.RATE_45000 &&
    gross <= WHTaxRateThreshold.RATE_120000
  ) {
    const deductedGross = gross - WHTaxRateThreshold.RATE_45000
    normalTax += deductedGross * 0.325
  }

  if (
    gross > WHTaxRateThreshold.RATE_120000 &&
    gross <= WHTaxRateThreshold.RATE_180000
  ) {
    const deductedGross = gross - WHTaxRateThreshold.RATE_120000
    normalTax += deductedGross * 0.37
  }

  if (gross > WHTaxRateThreshold.RATE_180000) {
    const deductedGross = gross - WHTaxRateThreshold.RATE_180000
    normalTax += deductedGross * 0.45
  }

  return taxWithheld - normalTax
}
