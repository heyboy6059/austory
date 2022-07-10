import { FC } from 'react'
import PostContent from '../../components/Post/PostContent'
import { firestore, postToJSON } from '../../common/firebase'

import Box from '@mui/material/Box'

import {
  FirebaseDocumentSnapshot,
  RawPost,
  Post
} from '../../typing/interfaces'

export const getServerSideProps = async context => {
  const query = firestore
    .collection('posts')
    .doc(context.params.postId as string)

  const queryDoc = await query.get()

  const post = postToJSON(queryDoc as FirebaseDocumentSnapshot<RawPost>)

  return {
    props: { post }
  }
}

interface PostProps {
  post: Post
  path: string
}
const SinglePost: FC<PostProps> = ({ post }) => {
  return (
    <Box
      style={{
        padding: '8px 0px'
      }}
    >
      <PostContent
        post={post}
        // this route is from direct access using url
        fromDirectLink={true}
      />
    </Box>
  )
}

export default SinglePost
