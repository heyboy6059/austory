import { FC, useState } from "react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import Paper from "@mui/material/Paper"
import AuthCheck from "../../components/AuthCheck"
import HeartButton from "../../components/HeartButton"
import { Post, FirebaseDocumentRef } from "../../typing/interfaces"
import dayjs from "dayjs"
import { KOR_FULL_DATE_FORMAT } from "../../common/constants"

// import { Editor, EditorState, ContentState } from "draft-js"

interface PostContentProps {
  post: Post
  postRef: FirebaseDocumentRef
}
// UI component for main post content
const PostContent: FC<PostContentProps> = ({ post, postRef }) => {
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
      <h1>{post?.title}</h1>
      <span className="text-sm">
        Written by{" "}
        <Link href={`/${post.username}/`}>
          <a className="text-info">@{post.username}</a>
        </Link>{" "}
        on {dayjs(post.createdAt).format(KOR_FULL_DATE_FORMAT)}
      </span>
      <ReactMarkdown>{post?.content}</ReactMarkdown>
      {/* <Editor
        editorState={editorState}
        onChange={(editorState) => setEditorState(editorState)}
      /> */}
      <div>
        <AuthCheck
          fallback={
            <Link href="/enter" passHref>
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} heartCount={post.heartCount} />
        </AuthCheck>
      </div>
    </Paper>
  )
}

export default PostContent
