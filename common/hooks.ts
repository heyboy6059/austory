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
  const [userAuth, firebaseAuthLoading] = useAuthState(auth)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState<string>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [userLoading, setUserLoading] = useState(false)

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe
    setUserLoading(true)
    try {
      if (userAuth) {
        console.log('Initial Auth Update - UserDataContext')
        const ref = firestore.collection('users').doc(userAuth.uid)
        unsubscribe = ref.onSnapshot(doc => {
          const userData = userToJSON(doc as FirebaseDocumentSnapshot<RawUser>)
          setUsername(userData?.username)
          setIsAdmin(userData?.isAdmin)
          setUser(userData)
          setUserLoading(false)
        })
      } else {
        console.log('No Auth.')
        // username null means no login
        setUsername(null)
        setUser(null)
        setIsAdmin(null)
        setUserLoading(false)
      }
    } catch (err) {
      console.error(`Error in useUserData hook. ${err}`)
      setUsername(null)
      setUser(null)
      setIsAdmin(null)
      setUserLoading(false)
    }

    return unsubscribe
  }, [userAuth])

  return { user, userAuth, username, isAdmin, firebaseAuthLoading, userLoading }
}
