import { Category } from '../typing/interfaces'
import { FIRESTORE_CATEGORIES, FIRESTORE_USERNAMES } from './constants'
import { categoryToJSON, firestore } from './firebase'

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

export const getAllCategories = async (): Promise<Category[]> => {
  const querySnapshot = await firestore.collection(FIRESTORE_CATEGORIES).get()
  return querySnapshot.docs.map(categoryToJSON)
}
