import { TEMP_KOR_AUS_RATE, WHTaxRates } from './constants'
import { parse } from 'node-html-parser'
import { numToKorean, FormatOptions } from 'num-to-korean'
import { UnitType } from '../typing/data'

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

export const roundUpKoreanWonValue = (koreanWon: number) => {
  const korWonStrValue = koreanWon?.toString()

  // round up last 3 digits
  if (korWonStrValue?.length > 4) {
    const firstPart = korWonStrValue.slice(0, korWonStrValue.length - 4)
    return Number(firstPart + '0000')
  }
  return koreanWon
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
      /<td class="css-kzs65o">Sydney<\/td>/gm,
      '<td class="css-kzs65o" style="line-height:18px;"><div>시드니</div><div><small>Sydney</small></div></td>'
    )
    .replace(
      /<td class="css-kzs65o">Melbourne<\/td>/gm,
      '<td class="css-kzs65o" style="line-height:18px;"><div>멜번</div><div><small>Melbourne</small></div></td>'
    )
    .replace(
      /<td class="css-kzs65o">Brisbane<\/td>/gm,
      '<td class="css-kzs65o" style="line-height:18px;"><div>브리즈번</div><div><small>Brisbane</small></div></td>'
    )
    .replace(
      /<td class="css-kzs65o">Adelaide<\/td>/gm,
      '<td class="css-kzs65o" style="line-height:18px;"><div>애들레이드</div><div><small>Adelaide</small></div></td>'
    )
    .replace(
      /<td class="css-kzs65o">Canberra<\/td>/gm,
      '<td class="css-kzs65o" style="line-height:18px;"><div>캔버라</div><div><small>Canberra</small></div></td>'
    )
    .replace(
      /<td class="css-kzs65o">Perth<\/td>/gm,
      '<td class="css-kzs65o" style="line-height:18px;"><div>퍼스</div><div><small>Perth</small></div></td>'
    )
    .replace(
      /<td class="css-kzs65o">Hobart<\/td>/gm,
      '<td class="css-kzs65o" style="line-height:18px;"><div>호바트</div><div><small>Hobart</small></div></td>'
    )
    .replace(
      /<td class="css-kzs65o">Darwin<\/td>/gm,
      '<td class="css-kzs65o" style="line-height:18px;"><div>다윈</div><div><small>Darwin</small></div></td>'
    )
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

  //<td class="css-kzs65o">Sydney</td>

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

    // round up
    korWonValue = roundUpKoreanWonValue(korWonValue)

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

export const ausKorValueHandler = (
  unitType: UnitType,
  value: string
): string => {
  if (unitType === UnitType.PEOPLE) {
    return `${Number(value).toLocaleString('en-US')} 명`
  }
  if (unitType === UnitType.CURRENCY) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
      // These options are needed to round to whole numbers if that's what you want.
      //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    }).format(parseInt(value))
  }
  if (unitType === UnitType.PERCENTAGE) {
    return `${parseInt(value)} %`
  }
  if (unitType === UnitType.TON_PER_CAPITA) {
    return `${parseInt(value)} 톤`
  }
  if (unitType === UnitType.PERCENTAGE_FLOAT) {
    return `${parseInt((parseFloat(value) * 100).toString())} %`
  }
  return value
}
