import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
import {
  FirebaseDocumentSnapshot,
  Post,
  RawComment,
  Comment,
  RawPost,
  RawUser,
  User
} from '../typing/interfaces'

const firebaseConfig = {
  apiKey: 'AIzaSyDZM4GcEwLya_cjnIHbn2qJth7gnw-U0QU',
  authDomain: 'austory-danpark.firebaseapp.com',
  projectId: 'austory-danpark',
  storageBucket: 'austory-danpark.appspot.com',
  messagingSenderId: '937500945011',
  appId: '1:937500945011:web:f83bf20ccf46139ebfd806',
  measurementId: 'G-FXZVL0QDVQ'
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED

export const fromMillis = firebase.firestore.Timestamp.fromMillis

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp

export const increment = firebase.firestore.FieldValue.increment

/**
 * Gets a users/{uid} document with username
 * @param username
 * @returns
 */
export const getUserWithUsername = async (
  username: string
): Promise<FirebaseDocumentSnapshot> => {
  const usersRef = firestore.collection('users')
  const query = usersRef.where('username', '==', username).limit(1)
  const userDoc = (await query.get()).docs[0]
  return userDoc
}

/**
 * Converts a firestore document to JSON
 * @param doc
 * @returns
 */
export const postToJSON = (doc: FirebaseDocumentSnapshot<RawPost>): Post => {
  const data = doc.data()
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt?.toMillis() || 0,
    updatedAt: data?.updatedAt?.toMillis() || 0
  }
}

/**
 * Converts a firestore document to JSON
 * @param doc
 * @returns
 */
export const tempPostToJSON = doc => {
  const data = doc.data()
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt?.toMillis() || 0,
    updatedAt: data?.updatedAt?.toMillis() || 0
  }
}

export const userToJSON = (user: FirebaseDocumentSnapshot<RawUser>): User => {
  const userData = user.data()
  return {
    ...userData,
    createdAt: userData?.createdAt?.toMillis() || 0,
    updatedAt: userData?.updatedAt?.toMillis() || 0
  }
}

export const commentToJSON = (
  comment: FirebaseDocumentSnapshot<RawComment>
): Comment => {
  const commentData = comment.data()
  return {
    ...commentData,
    createdAt: commentData?.createdAt?.toMillis() || 0,
    updatedAt: commentData?.updatedAt?.toMillis() || 0
  }
}

// TODO: generalize all dataToJSON functions
