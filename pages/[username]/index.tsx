import { auth } from '../../common/firebase'
import UserProfile from '../../components/UserProfile'
import { FlexCenterDiv } from '../../common/uiComponents'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { FC, useCallback, useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'
import { UserContext } from '../../common/context'
import toast from 'react-hot-toast'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import { NotificationMethod } from '../../typing/enums'
import Stack from '@mui/material/Stack'
import { updateUser } from '../../common/update'
import { GENERIC_KOREAN_ERROR_MESSAGE } from '../../common/constants'
import CircularProgress from '@mui/material/CircularProgress'

// export const getServerSideProps = async ({ query }) => {
//   const { username } = query

//   const userDoc = await getUserWithUsername(username)

//   // If no user, short circuit to 404 page
//   if (!userDoc) {
//     return {
//       notFound: true
//     }
//   }

//   // JSON serializable data
//   let user: User = null
//   // let posts = null

//   if (userDoc) {
//     // REVIEW: is it okay to cast?
//     user = userToJSON(userDoc as FirebaseDocumentSnapshot<RawUser>)
//     // console.log({ user })
//     // const postsQuery = userDoc.ref
//     //   .collection("posts")
//     //   .where("published", "==", true)
//     //   .orderBy("createdAt", "desc")
//     //   .limit(5)

//     // posts = (await postsQuery.get()).docs.map(postToJSON)
//   }

//   return {
//     props: { user }
//   }
// }

// interface Props {
//   user: User
// }
const UserProfilePage: FC = () => {
  const router = useRouter()
  const { user, isAdmin } = useContext(UserContext)
  const [internalUser, setInternalUser] = useState(user)

  console.log({ user })
  console.log({ internalUser })

  useEffect(() => {
    if (user && !internalUser) {
      console.log('Update internalUser')
      setInternalUser(user)
    }
  }, [internalUser, user])

  const notificationMethodHandler = useCallback(
    async (notificationMethod: NotificationMethod) => {
      const oldValue = internalUser.notificationMethod
      try {
        setInternalUser(prev => ({
          ...prev,
          notificationMethod
        }))
        await updateUser(user.uid, {
          notificationMethod
        })
      } catch (err) {
        console.error(`Error in notificationMethodHandler. ${err.message}`)
        setInternalUser(prev => ({
          ...prev,
          notificationMethod: oldValue
        }))
        toast.error(GENERIC_KOREAN_ERROR_MESSAGE)
      }
    },
    [internalUser, user]
  )

  return (
    <main>
      {user ? (
        <>
          <UserProfile />
          <FlexCenterDiv>
            <Button
              onClick={async () => {
                await auth.signOut()
                router.push('/')
                toast.success(`로그아웃 되었습니다.`)
              }}
            >
              로그아웃
            </Button>
          </FlexCenterDiv>
          {/* <h3 style={{ textAlign: 'center' }}>내가 쓴 글 보기</h3> */}
          <FlexCenterDiv style={{ height: '100%' }}>
            <div style={{ textAlign: 'center', width: '200px' }}>
              {/* <div style={{ color: 'red' }}>TODO: username 변경하기</div> */}
              {/* <div style={{ color: 'red' }}>TODO: 댓글 알림 기능 변경하기</div> */}
              <FormControl fullWidth style={{ margin: '10px 0' }}>
                {/* <InputLabel id="notification-method-select-label">
                  댓글 알림
                </InputLabel> */}
                <small style={{ margin: '5px 0' }}>
                  *내 글에 달린 새로운 댓글 알림
                </small>
                <Select
                  labelId="notification-method-select-label"
                  id="notification-method-select"
                  value={internalUser?.notificationMethod}
                  // label="댓글 알림"
                  onChange={(event: SelectChangeEvent) => {
                    notificationMethodHandler(
                      event.target.value as NotificationMethod
                    )
                  }}
                  size="small"
                >
                  <MenuItem value={NotificationMethod.EMAIL}>이메일</MenuItem>
                  <MenuItem value={NotificationMethod.NONE}>
                    사용 안 함
                  </MenuItem>
                  {/* <MenuItem value={30}>Thirty</MenuItem> */}
                </Select>
              </FormControl>
              {/* <WarningIcon style={{ color: 'orange' }} fontSize="large" /> */}
              <div style={{ marginTop: '20px' }}>나의 활동</div>
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
          </FlexCenterDiv>
          {isAdmin && (
            <>
              <FlexCenterDiv style={{ margin: '15px 0px 0px 0px' }}>
                <span>관리자</span>
                <AdminPanelSettingsIcon style={{ color: 'orange' }} />
              </FlexCenterDiv>
              <FlexCenterDiv>
                <Button
                  variant="outlined"
                  style={{ margin: '10px 0px' }}
                  onClick={() => router.push('/admin')}
                >
                  관리자 페이지로 이동
                </Button>
              </FlexCenterDiv>
            </>
          )}
          {/* <PostFeed posts={posts} /> */}
        </>
      ) : (
        <FlexCenterDiv>
          <CircularProgress />
        </FlexCenterDiv>
      )}
    </main>
  )
}

export default UserProfilePage
