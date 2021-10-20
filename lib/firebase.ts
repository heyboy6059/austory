import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDZM4GcEwLya_cjnIHbn2qJth7gnw-U0QU",
  authDomain: "austory-danpark.firebaseapp.com",
  projectId: "austory-danpark",
  storageBucket: "austory-danpark.appspot.com",
  messagingSenderId: "937500945011",
  appId: "1:937500945011:web:f83bf20ccf46139ebfd806",
  measurementId: "G-FXZVL0QDVQ",
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
