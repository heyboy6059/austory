import React, { FC, useContext } from 'react'
import { Post } from '../../typing/interfaces'
import PostItem from './PostItem'
import Box from '@mui/material/Box'
import { UserContext } from '../../common/context'

// TODO: posts interface
const PostFeed: FC<{
  posts: Post[]
  ownerUser?: boolean
}> = ({ posts, ownerUser }): JSX.Element => {
  const { isAdmin } = useContext(UserContext)
  return (
    <Box>
      {posts
        ? isAdmin
          ? posts.map(post => (
              <PostItem post={post} key={post.slug} ownerUser={ownerUser} />
            ))
          : // filter test posts out for non admin users
            posts
              .filter(p => !p.isTest)
              .map(post => (
                <PostItem post={post} key={post.slug} ownerUser={ownerUser} />
              ))
        : null}
    </Box>
  )
}

export default PostFeed
