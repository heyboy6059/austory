import firebase from 'firebase/compat/app'
import { FirestoreTimestamp, User } from '../typing/interfaces'
import { firestore, serverTimestamp } from './firebase'

export const batchUpdateUsers = (
  batch: firebase.firestore.WriteBatch,
  userId: string,
  changes: Partial<User>
): void => {
  const userRef = firestore.collection('users').doc(userId)
  batch.update(userRef, {
    ...changes,
    updatedAt: serverTimestamp() as FirestoreTimestamp
  })
}
