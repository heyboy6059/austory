import firebase from "firebase/compat/app"

export type FirebaseDocumentSnapshot =
  firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>

// user
export type User = {
  username: string
  photoURL: string
  displayName: string
}

// post
export type Post = {
  username: string
  slug: string
  title: string
  published: boolean
  heartCount: number
  //
  uid: string
  content: string
  // REVIEW: JSON cast number or string
  createdAt: Date | number | string
  updatedAt: Date | number | string
}
