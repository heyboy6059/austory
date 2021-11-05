import React, { FC } from "react"
import Link from "next/link"
import { Post } from "../typing/interfaces"

// TODO: posts interface
const PostFeed: FC<{
  posts: Post[]
  ownerUser?: boolean
}> = ({ posts, ownerUser }): JSX.Element => {
  return (
    <>
      {posts
        ? posts.map((post) => (
            <PostItem post={post} key={post.slug} ownerUser={ownerUser} />
          ))
        : null}
    </>
  )
}

const PostItem: FC<{
  post: Post
  ownerUser?: boolean
}> = ({ post, ownerUser = false }): JSX.Element => {
  // Naive method to calc word count and read time
  const wordCount = post?.content.trim().split(/\s+/g).length
  const minutesToRead = (wordCount / 100 + 1).toFixed(0)

  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>

      <Link href={`/${post.username}/${post.slug}`}>
        <h2>
          <a>{post.title}</a>
        </h2>
      </Link>

      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span className="push-left">💗 {post.heartCount || 0} Hearts</span>
      </footer>

      {/* If owner user view, show extra controls for user */}
      {ownerUser && (
        <>
          <Link href={`/dashboard/${post.slug}`}>
            <h3>
              <button className="btn-blue">Edit</button>
            </h3>
          </Link>

          {post.published ? (
            <p className="text-success">Live</p>
          ) : (
            <p className="text-danger">Unpublished</p>
          )}
        </>
      )}
    </div>
  )
}

export default PostFeed
