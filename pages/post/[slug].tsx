import { FC } from "react"
import PostContent from "../../components/Post/PostContent"
import { firestore, postToJSON } from "../../common/firebase"
import { useDocumentData } from "react-firebase-hooks/firestore"

import Box from "@mui/material/Box"

import {
  FirebaseDocumentSnapshot,
  RawPost,
  Post,
} from "../../typing/interfaces"

export async function getStaticProps({ params }) {
  const {
    //   username,
    slug,
  } = params
  // console.log({ slug })
  //   const userDoc = await getUserWithUsername(username)

  let post: Post = null
  let path: string = null

  //   if (userDoc) {
  //     const postRef = userDoc.ref.collection("posts").doc(slug)
  //     post = tempPostToJSON(await postRef.get())

  //     path = postRef.path
  //   }

  const query = firestore.collection("posts").doc(slug)

  path = query.path
  // .where("deleted", "==", false)
  // .where("slug")
  // .orderBy("createdAt", "desc")

  //   const ref = firestore.

  // console.log("get!!@@", (await query.get()).data())
  // post = postToJSON((await query.get()))
  // docs.map(postToJSON)

  const queryDoc = await query.get()

  post = postToJSON(queryDoc as FirebaseDocumentSnapshot<RawPost>)

  return {
    props: { post, path },
    revalidate: 5000,
  }
}

export async function getStaticPaths() {
  // Improve my using Admin SDK to select empty docs
  //   const snapshot = await firestore.collectionGroup("posts").get()
  const snapshot = await firestore.collection("posts").get()

  console.log("here here!!")

  const paths = snapshot.docs.map((doc) => {
    const { slug } = doc.data()
    return {
      params: { slug },
    }
  })

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: "blocking",
  }
}

interface PostProps {
  post: Post
  path: string
}
const SinglePost: FC<PostProps> = ({ post, path }) => {
  const postRef = firestore.doc(path)

  return (
    <Box
      sx={{
        p: 1,
      }}
    >
      <PostContent post={post} postRef={postRef} />
    </Box>
  )
}

export default SinglePost
