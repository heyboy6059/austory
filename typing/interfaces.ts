import firebase from 'firebase/compat/app'

export type FirebaseDocumentSnapshot<T = firebase.firestore.DocumentData> =
  firebase.firestore.QueryDocumentSnapshot<T>

export type FirestoreTimestamp = firebase.firestore.Timestamp

export type FirebaseDocumentRef<T = firebase.firestore.DocumentData> =
  firebase.firestore.DocumentReference<T>

export type FirebaseCollectionRef<T = firebase.firestore.DocumentData> =
  firebase.firestore.CollectionReference<T>

export type Role = 'Base'

export type RawUser = {
  uid: string
  username: string // user typed in our system
  photoURL: string
  displayName: string // user from auth provider (google)?
  email: string
  providedHeartCountTotal: number
  receivedHeartCountTotal: number
  myPostCountTotal: number
  receivedCommentCountTotal: number
  providedCommentCountTotal: number
  receivedViewCountTotal: number
  providedViewCountTotal: number
  disabled: boolean
  isAdmin: boolean
  isMarketingEmail: boolean
  role: Role
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp | null
  disabledAt: FirestoreTimestamp | null
}

export type User = Omit<
  RawUser,
  | 'createdAt'
  | 'updatedAt'
  | 'providedHeartCountTotal'
  | 'receivedHeartCountTotal'
  | 'myPostCountTotal'
  | 'receivedCommentCountTotal'
  | 'providedCommentCountTotal'
  | 'receivedViewCountTotal'
  | 'providedViewCountTotal'
> & {
  providedHeartCountTotal: number | firebase.firestore.FieldValue
  receivedHeartCountTotal: number | firebase.firestore.FieldValue
  myPostCountTotal: number | firebase.firestore.FieldValue
  receivedCommentCountTotal: number | firebase.firestore.FieldValue
  providedCommentCountTotal: number | firebase.firestore.FieldValue
  receivedViewCountTotal: number | firebase.firestore.FieldValue
  providedViewCountTotal: number | firebase.firestore.FieldValue
  createdAt: number
  updatedAt: number | null
}

export type ImageDetails = {
  url: string
  name: string
  ext: string
  size: number
}

export type Image = {
  thumbnail100: ImageDetails
  thumbnail300: ImageDetails
  original: ImageDetails
}

export type RawPost = {
  slug: string // email(before @) + unix timestamp = documentId
  uid: string // userId
  username: string
  title: string
  deleted: boolean
  heartCount: number // need another approach?
  commentCount: number
  //
  viewCount: number
  //
  content: string
  images: Image[]
  excerpt: string
  //
  categories: string[]
  //
  createdBy: string
  createdAt: FirestoreTimestamp
  updatedBy: string | null
  updatedAt: FirestoreTimestamp | null
  //
  isTest: boolean
}

export type Post = Omit<RawPost, 'createdAt' | 'updatedAt'> & {
  createdAt: number
  updatedAt: number | null
}

export type PostWrite = Pick<
  Post,
  'title' | 'content' | 'images' | 'categories' | 'isTest'
>

export type ImgType = 'thumbnail100' | 'thumbnail300' | 'original'

export type RawComment = {
  commentId: string
  username: string
  level: number
  parentCommentId: string | null
  content: string
  deleted: boolean
  adminDeleted: boolean
  adminDeletedReason: string | null
  createdBy: string
  createdAt: FirestoreTimestamp
  updatedBy: string
  updatedAt: FirestoreTimestamp
}

export type Comment = Omit<RawComment, 'createdAt' | 'updatedAt'> & {
  createdAt: number
  updatedAt: number | null
}
