import React, { FC, useContext } from 'react'
import { Post } from '../../typing/interfaces'
import PostItem from './PostItem'
import Box from '@mui/material/Box'
import { UserContext } from '../../common/context'
import InfiniteScroll from 'react-infinite-scroller'
import { FlexCenterDiv } from '../../common/uiComponents'
import CircularProgress from '@mui/material/CircularProgress'

// TODO: posts interface
const PostFeed: FC<{
  posts: Post[]
  loadMore: () => Promise<void>
  hasMore: boolean
  ownerUser?: boolean
}> = ({ posts, loadMore, hasMore, ownerUser }): JSX.Element => {
  const { isAdmin } = useContext(UserContext)
  return (
    <Box>
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={hasMore}
        loader={
          <FlexCenterDiv>
            <CircularProgress />
          </FlexCenterDiv>
        }
      >
        {posts
          ? isAdmin
            ? posts.map(post => (
                <PostItem post={post} key={post.postId} ownerUser={ownerUser} />
              ))
            : // filter test posts out for non admin users
              posts
                .filter(p => !p.isTest)
                .map(post => (
                  <PostItem
                    post={post}
                    key={post.postId}
                    ownerUser={ownerUser}
                  />
                ))
          : null}
      </InfiniteScroll>
    </Box>
  )
}

export default PostFeed
