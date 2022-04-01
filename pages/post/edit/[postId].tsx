import { FC } from 'react'
import { firestore, postToJSON } from '../../../common/firebase'
import PostForm from '../../../components/Post/PostForm'
import {
  FirebaseDocumentSnapshot,
  Post,
  RawPost
} from '../../../typing/interfaces'

export const getServerSideProps = async ({ query }) => {
  const { postId } = query

  const docRef = firestore.collection('posts').doc(postId)
  const docSnapshot = await docRef.get()
  const post: Post = postToJSON(
    docSnapshot as FirebaseDocumentSnapshot<RawPost>
  )

  return {
    props: {
      post
    }
  }
}

interface Props {
  post: Post
}
const EditPost: FC<Props> = ({ post }) => {
  //   console.log("post in edit", post)
  return <PostForm editPost={post} />
}

export default EditPost
