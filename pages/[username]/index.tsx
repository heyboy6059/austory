import { getUserWithUsername, postToJSON } from "../../common/firebase"
import UserProfile from "../../components/UserProfile"
import PostFeed from "../../components/Post/PostFeed"
import { Post, User } from "../../typing/interfaces"

export const getServerSideProps = async ({ query }) => {
  const { username } = query

  const userDoc = await getUserWithUsername(username)

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    }
  }

  // JSON serializable data
  let user = null
  let posts = null

  if (userDoc) {
    // REVIEW: is it okay to cast?
    user = userDoc.data() as User
    const postsQuery = userDoc.ref
      .collection("posts")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .limit(5)

    console.log("hit!!!!")
    posts = (await postsQuery.get()).docs.map(postToJSON)
  }

  return {
    props: { user, posts },
  }
}

const UserProfilePage = ({ user, posts }) => {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  )
}

export default UserProfilePage
