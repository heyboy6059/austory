import { FC, useContext, useMemo, useEffect } from "react"
import Link from "next/link"
import Paper from "@mui/material/Paper"
import AuthCheck from "../../components/AuthCheck"
import HeartButton from "../../components/HeartButton"
import { Post, FirebaseDocumentRef } from "../../typing/interfaces"
import dayjs from "dayjs"
import { COLOURS, KOR_FULL_DATE_FORMAT } from "../../common/constants"
import Image from "next/image"
import AccountBoxIcon from "@mui/icons-material/AccountBox"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import Button from "@mui/material/Button"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { useRouter } from "next/router"
import {
  FlexCenterDiv,
  FlexSpaceBetween,
  FlexVerticalCenterDiv,
  H1,
} from "../../common/uiComponents"
import { UserContext } from "../../common/context"
import { firestore } from "../../common/firebase"
// import Linky from "react-linky"
import Linkify from "react-linkify"

// import { Editor, EditorState, ContentState } from "draft-js"

interface PostContentProps {
  post: Post
  postRef: FirebaseDocumentRef
}
// UI component for main post content
const PostContent: FC<PostContentProps> = ({ post, postRef }) => {
  const { username } = useContext(UserContext)
  const router = useRouter()
  const isPostOwner = useMemo(
    () => username === post.username,
    [post, username]
  )

  // add viewCount in post
  useEffect(() => {
    const addViewCount = async () => {
      const ref = firestore.collection("posts").doc(post.slug)
      await ref.update({
        viewCount: post.viewCount + 1,
      })
    }
    addViewCount()
  }, [])
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
      <FlexSpaceBetween style={{ alignItems: "center" }}>
        <ArrowBackIcon
          onClick={() =>
            // window.history.pushState("", "", `/post/abcd`)
            // router.push("/", undefined, { shallow: true })
            //REVIEW: go back without reload/refresh/keep scroll
            router.push("/")
          }
        />
        {isPostOwner && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              router.push(`/post/edit/${post.slug}`)
            }}
          >
            EDIT
          </Button>
        )}
      </FlexSpaceBetween>
      <H1>{post?.title}</H1>
      <span className="text-sm">
        {/* Written by{" "}
        <Link href={`/${post.username}/`}>
          <a className="text-info">@{post.username}</a>
        </Link>{" "}
        on {dayjs(post.createdAt).format(KOR_FULL_DATE_FORMAT)} */}
        {/* <FlexCenterDiv style={{ gap: "2px", alignItems: "center" }}> */}
        <FlexVerticalCenterDiv style={{ gap: "8px", margin: "5px 0" }}>
          <div style={{ display: "flex" }}>
            <AccountBoxIcon style={{ fontSize: "16px" }} />
            <div>{post.username}</div>
          </div>
          <div>|</div>
          <div>{dayjs(post.createdAt).format(KOR_FULL_DATE_FORMAT)}</div>
          <div>|</div>
          <FlexCenterDiv style={{ gap: "2px" }}>
            <VisibilityIcon fontSize="small" style={{ color: "gray" }} />
            <span>{post.viewCount}</span>
          </FlexCenterDiv>
        </FlexVerticalCenterDiv>
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
      {/* <ReactMarkdown> */}
      {/* <Linky>
        <div style={{ whiteSpace: "break-spaces" }}>{post?.content}</div>
      </Linky> */}
      <Linkify
        componentDecorator={(decoratedHref, decoratedText, key) => (
          <a
            target="blank"
            href={decoratedHref}
            key={key}
            style={{ color: "#00008B" }}
          >
            {decoratedText}
          </a>
        )}
      >
        <div style={{ whiteSpace: "break-spaces" }}>{post?.content}</div>
      </Linkify>
      {/* <TextWithLink text={post?.content} /> */}
      {/* </ReactMarkdown> */}
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
