import React, { FC, useContext, Dispatch, SetStateAction } from 'react'
import { Post } from '../../typing/interfaces'
import PostItem from './PostItem'
import Box from '@mui/material/Box'
import { UserContext } from '../../common/context'
import InfiniteScroll from 'react-infinite-scroller'
import { FlexCenterDiv } from '../../common/uiComponents'
import CircularProgress from '@mui/material/CircularProgress'
import AdSense from '../AdSense/AdSense'
import { MAIN_FEED_AD_SLOT_ID } from '../../common/constants'

// TODO: posts interface
const PostFeed: FC<{
  posts: Post[]
  loadMore: () => Promise<void>
  hasMore: boolean
  ownerUser?: boolean
  // REVIEW: post context
  setSelectedPost?: Dispatch<SetStateAction<Post>>
  setSelectedScrollPosition?: Dispatch<SetStateAction<number>>
}> = ({
  posts,
  loadMore,
  hasMore,
  ownerUser,
  setSelectedPost,
  setSelectedScrollPosition
}): JSX.Element => {
  const { isAdmin } = useContext(UserContext)
  return (
    <Box>
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={hasMore}
        loader={
          <FlexCenterDiv key={0}>
            <CircularProgress />
          </FlexCenterDiv>
        }
      >
        {posts
          ? posts
              // filter test posts out for non admin users
              .filter(p => (isAdmin ? true : !p.isTest))
              .map((post, index) => {
                return (
                  <>
                    <PostItem
                      post={post}
                      key={post.postId}
                      ownerUser={ownerUser}
                      setSelectedPost={setSelectedPost}
                      setSelectedScrollPosition={setSelectedScrollPosition}
                    />
                    {(index + 1) % 10 === 0 ? (
                      <div>
                        <AdSense adSlotId={MAIN_FEED_AD_SLOT_ID} />
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                )
              })
          : null}
      </InfiniteScroll>
    </Box>
  )
}

export default PostFeed
