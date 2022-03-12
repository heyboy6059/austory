import firebase from 'firebase/compat/app'
import {
  FirestoreTimestamp,
  Post,
  User,
  Comment,
  FirebaseCollectionRef
} from '../typing/interfaces'
import { FIRESTORE_POSTS, FIRESTORE_USERS } from './constants'
import { firestore, increment, serverTimestamp } from './firebase'
import { getUidByUsername } from './get'

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

export const batchUpdateComments = (
  batch: firebase.firestore.WriteBatch,
  commentCollectionRef: FirebaseCollectionRef, // post - comment ref
  commentId: string,
  updatedBy: string,
  changes: Partial<Comment>
) => {
  // const postRef.collection()
  const commentRef = commentCollectionRef.doc(commentId)
  batch.update(commentRef, {
    ...changes,
    updatedBy,
    updatedAt: serverTimestamp() as FirestoreTimestamp
  })
}

/**
 * Update relevant user, post comment counts
 *
 * @param batch
 * @param type 'add' | 'remove'
 * @param currentUserId or uid
 * @param currentUsername
 * @param postUsername
 * @param postId or post.slug
 */
export const batchUpdateCommentCounts = async (
  batch: firebase.firestore.WriteBatch,
  type: 'add' | 'remove',
  currentUserId: string,
  currentUsername: string,
  postUsername: string,
  postId: string
) => {
  const incrementalValue = type === 'add' ? 1 : -1

  // add count 1 to current user
  batchUpdateUsers(batch, currentUserId, {
    providedCommentCountTotal: increment(incrementalValue)
  })

  const { uid: ownerUserId } = await getUidByUsername(postUsername)

  // add count 1 to post owner
  batchUpdateUsers(batch, ownerUserId, {
    receivedCommentCountTotal: increment(incrementalValue)
  })

  // add count 1 to post
  batchUpdatePosts(batch, postId, currentUsername, {
    commentCount: increment(incrementalValue)
  })
}

/**
 * Update user provided/receivedViewCountTotal
 * @param batch
 * @param currentUserId
 * @param postOwnerUserId
 */
export const batchUpdateViewCounts = (
  batch: firebase.firestore.WriteBatch,
  currentUserId: string,
  postOwnerUserId: string
) => {
  batchUpdateUsers(batch, currentUserId, {
    providedViewCountTotal: increment(1)
  })

  batchUpdateUsers(batch, postOwnerUserId, {
    receivedViewCountTotal: increment(1)
  })
}
