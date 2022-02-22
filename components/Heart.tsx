import { FC, useCallback, useEffect } from 'react'
import { firestore, increment } from '../common/firebase'
import { getHeartDocumentId } from '../common/helper'
import { useDocument } from 'react-firebase-hooks/firestore'
import {
  FirebaseDocumentRef,
  FirebaseDocumentSnapshot
} from '../typing/interfaces'

interface Props {
  postId: string
  heartCount: number
  username: string
}
const Heart: FC<Props> = ({ postId, heartCount, username }) => {
  const heartRef = firestore
    .collection('hearts')
    .doc(`${getHeartDocumentId(postId, username)}`)
  const [heartDoc] = useDocument(heartRef)
  console.log({ heartData: heartDoc })
  console.log('heartDoc exist?', heartDoc?.exist)
  // const heartRef =
  // useEffect(() => {
  //   if (postId && username) {
  //     console.log({ username })
  //     const getHeart = async () => {
  //       console.log('run!!!')
  //       const ref = firestore
  //         .collection('hearts')
  //         .doc(`${getHeartDocumentId(postId, username)}`)
  //       const docSnapshot = await ref.get()
  //       console.log({ docSnapshot })
  //       console.log('doc data?', docSnapshot.data())
  //     }

  //     getHeart()
  //   }
  // }, [postId, username])

  //   const addHeart = useCallback(async () => {

  //   }, [postId, username])

  // const addRemoveHeart = useCallback(()=>{
  //   if (heartData?.exists) {

  //   }
  // },[])

  const addHeart = useCallback(async () => {
    // return alert('haha')
    const batch = firestore.batch()
    const postRef = firestore.collection('posts').doc(postId)
    batch.update(postRef, { heartCount: increment(1) })
    batch.set(heartRef, {
      username,
      postId,
      value: 1
    })

    await batch.commit()
  }, [heartRef, postId, username])

  const removeHeart = useCallback(async () => {
    // return alert('haha')
    const batch = firestore.batch()
    const postRef = firestore.collection('posts').doc(postId)
    batch.update(postRef, { heartCount: increment(-1) })
    batch.delete(heartRef)

    await batch.commit()
  }, [heartRef, postId])

  return heartDoc?.exists ? (
    <div onClick={() => removeHeart()}>
      HEART (you clicked) {heartCount || 0}
    </div>
  ) : (
    <div onClick={() => addHeart()}>
      HEART (you did not click) {heartCount || 0}
    </div>
  )
}

export default Heart
