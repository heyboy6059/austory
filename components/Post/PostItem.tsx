import { FC } from "react"
import dayjs from "dayjs"
import Link from "next/link"
import Image from "next/image"
import { Post } from "../../typing/interfaces"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"

import { FlexVerticalCenterDiv, FlexCenterDiv } from "../../common/uiComponents"

import FavoriteIcon from "@mui/icons-material/Favorite"
import CommentIcon from "@mui/icons-material/Comment"

const PostItem: FC<{
  post: Post
  ownerUser?: boolean
}> = ({ post, ownerUser = false }): JSX.Element => {
  // Naive method to calc word count and read time
  const wordCount = post?.content.trim().split(/\s+/g).length
  const minutesToRead = (wordCount / 100 + 1).toFixed(0)

  // TODO: div clean up
  return (
    <Card variant="outlined">
      <CardContent sx={{ padding: "16px" }}>
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
          <span>{dayjs(post.createdAt).format("MM월 DD일 h:mm A")}</span>
        </div>
        <div
        // style={{
        //   display: "grid",
        //   gridTemplateColumns: "120px 1fr",
        //   gap: "10px",
        // }}
        >
          {/** TODO: Implement IMAGE support */}
          {/* <Image
            width={120}
            height={90}
            src="https://via.placeholder.com/120x90.png?text=TEST+IMAGE"
            alt="post feed image"
          /> */}
          <div>
            <Link href={`/${post.username}/${post.slug}`} passHref>
              <h3>
                <a>{post.title}</a>
              </h3>
            </Link>
          </div>
        </div>
        <div>
          <div>{post.content}...</div>

          {ownerUser && (
            <>
              <Link href={`/dashboard/${post.slug}`} passHref>
                <h3>
                  <button className="btn-blue">Edit</button>
                </h3>
              </Link>

              {/* {post.published ? (
              <p className="text-success">Live</p>
            ) : (
              <p className="text-danger">Unpublished</p>
            )} */}
            </>
          )}
        </div>
        <div>
          <FlexCenterDiv
            style={{ gap: "4px", justifyContent: "left", marginTop: "10px" }}
          >
            <FlexVerticalCenterDiv>
              <FavoriteIcon /> {post.heartCount}
            </FlexVerticalCenterDiv>
            <FlexVerticalCenterDiv>
              <CommentIcon /> {post.viewCount}
            </FlexVerticalCenterDiv>
          </FlexCenterDiv>
        </div>
      </CardContent>
    </Card>
  )
}

export default PostItem
