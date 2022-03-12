import firebase from 'firebase/compat/app'
import { FirestoreTimestamp, Post, User } from '../typing/interfaces'
import { FIRESTORE_POSTS, FIRESTORE_USERS } from './constants'
import { firestore, serverTimestamp } from './firebase'

export const batchUpdateUsers = (
  batch: firebase.firestore.WriteBatch,
  userId: string,
  changes: Partial<User>
): void => {
  const userRef = firestore.collection(FIRESTORE_USERS).doc(userId)
  batch.update(userRef, {
    ...changes,
    updatedAt: serverTimestamp() as FirestoreTimestamp
  })
}

export const batchUpdatePosts = (
  batch: firebase.firestore.WriteBatch,
  postId: string,
  updatedBy: string,
  changes: Partial<Post>
): void => {
  const postRef = firestore.collection(FIRESTORE_POSTS).doc(postId)
  batch.update(postRef, {
    ...changes,
    updatedBy,
    updatedAt: serverTimestamp() as FirestoreTimestamp
  })
}
