import { AusKorDataset, RawFeatureView } from './../typing/interfaces'
import { firestore, serverTimestamp } from '../common/firebase'
import {
  CalculatorLogType,
  Feature,
  HousePriceReportType,
  PropertyReportType
} from '../typing/enums'
import { FirestoreTimestamp, RawCalculatorLog } from '../typing/interfaces'
import {
  FIRESTORE_AUS_KOR_DATASET,
  FIRESTORE_CALCULATOR_LOGS,
  FIRESTORE_FEATURE_VIEWS
} from './constants'
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
  // const propertyReportType = PropertyReportType.RENTAL_PRICE
  const propertyReportType = PropertyReportType.HOUSE_PRICE
  const label = `Sep-2022`
  const docId = `${propertyReportType}-${label}`
  const ref = firestore.collection('propertyReportLabels').doc(docId)
  await ref.set({
    propertyReportLabelId: docId,
    propertyReportType,
    label,
    korLabel: '2022년 9월',
    createdAt: serverTimestamp() as FirestoreTimestamp
  })
}

export const insertPropertyReportData = async () => {
  // const propertyReportType = PropertyReportType.RENTAL_PRICE
  const propertyReportType = PropertyReportType.HOUSE_PRICE
  const propertyReportLabelId = `${propertyReportType}-Sep-2022`
  // const type = HousePriceReportType.UNIT
  const type = HousePriceReportType.HOUSE
  const propertyReportId = `${propertyReportLabelId}-${type}`
  const embedHtml = `<div class='embed_table'><table class="css-lf8x"><thead><tr class="css-4l54jr"><th class="css-kzs65o">Capital City</th><th class="css-kzs65o">Sep-22</th><th class="css-kzs65o">Jun-22</th><th class="css-kzs65o">Sep-21</th><th class="css-kzs65o">QoQ</th><th class="css-kzs65o">YoY</th></tr></thead><tbody><tr class="css-waa0b"><td class="css-kzs65o">Sydney</td><td class="css-kzs65o">$1,464,371 </td><td class="css-kzs65o">$1,544,145 </td><td class="css-kzs65o">$1,506,727 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">5.2%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">2.8%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Melbourne</td><td class="css-kzs65o">$1,028,452 </td><td class="css-kzs65o">$1,075,008 </td><td class="css-kzs65o">$1,049,276 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">4.3%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">2.0%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Brisbane</td><td class="css-kzs65o">$811,312 </td><td class="css-kzs65o">$847,374 </td><td class="css-kzs65o">$715,834 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">4.3%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">13.3%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Adelaide</td><td class="css-kzs65o">$795,093 </td><td class="css-kzs65o">$790,100 </td><td class="css-kzs65o">$652,418 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">0.6%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">21.9%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Canberra</td><td class="css-kzs65o">$1,096,114 </td><td class="css-kzs65o">$1,163,851 </td><td class="css-kzs65o">$1,056,067 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">5.8%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">3.8%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Perth</td><td class="css-kzs65o">$645,946 </td><td class="css-kzs65o">$656,058 </td><td class="css-kzs65o">$598,912 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">1.5%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">7.9%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Hobart</td><td class="css-kzs65o">$741,275 </td><td class="css-kzs65o">$760,783 </td><td class="css-kzs65o">$682,208 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">2.6%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">8.7%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Darwin</td><td class="css-kzs65o">$623,819 </td><td class="css-kzs65o">$649,178 </td><td class="css-kzs65o">$652,561 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">3.9%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">4.4%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Combined capitals</td><td class="css-kzs65o">$1,022,194 </td><td class="css-kzs65o">$1,065,186 </td><td class="css-kzs65o">$999,620 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">4.0%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">2.3%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"></tr></tbody></table><div class='table_source'>Source: <a href='https://www.domain.com.au/research/house-price-report/september-2022/?utm_source=web&amp;utm_medium=referral&amp;utm_campaign=tableembed' target="_blank">Domain</a></div></div>`
  const createdAt = serverTimestamp() as FirestoreTimestamp
  const ref = firestore.collection('propertyReports').doc(propertyReportId)
  await ref.set({
    propertyReportType,
    propertyReportLabelId,
    propertyReportId,
    type,
    embedHtml,
    createdAt
  })
}

export const insertAusKorDataset = async (ausKorDataset: AusKorDataset) => {
  const ausKorDatasetId = `ausKorDataset-${Date.now()}`
  const ref = firestore
    .collection(FIRESTORE_AUS_KOR_DATASET)
    .doc(ausKorDatasetId)
  await ref.set(ausKorDataset)
}
