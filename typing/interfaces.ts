import firebase from "firebase/compat/app"

export type FirebaseDocumentSnapshot<T = firebase.firestore.DocumentData> =
  firebase.firestore.QueryDocumentSnapshot<T>

export type FirestoreTimestamp = firebase.firestore.Timestamp

export type FirebaseDocumentRef =
  firebase.firestore.DocumentReference<firebase.firestore.DocumentData>

export type Role = "Base"

// user
export type User = {
  username: string // user typed in our system
  photoURL: string
  displayName: string // user from auth provider (google)?
  email: string
  //
  heartCountTotal: number
  postCountTotal: number
  commentCountTotal: number
  viewCountTotal: number
  //
  disabled: boolean
  isAdmin: boolean
  isMarketingEmail: boolean
  role: Role // TODO
  //
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp | null
  disabledAt: FirestoreTimestamp | null
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
  //
  viewCount: number
  //
  content: string
  images: Image[]
  excerpt: string
  //
  categories: string[]
  //
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp | null
}

export type Post = Omit<RawPost, "createdAt" | "updatedAt"> & {
  createdAt: number
  updatedAt: number | null
}

export type PostWrite = Pick<
  Post,
  "title" | "content" | "images" | "categories"
>

export type ImgType = "thumbnail100" | "thumbnail300" | "original"
