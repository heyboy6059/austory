import { FC, useCallback, useContext, useState } from 'react'
import { firestore, increment, serverTimestamp } from '../common/firebase'
import { getHeartDocumentId } from '../common/helper'
import { useDocument } from 'react-firebase-hooks/firestore'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { FlexCenterDiv } from '../common/uiComponents'
import { batchUpdateUsers } from '../common/update'
import { UserContext } from '../common/context'

interface Props {
  postId: string
  heartCount: number
  username: string
}
const Heart: FC<Props> = ({ postId, heartCount, username }) => {
  // REVIEW: better way to have user?
  const { user } = useContext(UserContext)
  const heartRef = firestore
    .collection('hearts')
    .doc(`${getHeartDocumentId(postId, username)}`)
  const [heartDoc] = useDocument(heartRef)
  const [localHeartCount, setLocalHeartCount] = useState(heartCount)

  const addRemoveHeart = useCallback(
    async (addOrRemove: 'add' | 'remove') => {
      if (!username) {
        alert('로그인 후 사용 가능합니다.')
        // TODO: open login/sign up modal
        return
      }
      const incrementValue = addOrRemove === 'add' ? 1 : -1

      const batch = firestore.batch()
      const postRef = firestore.collection('posts').doc(postId)

      // update post heartCount
      batch.update(postRef, { heartCount: increment(incrementValue) })
      if (addOrRemove === 'add') {
        batch.set(heartRef, {
          username,
          postId,
          createdAt: serverTimestamp(),
          value: 1
        })
      }
      // remove
      else {
        batch.delete(heartRef)
      }

      // update user heartCountTotal
      batchUpdateUsers(batch, user.uid, {
        providedHeartCountTotal: increment(incrementValue)
      })

      setLocalHeartCount(prev => prev + incrementValue)

      // commit the all batch updates
      await batch.commit()
    },
    [heartRef, postId, user, username]
  )

  return heartDoc?.exists ? (
    <FlexCenterDiv
      style={{ cursor: 'pointer' }}
      onClick={() => addRemoveHeart('remove')}
    >
      <FavoriteIcon />{' '}
      <span style={{ fontSize: '18px' }}>{localHeartCount}</span>
    </FlexCenterDiv>
  ) : (
    <FlexCenterDiv
      style={{ cursor: 'pointer' }}
      onClick={() => addRemoveHeart('add')}
    >
      <FavoriteBorderIcon />{' '}
      <span style={{ fontSize: '18px' }}>{localHeartCount}</span>
    </FlexCenterDiv>
  )
}

export default Heart
