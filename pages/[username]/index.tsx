import { getUserWithUsername, userToJSON } from '../../common/firebase'
import UserProfile from '../../components/UserProfile'
import {
  FirebaseDocumentSnapshot,
  RawUser,
  User
} from '../../typing/interfaces'
import { FlexCenterDiv } from '../../common/uiComponents'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { FC } from 'react'

export const getServerSideProps = async ({ query }) => {
  const { username } = query

  const userDoc = await getUserWithUsername(username)

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true
    }
  }

  // JSON serializable data
  let user: User = null
  // let posts = null

  if (userDoc) {
    // REVIEW: is it okay to cast?
    user = userToJSON(userDoc as FirebaseDocumentSnapshot<RawUser>)
    // console.log({ user })
    // const postsQuery = userDoc.ref
    //   .collection("posts")
    //   .where("published", "==", true)
    //   .orderBy("createdAt", "desc")
    //   .limit(5)

    // posts = (await postsQuery.get()).docs.map(postToJSON)
  }

  return {
    props: { user }
  }
}

interface Props {
  user: User
}
const UserProfilePage: FC<Props> = ({ user }) => {
  const isAdmin = user.isAdmin
  return (
    <main>
      <UserProfile user={user} />
      {isAdmin && (
        <FlexCenterDiv style={{ margin: '15px 0px' }}>
          <span>관리자</span>
          <AdminPanelSettingsIcon style={{ color: 'orange' }} />
        </FlexCenterDiv>
      )}

      {/* <h3 style={{ textAlign: 'center' }}>내가 쓴 글 보기</h3> */}
      <FlexCenterDiv style={{ height: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'red' }}>TODO: username 변경하기</div>
          <div style={{ color: 'red' }}>TODO: 로그아웃</div>
          {/* <WarningIcon style={{ color: 'orange' }} fontSize="large" /> */}
          <div>내가 작성한 글 개수</div>
          <div>{user.myPostCountTotal}</div>
          <div>내가 작성한 댓글 개수</div>
          <div>{user.providedCommentCountTotal}</div>
          <div>내가 누른 하트 개수</div>
          <div>{user.providedHeartCountTotal}</div>
          <div>-------</div>
          <div>내 글에 달린 댓글 총 개수</div>
          <div>{user.receivedCommentCountTotal}</div>
          <div>내 글에 달린 하트 총 개수</div>
          <div>{user.receivedCommentCountTotal}</div>
          <div>내가 쓴 글 총 조회수</div>
          <div>{user.receivedViewCountTotal}</div>
        </div>
      </FlexCenterDiv>
      {/* <PostFeed posts={posts} /> */}
    </main>
  )
}

export default UserProfilePage
