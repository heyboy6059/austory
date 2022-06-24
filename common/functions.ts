import { TEMP_KOR_AUS_RATE, WHTaxRates } from './constants'
import { parse } from 'node-html-parser'
import { numToKorean, FormatOptions } from 'num-to-korean'

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
) => {
  let tax = 0
  if (gross <= WHTaxRates.upTo45000.rateAmountLimit) {
    tax = gross * WHTaxRates.upTo45000.rate
  } else if (gross <= WHTaxRates.upTo120000.rateAmountLimit) {
    tax =
      WHTaxRates.upTo120000.previousMax +
      (gross - WHTaxRates.upTo45000.rateAmountLimit) *
        WHTaxRates.upTo120000.rate
  } else if (gross <= WHTaxRates.upTo180000.rateAmountLimit) {
    tax =
      WHTaxRates.upTo180000.previousMax +
      (gross - WHTaxRates.upTo120000.rateAmountLimit) *
        WHTaxRates.upTo180000.rate
  } else if (gross <= WHTaxRates.over180000.rateAmountLimit) {
    tax =
      WHTaxRates.over180000.previousMax +
      (gross - WHTaxRates.upTo180000.rateAmountLimit) *
        WHTaxRates.over180000.rate
  }
  return taxReturnMode ? taxWithheld - tax : tax
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
  const currentValueId = 'currency-value'
  const cleanHtml = html
    // instead of replaceAll (not all browser supported yet)
    .replace(/<span class="css-x1p5yj">\+<\/span>/gm, '')
    .replace(/<span class="css-x1p5yj">-<\/span>/gm, '')
    .replace(
      'Capital City',
      '주요 도시 <div style="font-size:12px;">(Capital City)</div>'
    )
    .replace('QoQ', '분기 변화 <div style="font-size:12px;">(QoQ)</div>')
    .replace('YoY', '연간 변화 <div style="font-size:12px;">(YoY)</div>')
    .replace('National', '호주 평균')
    .replace('Combined Capitals', '호주 평균')
    .replace(
      /<td class="css-kzs65o">\$/gm,
      `<td class="currency" id=${currentValueId}>$`
    )
    .replace(
      /<td class="css-kzs65o">snr<\/td>/gm,
      '<td class="css-kzs65o">-</td>'
    )
    .replace(
      /<span class="css-6nfh2o">NaN%<\/span>/gm,
      '<span class="css-6nfh2o">-</span>'
    )

  const htmlDoc = parse(cleanHtml)

  // select all currency values
  const selectors = htmlDoc.querySelectorAll(`#${currentValueId}`)

  // add korean won values
  selectors.forEach(selector => {
    const strValue = selector.innerHTML
      .replace('$', '')
      .replace(/\,/gm, '')
      .match(/[0-9]+/g)[0]

    const intValue = parseInt(strValue)

    let korWonValue = intValue * TEMP_KOR_AUS_RATE
    const korWonStrValue = korWonValue?.toString()

    if (korWonStrValue?.length > 4) {
      const firstPart = korWonStrValue.slice(0, korWonStrValue.length - 4)
      korWonValue = Number(firstPart + '0000')
    }

    // update selector
    selector.set_content(`
    <div>
    <div style="font-size:16px;"><strong>${selector.innerHTML}</strong></div>
    <div style="font-size:10px;color:grey;white-space:nowrap;">약 ${numToKorean(
      korWonValue,
      FormatOptions.MIXED
    )}원</div>
    </div>`)
  })

  return htmlDoc.toString()
}
