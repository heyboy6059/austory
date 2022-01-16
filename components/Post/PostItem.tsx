import { FC } from "react"
import dayjs from "dayjs"
import Link from "next/link"
import Image from "next/image"
import { Post } from "../../typing/interfaces"
import Paper from "@mui/material/Paper"

import { FlexVerticalCenterDiv, FlexCenterDiv } from "../../common/uiComponents"

import FavoriteIcon from "@mui/icons-material/Favorite"
import CommentIcon from "@mui/icons-material/Comment"
import { KOR_MONTH_DAY_FORMAT } from "../../common/constants"

const PostItem: FC<{
  post: Post
  ownerUser?: boolean
}> = ({ post, ownerUser = false }): JSX.Element => {
  // Naive method to calc word count and read time
  const wordCount = post?.content.trim().split(/\s+/g).length
  const minutesToRead = (wordCount / 100 + 1).toFixed(0)

  // TODO: div clean up
  return (
    <Paper elevation={3} style={{ marginBottom: "10px" }}>
      <div style={{ padding: "16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "right",
            gap: "4px",
            fontSize: "12px",
          }}
        >
          <Link href={`/${post.username}`}>
            <a>
              <span>By {post.username}</span>
            </a>
          </Link>
          <span>|</span>
          <span>{dayjs(post.createdAt).format(KOR_MONTH_DAY_FORMAT)}</span>
        </div>

        <div
          style={{
            display: "grid",
            // thumbnailImage? give 100px space
            gridTemplateColumns: post.images?.[0]?.thumbnail100?.url
              ? "1fr 100px"
              : "1fr",
          }}
        >
          <div>
            <div>
              <div>
                {/* <Link href={`/${post.username}/${post.slug}`} passHref> */}
                <Link href={`/post/${post.slug}`} passHref>
                  <h3>
                    <a>{post.title}</a>
                  </h3>
                </Link>
              </div>
            </div>
            <div>
              <div>{post.excerpt ? `${post.excerpt}...` : post.content}</div>
              {ownerUser && (
                <>
                  <Link href={`/dashboard/${post.slug}`} passHref>
                    <h3>
                      <button className="btn-blue">Edit</button>
                    </h3>
                  </Link>
                </>
              )}
            </div>
            <div>
              <FlexCenterDiv
                style={{
                  gap: "4px",
                  justifyContent: "left",
                  marginTop: "10px",
                }}
              >
                <FlexVerticalCenterDiv>
                  <FavoriteIcon /> {post.heartCount}
                </FlexVerticalCenterDiv>
                <FlexVerticalCenterDiv>
                  <CommentIcon /> {post.viewCount}
                </FlexVerticalCenterDiv>
              </FlexCenterDiv>
            </div>
          </div>
          <div style={{ width: "100px" }}>
            {/**
             * TODO: properly display image - alignment, remove image grid column when there is no image
             */}
            {post.images?.[0]?.thumbnail100?.url ? (
              <Image
                src={post.images[0].thumbnail100?.url}
                alt=""
                width={"100%"}
                height={"100%"}
                layout="responsive"
                objectFit="contain"
              />
            ) : (
              ``
            )}
          </div>
        </div>
      </div>
    </Paper>
  )
}

export default PostItem
