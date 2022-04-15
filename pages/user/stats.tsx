import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import { NextPage } from 'next'
import { useContext } from 'react'
import { UserContext } from '../../common/context'
import { FlexCenterDiv } from '../../common/uiComponents'

const UserStats: NextPage = () => {
  const { user } = useContext(UserContext)
  return (
    <FlexCenterDiv style={{ marginTop: '15px' }}>
      {user ? (
        <div>
          <h3 style={{ textAlign: 'center' }}>나의 활동</h3>
          <div style={{ margin: '15px 0' }}>
            <Stack spacing={1}>
              <Chip
                label={`내가 작성한 글: ${user.myPostCountTotal}개`}
                color="default"
              />
              <Chip
                label={`내 글 조회수: ${user.receivedViewCountTotal}회`}
                color="default"
              />
              <Chip
                label={`내 글에 달린 댓글: ${user.receivedCommentCountTotal}개`}
                color="default"
              />
              <Chip
                label={`내 글에 달린 하트: ${user.receivedHeartCountTotal}개`}
                color="default"
              />
              <Chip
                label={`내가 작성한 댓글: ${user.providedCommentCountTotal}개`}
                color="default"
              />
              <Chip
                label={`내가 누른 하트: ${user.providedHeartCountTotal}개`}
                color="default"
              />
            </Stack>
          </div>
        </div>
      ) : (
        <div>로그인을 해주세요.</div>
      )}
    </FlexCenterDiv>
  )
}

export default UserStats
