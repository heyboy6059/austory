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
    <Card>
      <CardContent sx={{ padding: "16px" }}>
        <div
        // style={{
        //   display: "grid",
        //   gridTemplateColumns: "120px 1fr",
        //   gap: "8px",
        // }}
        >
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "100px 1fr",
                gap: "10px",
              }}
            >
              <Image
                width={100}
                height={100}
                src="https://via.placeholder.com/100x100.png?text=TEST+IMAGE"
                alt="post feed image"
              />
              <div>
                <Link href={`/${post.username}/${post.slug}`} passHref>
                  <h3>
                    <a>{post.title}</a>
                  </h3>
                </Link>
                {/* <div style={{ display: "flex", gap: "8px", fontSize: "12px" }}> */}
                <div style={{ fontSize: "12px" }}>
                  <div>
                    <Link href={`/${post.username}`}>
                      <a>
                        <span>by {post.username}</span>
                      </a>
                    </Link>
                  </div>
                  <div>
                    {/* <span>|</span> */}
                    <span>
                      {dayjs(post.createdAt).format("YYYY/MM/DD h:mm A")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div>{post.content}...</div>

            {/* <footer>
              <span>
                {wordCount} words. {minutesToRead} min read
              </span>
              <span className="push-left">
                💗 {post.heartCount || 0} Hearts
              </span>
            </footer> */}

            {/* If owner user view, show extra controls for user */}
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
            <FlexCenterDiv style={{ gap: "4px" }}>
              <FlexVerticalCenterDiv>
                <FavoriteIcon /> {post.heartCount}
              </FlexVerticalCenterDiv>
              <FlexVerticalCenterDiv>
                <CommentIcon /> {post.viewCount}
              </FlexVerticalCenterDiv>
            </FlexCenterDiv>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PostItem
