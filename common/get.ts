import { Category, Post, PostType, RawPost } from '../typing/interfaces'
import {
  FIRESTORE_CATEGORIES,
  FIRESTORE_USERNAMES,
  POST_FEED_NUM_LIMIT
} from './constants'
import {
  categoryToJSON,
  firestore,
  fromMillis,
  postQueryDocToJSON
} from './firebase'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  QueryDocumentSnapshot,
  startAfter
} from 'firebase/firestore'

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
  const querySnapshot = await firestore
    .collection(FIRESTORE_CATEGORIES)
    .where('disabled', '==', false)
    .orderBy('sort')
    .get()
  return querySnapshot.docs.map(categoryToJSON)
}

export const getPostsByType = async (
  postType: PostType,
  lastPost?: Post
): Promise<Post[]> => {
  const queryConstraints = []
  queryConstraints.push(where('deleted', '==', false))

  if (postType === 'inkrau') {
    queryConstraints.push(where('isInkrauOfficial', '==', true))
  }

  if (postType === 'community') {
    queryConstraints.push(where('isInkrauOfficial', '==', false))
  }

  queryConstraints.push(orderBy('createdAt', 'desc'))

  if (lastPost) {
    const cursor =
      typeof lastPost.createdAt === 'number'
        ? fromMillis(lastPost.createdAt)
        : lastPost.createdAt

    queryConstraints.push(startAfter(cursor))
  }

  // limit the total number
  queryConstraints.push(limit(POST_FEED_NUM_LIMIT))

  const q = query(collection(firestore, 'posts'), ...queryConstraints)
  const querySnapshot = await getDocs(q)
  const docs = querySnapshot.docs as QueryDocumentSnapshot<RawPost>[]
  return docs.map(postQueryDocToJSON)
}
