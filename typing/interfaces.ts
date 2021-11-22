import firebase from "firebase/compat/app"

export type FirebaseDocumentSnapshot<T = firebase.firestore.DocumentData> =
  firebase.firestore.QueryDocumentSnapshot<T>

export type firestoreTimestamp = firebase.firestore.Timestamp

export type FirebaseDocumentRef =
  firebase.firestore.DocumentReference<firebase.firestore.DocumentData>

// user
export type User = {
  username: string // user typed in our system
  photoURL: string
  displayName: string // user from auth provider (google)?
}

export type TempUser = {
  username: string
  photoURL: string
  displayName: string
  heartCountTotal: number
  postCountTotal: number
  commentCountTotal: number
  viewCountTotal: number
  isAdmin: boolean
  disabled: boolean
  createdAt: Date | number | string
  updatedAt: Date | number | string | null
  disabledAt: Date | number | string | null
}

// post
// export type Post = {
//   username: string
//   slug: string
//   title: string
//   published: boolean
//   heartCount: number
//   //
//   uid: string
//   content: string
//   // REVIEW: JSON cast number or string
//   createdAt: Date | number | string
//   updatedAt: Date | number | string
// }

export type RawPost = {
  slug: string // 25 characters + unix timestamp = documentId
  uid: string // userId
  username: string
  title: string
  deleted: boolean
  heartCount: number // need another approach?
  //
  viewCount: number
  //
  content: string
  imgSrc: string
  //
  createdAt: firestoreTimestamp
  updatedAt: firestoreTimestamp | null
}

export type Post = Omit<RawPost, "createdAt" | "updatedAt"> & {
  createdAt: number
  updatedAt: number | null
}
