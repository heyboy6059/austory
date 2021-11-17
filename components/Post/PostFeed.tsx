import React, { FC } from "react"
import { Post } from "../../typing/interfaces"
import PostItem from "./PostItem"
import Box from "@mui/material/Box"

// TODO: posts interface
const PostFeed: FC<{
  posts: Post[]
  ownerUser?: boolean
}> = ({ posts, ownerUser }): JSX.Element => {
  return (
    <Box>
      {posts
        ? posts.map((post) => (
            <PostItem post={post} key={post.slug} ownerUser={ownerUser} />
          ))
        : null}
    </Box>
  )
}

export default PostFeed
