import { FC, useState } from "react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import Paper from "@mui/material/Paper"
import AuthCheck from "../../components/AuthCheck"
import HeartButton from "../../components/HeartButton"
import { Post, FirebaseDocumentRef } from "../../typing/interfaces"
import dayjs from "dayjs"
import { KOR_FULL_DATE_FORMAT } from "../../common/constants"
import Image from "next/image"
import AccountBoxIcon from "@mui/icons-material/AccountBox"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useRouter } from "next/router"

// import { Editor, EditorState, ContentState } from "draft-js"

interface PostContentProps {
  post: Post
  postRef: FirebaseDocumentRef
}
// UI component for main post content
const PostContent: FC<PostContentProps> = ({ post, postRef }) => {
  const router = useRouter()
  // const [editorState, setEditorState] = useState(
  //   EditorState.createWithContent(
  //     ContentState.createFromBlockArray("<h1>HAHAHOHO</h1>")
  //   )
  // )

  // const editorState =
  // const contentState = ContentState.createFromText('<h1>HAHAHOHO</h1>')

  // contentState.
  // const editor = useRef(null)

  // function focusEditor() {
  //   editor.current.focus()
  // }

  return (
    <Paper sx={{ p: 2 }}>
      <div>
        <ArrowBackIcon
          onClick={() =>
            // window.history.pushState("", "", `/post/abcd`)
            // router.push("/", undefined, { shallow: true })
            //REVIEW: go back without reload/refresh/keep scroll
            router.push("/")
          }
        />
      </div>
      <h1>{post?.title}</h1>
      <span className="text-sm">
        {/* Written by{" "}
        <Link href={`/${post.username}/`}>
          <a className="text-info">@{post.username}</a>
        </Link>{" "}
        on {dayjs(post.createdAt).format(KOR_FULL_DATE_FORMAT)} */}
        {/* <FlexCenterDiv style={{ gap: "2px", alignItems: "center" }}> */}
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ display: "flex" }}>
            <AccountBoxIcon style={{ fontSize: "16px" }} />
            <div>{post.username}</div>
          </div>
          <div>|</div>
          <div>{dayjs(post.createdAt).format(KOR_FULL_DATE_FORMAT)}</div>
        </div>
        {/* </FlexCenterDiv> */}
      </span>
      {post.images?.[0]?.thumbnail300?.url ? (
        <div style={{ width: "300px", margin: "auto" }}>
          <Image
            src={post.images[0].thumbnail300.url}
            alt=""
            width={"100%"}
            height={"70%"}
            layout="responsive"
            objectFit="contain"
            onClick={() => {
              // open original image in a new tab
              window.open(post.images[0].original.url, "_blank").focus()
            }}
          />
        </div>
      ) : (
        <div></div>
      )}
      <ReactMarkdown>{post?.content}</ReactMarkdown>
      {/* <Editor
        editorState={editorState}
        onChange={(editorState) => setEditorState(editorState)}
      /> */}
      <div>
        {/* <AuthCheck
          fallback={
            <Link href="/enter" passHref>
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} heartCount={post.heartCount} />
        </AuthCheck> */}
      </div>
    </Paper>
  )
}

export default PostContent
