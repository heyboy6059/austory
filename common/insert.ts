import { firestore, serverTimestamp } from '../common/firebase'
import { CalculatorLogType } from '../typing/enums'
import { FirestoreTimestamp, RawCalculatorLog } from '../typing/interfaces'
import { FIRESTORE_CALCULATOR_LOGS } from './constants'
import { generateCalculatorLogId } from './idHelper'

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
