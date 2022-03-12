import { FIRESTORE_USERNAMES } from './constants'
import { firestore } from './firebase'

export const getUidByUsername = async (
  username: string
): Promise<{ uid: string }> => {
  const ref = firestore.collection(FIRESTORE_USERNAMES).doc(username)
  const userRes = (await ref.get()).data()
  if (!userRes || !userRes?.uid) {
    throw new Error(
      `No username object found by provided username: ${username}`
    )
  }
  return { uid: userRes.uid }
}
