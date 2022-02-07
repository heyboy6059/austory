import { auth, firestore } from './firebase'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { User } from '../typing/interfaces'

// Custom hook to read auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth)
  const [username, setUsername] = useState<string>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe

    if (user) {
      const ref = firestore.collection('users').doc(user.uid)
      unsubscribe = ref.onSnapshot(doc => {
        const userData = doc.data() as User
        setUsername(userData?.username)
        setIsAdmin(userData?.isAdmin)
      })
    } else {
      setUsername(null)
    }

    return unsubscribe
  }, [user])

  return { user, username, isAdmin }
}
