import Head from "next/head"
import styles from "../styles/Home.module.css"
import Link from "next/link"
import toast from "react-hot-toast"

import { useState } from "react"
import PostFeed from "../components/Post/PostFeed"
import Loader from "../components/Loader"
import { firestore, fromMillis, postToJSON } from "../common/firebase"

import Divider from "@mui/material/Divider"

import { POST_FEED_NUM_LIMIT } from "../common/constants"

export const getServerSideProps = async (context) => {
  const postsQuery = firestore
    .collection("posts")
    .where("deleted", "==", false)
    .orderBy("createdAt", "desc")
    .limit(POST_FEED_NUM_LIMIT)

  const posts = (await postsQuery.get()).docs.map(postToJSON)

  return {
    props: { posts }, // will be passed to the page component as props
  }
}

const Home = (props) => {
  const [posts, setPosts] = useState(props.posts)
  const [loading, setLoading] = useState(false)

  const [postsEnd, setPostsEnd] = useState(false)

  const getMorePosts = async () => {
    setLoading(true)
    const last = posts[posts.length - 1]

    const cursor =
      typeof last.createdAt === "number"
        ? fromMillis(last.createdAt)
        : last.createdAt

    const query = firestore
      .collection("posts")
      .where("deleted", "==", false)
      .orderBy("createdAt", "desc")
      .startAfter(cursor)
      .limit(POST_FEED_NUM_LIMIT)

    const newPosts = (await query.get()).docs.map(postToJSON)

    setPosts(posts.concat(newPosts))
    setLoading(false)

    if (newPosts.length < POST_FEED_NUM_LIMIT) {
      setPostsEnd(true)
    }
  }

  return (
    <div>
      <PostFeed posts={posts} />

      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}

      <Loader show={loading} />

      {postsEnd && "You have reached the end!"}
    </div>
  )
}

export default Home
