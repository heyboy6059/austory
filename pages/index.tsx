import { useState, useEffect } from 'react'
import PostFeed from '../components/Post/PostFeed'

import {
  COLOURS,
  GENERIC_KOREAN_ERROR_MESSAGE,
  POST_FEED_NUM_LIMIT
} from '../common/constants'
import { FlexCenterDiv, FlexSpaceBetweenCenter } from '../common/uiComponents'

import ScrollToTop from 'react-scroll-up'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp'
import Head from 'next/head'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
// import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Post, PostType } from '../typing/interfaces'
import { getPostsByType } from '../common/get'
import toast from 'react-hot-toast'

import { useRouter } from 'next/router'
import PostContent from '../components/Post/PostContent'
import { Button } from '@mui/material'
import { FcCalculator } from 'react-icons/fc'

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

export const getServerSideProps = async context => {
  const { postType } = context.query

  // NOTE: community is default
  let posts = null
  let postTypeFromQuery = null
  if (postType === 'inkrau' || postType === 'community') {
    posts = await getPostsByType(postType)
    postTypeFromQuery = postType
  } else {
    posts = await getPostsByType('community')
  }

  return {
    props: { posts, postTypeFromQuery }
  }
}

const Home = ({ posts, postTypeFromQuery }) => {
  const router = useRouter()

  const [postType, setPostType] = useState<PostType>(
    postTypeFromQuery || 'community'
  )

  const [inkrauPosts, setInkrauPosts] = useState<Post[]>(
    postTypeFromQuery === 'inkrau' ? posts : []
  )
  // postType = community or null
  const [communityPosts, setCommunityPosts] = useState<Post[]>(
    postTypeFromQuery !== 'inkrau' ? posts : []
  )

  const [inkrauPostEnd, setInkrauPostEnd] = useState(false)
  const [communityPostEnd, setCommunityPostEnd] = useState(false)

  /**
   * REVIEW
   * move all post handling (incl. posts, selectedPost, selectedScrollPosition...) to the context
   * for better state management
   */
  const [selectedPost, setSelectedPost] = useState<Post>(null)
  const [selectedScrollPosition, setSelectedScrollPosition] =
    useState<number>(0)

  // manually handle browser back event
  useEffect(() => {
    router.beforePopState(({ as }) => {
      if (as !== router.asPath) {
        console.log('handling browser back event')

        // unselect post to show main feed
        setSelectedPost(null)

        // move back to previous scroll position
        setTimeout(() => {
          window.scrollTo(0, selectedScrollPosition)
        }, 0)

        // update url to home page
        router.push(`/`, undefined, { shallow: true })
      }
      // don't actually go back (move page)
      return false
    })

    console.log('outside - handling browser back event')
    return () => {
      router.beforePopState(() => true)
    }
  }, [router, selectedScrollPosition]) // Add any state variables to dependencies array if needed.

  // REVIEW: replace 0, 1 to actual string name
  // 0 = community contents menu
  // 1 = inkrau contents menu
  const [tabValue, setTabValue] = useState(
    postTypeFromQuery === 'community'
      ? 0
      : postTypeFromQuery === 'inkrau'
      ? 1
      : 0
  )

  // TODO: rename this
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const getMorePosts = async (postType: PostType) => {
    try {
      /**
       * 1. inkrau
       */
      if (postType === 'inkrau') {
        const newPosts = await getPostsByType(
          'inkrau',
          inkrauPosts[inkrauPosts.length - 1]
        )

        setInkrauPosts(inkrauPosts.concat(newPosts))

        if (newPosts.length < POST_FEED_NUM_LIMIT) {
          setInkrauPostEnd(true)
        }
        return
      }

      /**
       * 2. community
       */
      if (postType === 'community') {
        const newPosts = await getPostsByType(
          'community',
          communityPosts[communityPosts.length - 1]
        )

        setCommunityPosts(communityPosts.concat(newPosts))

        if (newPosts.length < POST_FEED_NUM_LIMIT) {
          setCommunityPostEnd(true)
        }
        return
      }

      throw new Error(`No matched postType found.`)
    } catch (err) {
      console.error(`Error in getMorePosts: ${err.message}`)
      toast.error(GENERIC_KOREAN_ERROR_MESSAGE)
    }
  }

  const getInitialPosts = async (postType: PostType) => {
    try {
      console.log('here!', postType)
      if (postType === 'community' && !communityPosts.length) {
        const posts = await getPostsByType('community')
        setCommunityPosts(posts)
      }
      if (postType === 'inkrau' && !inkrauPosts.length) {
        const posts = await getPostsByType('inkrau')
        setInkrauPosts(posts)
      }
    } catch (err) {
      console.error(`Error in getCommunityPosts: ${err.message}`)
      toast.error(GENERIC_KOREAN_ERROR_MESSAGE)
    }
  }

  const tabHandler = async (postType: PostType) => {
    setPostType(postType)
    await getInitialPosts(postType)
    // add postType in url query for browser back in the post page
    router.replace({
      query: { ...router.query, postType: postType }
    })
  }

  return (
    <div>
      <Head>
        <title>인크라우 inKRAU</title>
      </Head>
      {
        /**
         * Single Selected Post View
         */
        selectedPost ? (
          <Box
            style={{
              padding: '8px 0px'
            }}
          >
            <PostContent
              post={selectedPost}
              setSelectedPost={setSelectedPost}
              selectedScrollPosition={selectedScrollPosition}
            />
          </Box>
        ) : (
          /**
           * Main Post Feed View
           */
          <>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <FlexSpaceBetweenCenter>
                  <Tabs
                    value={tabValue}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="main menu tabs"
                    style={{ minHeight: '0', padding: '0', height: '42px' }}
                  >
                    <Tab
                      label={<strong>커뮤니티</strong>}
                      {...a11yProps(0)}
                      style={{ padding: '10px' }}
                      onClick={async () => {
                        tabHandler('community')
                      }}
                    />
                    <Tab
                      label={<strong>인크라우 컨텐츠</strong>}
                      {...a11yProps(1)}
                      style={{ padding: '10px 8px' }}
                      onClick={async () => {
                        tabHandler('inkrau')
                      }}
                    />
                  </Tabs>
                  <Button
                    size="small"
                    color="info"
                    variant="outlined"
                    onClick={() => router.push(`/calculator/wh`)}
                    style={{ marginRight: '2px' }}
                    startIcon={<FcCalculator />}
                  >
                    워홀 세금 계산기
                  </Button>
                </FlexSpaceBetweenCenter>
              </Box>
            </Box>
            <PostFeed
              posts={postType === 'community' ? communityPosts : inkrauPosts}
              loadMore={() => getMorePosts(postType)}
              hasMore={
                postType === 'community' ? !communityPostEnd : !inkrauPostEnd
              }
              setSelectedPost={setSelectedPost}
              setSelectedScrollPosition={setSelectedScrollPosition}
            />

            <FlexCenterDiv style={{ marginBottom: '10px' }}>
              {/* {!loading && !postsEnd && (
          <Button onClick={getMorePosts}>Load more</Button>
        )} */}
              {((postType === 'inkrau' && inkrauPostEnd) ||
                (postType === 'community' && communityPostEnd)) &&
                '더 이상 읽을 글이 없습니다.'}
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
          </>
        )
      }
    </div>
  )
}

export default Home
