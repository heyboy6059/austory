import { FC } from "react"
import dayjs from "dayjs"
import Link from "next/link"
import Image from "next/image"
import { Post } from "../../typing/interfaces"
import Paper from "@mui/material/Paper"

import {
  FlexVerticalCenterDiv,
  FlexCenterDiv,
  GridDiv,
  FlexSpaceBetween,
  EllipsisDiv,
} from "../../common/uiComponents"

import FavoriteIcon from "@mui/icons-material/Favorite"
import CommentIcon from "@mui/icons-material/Comment"
import Typography from "@mui/material/Typography"
import { KOR_MONTH_DAY_FORMAT } from "../../common/constants"
import AccountBoxIcon from "@mui/icons-material/AccountBox"

const PostItem: FC<{
  post: Post
  ownerUser?: boolean
}> = ({ post, ownerUser = false }): JSX.Element => {
  // Naive method to calc word count and read time
  const wordCount = post?.content.trim().split(/\s+/g).length
  const minutesToRead = (wordCount / 100 + 1).toFixed(0)

  // TODO: div clean up
  return (
    <Paper elevation={0} style={{ marginBottom: "5px" }}>
      <div style={{ padding: "12px" }}>
        <GridDiv
          style={{
            // thumbnailImage? give 100px space
            gridTemplateColumns: post.images?.[0]?.thumbnail100?.url
              ? "1fr 100px"
              : "1fr",
            gap: "4px",
          }}
        >
          <GridDiv
            style={{
              gridTemplateRows: "55px 45px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Link href={`/post/${post.slug}`} passHref>
                <Typography
                  style={{
                    fontSize: "20px",
                    margin: "2px 0",
                    wordWrap: "break-word",
                    fontWeight: "bold",
                    lineHeight: "1.2",
                  }}
                >
                  <a>{post.title}</a>
                </Typography>
              </Link>
            </div>
            <EllipsisDiv
              style={{
                cursor: "pointer",
              }}
            >
              <Link href={`/post/${post.slug}`} passHref>
                <Typography>
                  {post.excerpt ? `${post.excerpt}...` : post.content}
                </Typography>
              </Link>

              {ownerUser && (
                <>
                  <Link href={`/dashboard/${post.slug}`} passHref>
                    <h3>
                      <button className="btn-blue">Edit</button>
                    </h3>
                  </Link>
                </>
              )}
            </EllipsisDiv>
          </GridDiv>
          <div style={{ width: "100px", cursor: "pointer" }}>
            {post.images?.[0]?.thumbnail100?.url ? (
              <Link href={`/post/${post.slug}`} passHref>
                <Image
                  src={post.images[0].thumbnail100?.url}
                  alt=""
                  width={"100%"}
                  height={"100%"}
                  layout="responsive"
                  objectFit="contain"
                />
              </Link>
            ) : (
              ``
            )}
          </div>
        </GridDiv>
        <FlexSpaceBetween
          style={{
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "left",
              gap: "4px",
              fontSize: "12px",
            }}
          >
            <Link href={`/${post.username}`} passHref>
              <FlexCenterDiv style={{ gap: "2px" }}>
                <AccountBoxIcon style={{ fontSize: "16px" }} />
                {post.username}
              </FlexCenterDiv>
            </Link>
            <span>|</span>
            <span>{dayjs(post.createdAt).format(KOR_MONTH_DAY_FORMAT)}</span>
          </div>
          <FlexCenterDiv
            style={{
              gap: "6px",
              justifyContent: "right",
            }}
          >
            <FlexVerticalCenterDiv>
              <FavoriteIcon fontSize="small" /> {post.heartCount}
            </FlexVerticalCenterDiv>
            <FlexVerticalCenterDiv>
              <CommentIcon fontSize="small" /> {post.viewCount}
            </FlexVerticalCenterDiv>
          </FlexCenterDiv>
        </FlexSpaceBetween>
      </div>
    </Paper>
  )
}

export default PostItem
