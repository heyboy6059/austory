import { FC, useCallback, useState } from 'react'
import { firestore, increment } from '../common/firebase'
import { getHeartDocumentId } from '../common/helper'
import { useDocument } from 'react-firebase-hooks/firestore'
import {} from '../typing/interfaces'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { FlexCenterDiv } from '../common/uiComponents'

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
  const [localAdd, setLocalAdd] = useState(0)
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
    setLocalAdd(1)

    // TODO: add/remove count in user heartTotalCount

    await batch.commit()
  }, [heartRef, postId, username])

  const removeHeart = useCallback(async () => {
    // return alert('haha')
    const batch = firestore.batch()
    const postRef = firestore.collection('posts').doc(postId)
    batch.update(postRef, { heartCount: increment(-1) })
    batch.delete(heartRef)
    setLocalAdd(0)

    // TODO: add/remove count in user heartTotalCount

    await batch.commit()
  }, [heartRef, postId])

  return heartDoc?.exists ? (
    <FlexCenterDiv style={{ cursor: 'pointer' }} onClick={() => removeHeart()}>
      <FavoriteIcon />{' '}
      <span style={{ fontSize: '18px' }}>{(heartCount || 0) + localAdd}</span>
    </FlexCenterDiv>
  ) : (
    <FlexCenterDiv style={{ cursor: 'pointer' }} onClick={() => addHeart()}>
      <FavoriteBorderIcon />{' '}
      <span style={{ fontSize: '18px' }}>{(heartCount || 0) + localAdd}</span>
    </FlexCenterDiv>
  )
}

export default Heart
