import {
  getUserWithUsername,
  postToJSON,
  userToJSON
} from '../../common/firebase'
import UserProfile from '../../components/UserProfile'
import PostFeed from '../../components/Post/PostFeed'
import {
  FirebaseDocumentSnapshot,
  Post,
  RawUser
} from '../../typing/interfaces'
import { FlexCenterDiv } from '../../common/uiComponents'
import WarningIcon from '@mui/icons-material/Warning'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

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
  let user = null
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

const UserProfilePage = ({ user }) => {
  return (
    <main>
      <UserProfile user={user} />
      <FlexCenterDiv style={{ margin: '15px 0px' }}>
        <span>관리자</span>
        <AdminPanelSettingsIcon style={{ color: 'orange' }} />
      </FlexCenterDiv>
      <h3 style={{ textAlign: 'center' }}>내가 쓴 글 보기</h3>
      <FlexCenterDiv style={{ height: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <WarningIcon style={{ color: 'orange' }} fontSize="large" />
          <div>준비중 입니다.</div>
        </div>
      </FlexCenterDiv>
      {/* <PostFeed posts={posts} /> */}
    </main>
  )
}

export default UserProfilePage
