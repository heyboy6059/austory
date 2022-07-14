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
  const propertyReportType = PropertyReportType.RENTAL_PRICE
  const label = `Jun-2022`
  const docId = `${propertyReportType}-${label}`
  const ref = firestore.collection('propertyReportLabels').doc(docId)
  await ref.set({
    propertyReportLabelId: docId,
    propertyReportType,
    label,
    korLabel: '2022년 6월',
    createdAt: serverTimestamp() as FirestoreTimestamp
  })
}

export const insertPropertyReportData = async () => {
  const propertyReportType = PropertyReportType.RENTAL_PRICE
  const propertyReportLabelId = `${propertyReportType}-Jun-2022`
  const type = HousePriceReportType.UNIT
  const propertyReportId = `${propertyReportLabelId}-${type}`
  const embedHtml = `<div class='embed_table'><table class="css-lf8x"><thead><tr class="css-4l54jr"><th class="css-kzs65o">Capital City</th><th class="css-kzs65o">Jun-22</th><th class="css-kzs65o">Mar-22</th><th class="css-kzs65o">Jun-21</th><th class="css-kzs65o">QoQ</th><th class="css-kzs65o">YoY</th></tr></thead><tbody><tr class="css-waa0b"><td class="css-kzs65o">Sydney</td><td class="css-kzs65o">$525 </td><td class="css-kzs65o">$500 </td><td class="css-kzs65o">$470 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">5.0%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">11.7%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Melbourne</td><td class="css-kzs65o">$410 </td><td class="css-kzs65o">$390 </td><td class="css-kzs65o">$370 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">5.1%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">10.8%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Brisbane</td><td class="css-kzs65o">$450 </td><td class="css-kzs65o">$430 </td><td class="css-kzs65o">$400 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">4.7%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">12.5%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Adelaide</td><td class="css-kzs65o">$380 </td><td class="css-kzs65o">$370 </td><td class="css-kzs65o">$350 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">2.7%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">8.6%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Perth</td><td class="css-kzs65o">$400 </td><td class="css-kzs65o">$400 </td><td class="css-kzs65o">$380 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj"></span><span class="css-6nfh2o">0.0%</span><span></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">5.3%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Hobart</td><td class="css-kzs65o">$450 </td><td class="css-kzs65o">$450 </td><td class="css-kzs65o">$405 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj"></span><span class="css-6nfh2o">0.0%</span><span></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">11.1%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Canberra</td><td class="css-kzs65o">$550 </td><td class="css-kzs65o">$540 </td><td class="css-kzs65o">$500 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">1.9%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">10.0%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Darwin</td><td class="css-kzs65o">$480 </td><td class="css-kzs65o">$490 </td><td class="css-kzs65o">$443 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">2.0%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">8.5%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Combined Capitals</td><td class="css-kzs65o">$460 </td><td class="css-kzs65o">$445 </td><td class="css-kzs65o">$410 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">3.4%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">12.2%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr></tbody></table><div class='table_source'>Source: <a href='https://www.domain.com.au/research/rental-report/june-2022/?utm_source=web&amp;utm_medium=referral&amp;utm_campaign=tableembed' target="_blank">Domain</a></div></div>`
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
