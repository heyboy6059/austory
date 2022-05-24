import UserProfile from '../../components/UserProfile'
import { FlexCenterDiv } from '../../common/uiComponents'
import { FC, useCallback, useContext, useEffect, useState } from 'react'
import { UserContext } from '../../common/context'
import toast from 'react-hot-toast'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import {
  MarketingEmailSubscription,
  NotificationMethod
} from '../../typing/enums'
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
  // const router = useRouter()
  const { user } = useContext(UserContext)
  const [internalUser, setInternalUser] = useState(user)

  // console.log({ user })
  // console.log({ internalUser })

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

  const marketingSubscriptionHandler = useCallback(
    async (marketingEmailSubscription: MarketingEmailSubscription) => {
      const oldValue = internalUser.isMarketingEmail
      try {
        setInternalUser(prev => ({
          ...prev,
          isMarketingEmail:
            marketingEmailSubscription === MarketingEmailSubscription.SUBSCRIBE
              ? true
              : false
        }))
        await updateUser(user.uid, {
          isMarketingEmail:
            marketingEmailSubscription === MarketingEmailSubscription.SUBSCRIBE
              ? true
              : false
        })
      } catch (err) {
        console.error(`Error in marketingSubscriptionHandler. ${err.message}`)
        setInternalUser(prev => ({
          ...prev,
          isMarketingEmail: oldValue
        }))
        toast.error(GENERIC_KOREAN_ERROR_MESSAGE)
      }
    },
    [internalUser, user]
  )

  console.log('method?', internalUser?.notificationMethod)
  return (
    <main>
      {user ? (
        <>
          <UserProfile />

          {/* <h3 style={{ textAlign: 'center' }}>내가 쓴 글 보기</h3> */}
          <FlexCenterDiv style={{ height: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              {/* <div style={{ color: 'red' }}>TODO: username 변경하기</div> */}
              {/* <div style={{ color: 'red' }}>TODO: 댓글 알림 기능 변경하기</div> */}
              <FormControl fullWidth style={{ margin: '10px 0' }}>
                {/* <InputLabel id="notification-method-select-label">
                  댓글 알림
                </InputLabel> */}
                <small style={{ margin: '5px 0' }}>
                  *내 글에 달린 새로운 댓글 이메일 알림
                </small>
                <Select
                  labelId="notification-method-select-label"
                  id="notification-method-select"
                  value={internalUser ? internalUser.notificationMethod : null}
                  // label="댓글 알림"
                  onChange={(event: SelectChangeEvent) => {
                    notificationMethodHandler(
                      event.target.value as NotificationMethod
                    )
                  }}
                  size="small"
                  style={{
                    width: '200px',
                    alignSelf: 'center'
                  }}
                >
                  <MenuItem value={NotificationMethod.EMAIL}>사용</MenuItem>
                  <MenuItem value={NotificationMethod.NONE}>
                    사용 안 함
                  </MenuItem>
                  {/* <MenuItem value={30}>Thirty</MenuItem> */}
                </Select>
              </FormControl>

              <FormControl fullWidth style={{ margin: '10px 0' }}>
                {/* <InputLabel id="notification-method-select-label">
                  댓글 알림
                </InputLabel> */}
                <small style={{ margin: '5px 0' }}>
                  *인크라우에서 보내는 호주 소식, 정보 이메일
                </small>
                <Select
                  labelId="marketing-email-select-label"
                  id="marketing-email-select"
                  value={
                    internalUser
                      ? internalUser.isMarketingEmail
                        ? MarketingEmailSubscription.SUBSCRIBE
                        : MarketingEmailSubscription.UNSUBSCRIBE
                      : null
                  }
                  // label="댓글 알림"
                  onChange={(event: SelectChangeEvent) => {
                    // notificationMethodHandler(
                    //   event.target.value
                    // )
                    // console.log('here!', event.target.value)
                    marketingSubscriptionHandler(
                      event.target.value as MarketingEmailSubscription
                    )
                  }}
                  size="small"
                  style={{
                    width: '200px',
                    alignSelf: 'center'
                  }}
                >
                  <MenuItem value={MarketingEmailSubscription.SUBSCRIBE}>
                    구독
                  </MenuItem>
                  <MenuItem value={MarketingEmailSubscription.UNSUBSCRIBE}>
                    구독 안 함
                  </MenuItem>
                  {/* <MenuItem value={30}>Thirty</MenuItem> */}
                </Select>
              </FormControl>
              {/* <WarningIcon style={{ color: 'orange' }} fontSize="large" /> */}
            </div>
          </FlexCenterDiv>
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
