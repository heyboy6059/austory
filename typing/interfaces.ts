import firebase from "firebase/compat/app"

export type FirebaseDocumentSnapshot<T = firebase.firestore.DocumentData> =
  firebase.firestore.QueryDocumentSnapshot<T>

export type FirestoreTimestamp = firebase.firestore.Timestamp

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

export type Image = {
  originalImgUrl: string
  thumbnailImgUrl: string
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

export type ImgType = "thumbnail" | "original"
