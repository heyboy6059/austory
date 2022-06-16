import { WHTaxRates } from './constants'

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

export const calculateWHTax = (
  gross: number,
  taxReturnMode: boolean,
  taxWithheld?: number
): number => {
  let normalTax = 0

  if (gross <= WHTaxRates.upTo45000.rateAmountLimit) {
    const tax = gross * WHTaxRates.upTo45000.rate
    return taxReturnMode ? taxWithheld - tax : tax
  }

  normalTax += WHTaxRates.upTo45000.rateAmountLimit * WHTaxRates.upTo45000.rate

  if (
    gross > WHTaxRates.upTo45000.rateAmountLimit &&
    gross <= WHTaxRates.upTo120000.rateAmountLimit
  ) {
    const deductedGross = gross - WHTaxRates.upTo45000.rateAmountLimit
    normalTax += deductedGross * WHTaxRates.upTo120000.rate
  }

  if (
    gross > WHTaxRates.upTo120000.rateAmountLimit &&
    gross <= WHTaxRates.upTo180000.rateAmountLimit
  ) {
    const deductedGross = gross - WHTaxRates.upTo120000.rateAmountLimit
    normalTax += deductedGross * WHTaxRates.upTo180000.rate
  }

  if (gross > WHTaxRates.upTo180000.rateAmountLimit) {
    const deductedGross = gross - WHTaxRates.upTo180000.rateAmountLimit
    normalTax += deductedGross * WHTaxRates.upTo180000.rate
  }

  return taxReturnMode ? taxWithheld - normalTax : normalTax
}

export const currencyFormatter = (value: number, country: 'KOR' | 'AUS') => {
  const locale = country === 'KOR' ? 'ko-KR' : country === 'AUS' && 'en-US'
  const currency = country === 'KOR' ? 'KRW' : country === 'AUS' && 'USD'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  }).format(value)
}

export const relabelDomainEmbeddedHtml = (html: string) => {
  const cleanHtml = html
    // instead of replaceAll (not all browser supported yet)
    .replace(/<span class="css-x1p5yj">\+<\/span>/gm, '')
    .replace(/<span class="css-x1p5yj">-<\/span>/gm, '')
    .replace('Capital City', '주요 도시 <div>(Capital City)</div>')
    .replace('QoQ', '분기 변화 <div>(QoQ)</div>')
    .replace('YoY', '연간 변화 <div>(YoY)</div>')
    .replace('National', '호주 평균')
    .replace('Combined Capitals', '호주 평균')
  return cleanHtml
}
