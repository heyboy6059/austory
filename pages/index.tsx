import { useState } from 'react'
import PostFeed from '../components/Post/PostFeed'
import { firestore, fromMillis, postToJSON } from '../common/firebase'

import { COLOURS, POST_FEED_NUM_LIMIT } from '../common/constants'
import { FlexCenterDiv } from '../common/uiComponents'

import ScrollToTop from 'react-scroll-up'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp'
import Head from 'next/head'

export const getServerSideProps = async context => {
  context
  const postsQuery = firestore
    .collection('posts')
    .where('deleted', '==', false)
    .orderBy('createdAt', 'desc')
    .limit(POST_FEED_NUM_LIMIT)

  const posts = (await postsQuery.get()).docs.map(postToJSON)

  return {
    props: { posts } // will be passed to the page component as props
  }
}

const Home = props => {
  const [posts, setPosts] = useState(props.posts)
  // const [loading, setLoading] = useState(false)

  const [postsEnd, setPostsEnd] = useState(false)

  const getMorePosts = async () => {
    // setLoading(true)
    const last = posts[posts.length - 1]

    const cursor =
      typeof last.createdAt === 'number'
        ? fromMillis(last.createdAt)
        : last.createdAt

    const query = firestore
      .collection('posts')
      .where('deleted', '==', false)
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(POST_FEED_NUM_LIMIT)

    const newPosts = (await query.get()).docs.map(postToJSON)

    setPosts(posts.concat(newPosts))
    // setLoading(false)

    if (newPosts.length < POST_FEED_NUM_LIMIT) {
      setPostsEnd(true)
    }
  }

  return (
    <div style={{ marginTop: '10px' }}>
      <Head>
        <title>inKRAU 인크라우</title>
      </Head>
      <PostFeed posts={posts} loadMore={getMorePosts} hasMore={!postsEnd} />

      <FlexCenterDiv style={{ marginBottom: '10px' }}>
        {/* {!loading && !postsEnd && (
          <Button onClick={getMorePosts}>Load more</Button>
        )} */}
        {postsEnd && '더 이상 읽을 글이 없습니다.'}
      </FlexCenterDiv>

      {/* <Loader show={loading} /> */}
      <ScrollToTop showUnder={300} style={{ bottom: 25, right: 15 }}>
        <span>
          <ArrowCircleUpIcon
            style={{
              backgroundColor: COLOURS.DARK_BLUE,
              color: 'white',
              borderRadius: '30px',
              fontSize: '35px',
              opacity: 0.85
            }}
          />
        </span>
      </ScrollToTop>
    </div>
  )
}

export default Home
