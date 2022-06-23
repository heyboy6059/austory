import { RawFeatureView } from './../typing/interfaces'
import { firestore, serverTimestamp } from '../common/firebase'
import {
  CalculatorLogType,
  Feature,
  HousePriceReportType,
  PropertyReportType
} from '../typing/enums'
import { FirestoreTimestamp, RawCalculatorLog } from '../typing/interfaces'
import { FIRESTORE_CALCULATOR_LOGS, FIRESTORE_FEATURE_VIEWS } from './constants'
import { generateCalculatorLogId, generateFeatureViewId } from './idHelper'

export const insertCalculatorLog = async (
  email: string,
  type: CalculatorLogType,
  details: string,
  createdBy: string
) => {
  const calculatorLogId = generateCalculatorLogId(email)
  const ref = firestore
    .collection(FIRESTORE_CALCULATOR_LOGS)
    .doc(calculatorLogId)
  const calculatorLog: RawCalculatorLog = {
    calculatorLogId,
    type,
    details,
    createdAt: serverTimestamp() as FirestoreTimestamp,
    createdBy
  }
  await ref.set(calculatorLog)
  console.log(`Inserted calculatorLog. ${calculatorLogId}`)
}

export const insertFeatureView = async (
  feature: Feature
  // email: string | null,
  // createdBy: string | null
) => {
  const featureViewId = generateFeatureViewId(feature)
  const ref = firestore.collection(FIRESTORE_FEATURE_VIEWS).doc(featureViewId)
  const featureView: RawFeatureView = {
    featureViewId,
    feature,
    viewValue: 1,
    createdAt: serverTimestamp() as FirestoreTimestamp
    // createdBy: createdBy || GUEST_UID
  }
  await ref.set(featureView)
  console.log(`Inserted featureView. ${featureViewId}`)
}

export const insertPropertyReportLabelData = async () => {
  const propertyReportType = PropertyReportType.HOUSE_PRICE
  const label = `Dec-2019`
  const docId = `${propertyReportType}-${label}`
  const ref = firestore.collection('propertyReportLabels').doc(docId)
  await ref.set({
    propertyReportId: docId,
    propertyReportType,
    label,
    korLabel: '2019년 12월',
    createdAt: serverTimestamp() as FirestoreTimestamp
  })
}

export const insertPropertyReportData = async () => {
  const propertyReportLabelId = `housePrice-Mar-2022`
  const type = HousePriceReportType.UNIT
  const propertyReportId = `${propertyReportLabelId}-${type}`
  const embedHtml = `<div class='embed_table'><table class="css-lf8x"><thead><tr class="css-4l54jr"><th class="css-kzs65o">Capital City</th><th class="css-kzs65o">Mar-22</th><th class="css-kzs65o">Dec-21</th><th class="css-kzs65o">Mar-21</th><th class="css-kzs65o">QoQ</th><th class="css-kzs65o">YoY</th></tr></thead><tbody><tr class="css-waa0b"><td class="css-kzs65o">Sydney</td><td class="css-kzs65o">$796,524 </td><td class="css-kzs65o">$806,302 </td><td class="css-kzs65o">$759,957 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">1.2%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">4.8%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Melbourne</td><td class="css-kzs65o">$578,775 </td><td class="css-kzs65o">$591,842 </td><td class="css-kzs65o">$570,096 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">2.2%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">1.5%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Brisbane</td><td class="css-kzs65o">$437,034 </td><td class="css-kzs65o">$423,791 </td><td class="css-kzs65o">$399,735 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">3.1%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">9.3%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Adelaide</td><td class="css-kzs65o">$376,977 </td><td class="css-kzs65o">$372,016 </td><td class="css-kzs65o">$343,331 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">1.3%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">9.8%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Canberra</td><td class="css-kzs65o">$564,984 </td><td class="css-kzs65o">$561,624 </td><td class="css-kzs65o">$518,818 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">0.6%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">8.9%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Perth</td><td class="css-kzs65o">$358,366 </td><td class="css-kzs65o">$369,834 </td><td class="css-kzs65o">$375,820 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">3.1%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">4.6%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Hobart</td><td class="css-kzs65o">$572,568 </td><td class="css-kzs65o">$585,856 </td><td class="css-kzs65o">$441,149 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">2.3%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">29.8%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Darwin</td><td class="css-kzs65o">$385,728 </td><td class="css-kzs65o">$387,530 </td><td class="css-kzs65o">$297,241 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">0.5%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">29.8%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">National</td><td class="css-kzs65o">$616,942 </td><td class="css-kzs65o">$623,375 </td><td class="css-kzs65o">$590,444 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">1.0%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">4.5%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"></tr></tbody></table><div class='table_source'>Source: <a href='https://www.domain.com.au/research/house-price-report/march-2022/?utm_source=web&amp;utm_medium=referral&amp;utm_campaign=tableembed' target="_blank">Domain</a></div></div>`
  const createdAt = serverTimestamp() as FirestoreTimestamp
  const ref = firestore.collection('propertyReports').doc(propertyReportId)
  await ref.set({
    propertyReportLabelId,
    propertyReportId,
    type,
    embedHtml,
    createdAt
  })
}
