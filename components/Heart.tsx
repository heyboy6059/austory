import { FC, useCallback, useContext, useState } from 'react'
import { firestore, increment, serverTimestamp } from '../common/firebase'
import { generateHeartDocumentId } from '../common/idHelper'
import { useDocument } from 'react-firebase-hooks/firestore'
import { FlexCenterDiv } from '../common/uiComponents'
import { batchUpdateUsers } from '../common/update'
import { UserContext } from '../common/context'
import toast from 'react-hot-toast'
import { RawHeart } from '../typing/interfaces'
import { COLOURS, FIRESTORE_POSTS } from '../common/constants'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import Tooltip from '@mui/material/Tooltip'
interface Props {
  postId: string
  heartCount: number
  username: string
}
const Heart: FC<Props> = ({ postId, heartCount, username }) => {
  // REVIEW: better way to have user?
  const { user, isAdmin } = useContext(UserContext)
  const heartId = `${generateHeartDocumentId(postId, user?.uid)}`
  const heartRef = firestore.collection('hearts').doc(heartId)
  const [heartDoc] = useDocument(heartRef)
  const [localHeartCount, setLocalHeartCount] = useState(heartCount)

  const addRemoveHeart = useCallback(
    async (addOrRemove: 'add' | 'remove') => {
      try {
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
            heartId,
            uid: user.uid,
            postId,
            createdAt: serverTimestamp(),
            value: 1
          } as RawHeart)
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

        // if (addOrRemove === 'add') {
        // toast.success(`좋아요를 표시한 게시물에 추가 되었습니다.`)
        // }
      } catch (err) {
        console.error(`Error in addRemoveHeart. ${err.message}`)
        toast.error(`에러가 발생했습니다. 다시 시도해주세요.`)
      }
    },
    [heartId, heartRef, postId, user, username]
  )

  const adminOnlyHeartAdd = async () => {
    const postRef = firestore.collection(FIRESTORE_POSTS).doc(postId)
    await postRef.update({
      heartCount: increment(1)
    })
    setLocalHeartCount(prev => prev + 1)
    toast.success(`관리자 권한으로 하트를 추가했습니다.`)
  }
  return (
    <>
      {heartDoc?.exists ? (
        <FlexCenterDiv
          style={{ cursor: 'pointer' }}
          onClick={() => addRemoveHeart('remove')}
        >
          <AiFillHeart style={{ fontSize: '25px', color: COLOURS.HEART_RED }} />{' '}
          <span style={{ fontSize: '20px' }}>{localHeartCount}</span>
        </FlexCenterDiv>
      ) : (
        <FlexCenterDiv
          style={{ cursor: 'pointer' }}
          onClick={() => addRemoveHeart('add')}
        >
          <AiOutlineHeart style={{ fontSize: '25px' }} />{' '}
          <span style={{ fontSize: '20px' }}>{localHeartCount}</span>
        </FlexCenterDiv>
      )}
      {/**
       * ADMIN ONLY
       *  - ADD HEART COUNT
       */}
      {isAdmin ? (
        <FlexCenterDiv>
          <Tooltip title="관리자 only" placement="bottom" arrow>
            <AddCircleIcon
              style={{ cursor: 'pointer', color: COLOURS.BRIGHT_GREEN }}
              onClick={() => adminOnlyHeartAdd()}
            />
          </Tooltip>
        </FlexCenterDiv>
      ) : (
        <></>
      )}
    </>
  )
}

export default Heart
