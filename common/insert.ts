import { RawFeatureView } from './../typing/interfaces'
import { firestore, serverTimestamp } from '../common/firebase'
import { CalculatorLogType, Feature } from '../typing/enums'
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
