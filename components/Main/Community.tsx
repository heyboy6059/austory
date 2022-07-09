import Box from '@mui/material/Box'
import { FC, useState, useEffect, Dispatch, SetStateAction } from 'react'
import { Post } from '../../typing/interfaces'
import PostContent from '../Post/PostContent'
import { useRouter } from 'next/router'
import PostFeed from '../Post/PostFeed'
import { FlexCenterDiv } from '../../common/uiComponents'
import { getPostsByTopCategory } from '../../common/get'
import {
  COLOURS,
  GENERIC_KOREAN_ERROR_MESSAGE,
  POST_FEED_NUM_LIMIT
} from '../../common/constants'
import toast from 'react-hot-toast'
import ScrollToTop from 'react-scroll-up'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp'
import { TopCategoryTab } from '../../typing/enums'

interface Props {
  posts: Post[]
  selectedPost: Post
  setSelectedPost: Dispatch<SetStateAction<Post>>
  selectedTopCategoryMenu: TopCategoryTab
}

const Community: FC<Props> = ({
  posts,
  selectedPost,
  setSelectedPost,
  selectedTopCategoryMenu
}) => {
  const router = useRouter()
  const [communityPosts, setCommunityPosts] = useState<Post[]>(posts)
  useEffect(() => {
    if (posts) setCommunityPosts(posts)
  }, [posts])
  const [communityPostEnd, setCommunityPostEnd] = useState(false)

  //   const [selectedPost, setSelectedPost] = useState<Post>(null)
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
  }, [router, selectedScrollPosition, setSelectedPost]) // Add any state variables to dependencies array if needed.

  const getMorePosts = async () => {
    try {
      /**
       * community post type
       */
      const newPosts = await getPostsByTopCategory(
        selectedTopCategoryMenu || TopCategoryTab.ALL,
        communityPosts[communityPosts.length - 1]
      )

      setCommunityPosts(communityPosts.concat(newPosts))

      if (newPosts.length < POST_FEED_NUM_LIMIT) {
        setCommunityPostEnd(true)
      }
    } catch (err) {
      console.error(`Error in getMorePosts: ${err.message}`)
      toast.error(GENERIC_KOREAN_ERROR_MESSAGE)
    }
  }

  useEffect(() => {
    if (selectedTopCategoryMenu) {
      console.log(`setCommunityPostEnd false in useEffect`)
      setCommunityPostEnd(false)
    }
  }, [selectedTopCategoryMenu])

  return (
    <>
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
            <PostFeed
              posts={communityPosts}
              loadMore={() => getMorePosts()}
              hasMore={!communityPostEnd}
              setSelectedPost={setSelectedPost}
              setSelectedScrollPosition={setSelectedScrollPosition}
            />

            <FlexCenterDiv style={{ marginBottom: '10px' }}>
              {/* {!loading && !postsEnd && (
              <Button onClick={getMorePosts}>Load more</Button>
            )} */}
              {communityPostEnd && '더 이상 읽을 글이 없습니다.'}
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
    </>
  )
}

export default Community
