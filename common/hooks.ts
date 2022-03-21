import { auth, firestore, userToJSON } from './firebase'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import {
  FirebaseDocumentSnapshot,
  RawUser,
  UserDataContext
} from '../typing/interfaces'

// Custom hook to read auth record and user profile doc
export const useUserData = (): UserDataContext => {
  const [userAuth] = useAuthState(auth)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState<string>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe

    if (userAuth) {
      console.log('Initial Auth Update - UserDataContext')
      const ref = firestore.collection('users').doc(userAuth.uid)
      unsubscribe = ref.onSnapshot(doc => {
        const userData = userToJSON(doc as FirebaseDocumentSnapshot<RawUser>)
        setUsername(userData?.username)
        setIsAdmin(userData?.isAdmin)
        setUser(userData)
      })
    } else {
      console.log('No Auth.')
      // username null means no login
      setUsername(null)
      setUser(null)
      setIsAdmin(null)
    }

    return unsubscribe
  }, [userAuth])

  return { user, userAuth, username, isAdmin }
}
