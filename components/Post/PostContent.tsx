import {
  FC,
  useContext,
  useMemo,
  useEffect,
  useCallback,
  useState
} from 'react'
import Paper from '@mui/material/Paper'
// import AuthCheck from '../../components/AuthCheck'
// import HeartButton from '../../components/HeartButton'
import {
  Post,
  // FirebaseDocumentRef,
  FirestoreTimestamp
} from '../../typing/interfaces'
import dayjs from 'dayjs'
import { KOR_FULL_DATE_FORMAT } from '../../common/constants'
import Image from 'next/image'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useRouter } from 'next/router'
import {
  FlexCenterDiv,
  FlexSpaceBetween,
  FlexVerticalCenterDiv,
  H1
} from '../../common/uiComponents'
import { PostContext, UserContext } from '../../common/context'
import { firestore, increment, serverTimestamp } from '../../common/firebase'
// import Linky from "react-linky"
import Linkify from 'react-linkify'
import Tooltip from '@mui/material/Tooltip'
import ConfirmDialog from '../../components/Dialog/ConfirmDialog'
import toast from 'react-hot-toast'
import Metatags from '../Metatags'
import Heart from '../Heart'
import { batchUpdateUsers, batchUpdateViewCounts } from '../../common/update'
import CommentMain from '../Comment/CommentMain'

// import { Editor, EditorState, ContentState } from "draft-js"

interface PostContentProps {
  post: Post
  // postRef: FirebaseDocumentRef
}
// UI component for main post content
const PostContent: FC<PostContentProps> = ({
  post
  // postRef
}) => {
  const postRef = firestore.collection('posts').doc(post.postId)
  const { user, username, isAdmin } = useContext(UserContext)
  const router = useRouter()
  const isPostOwner = useMemo(
    () => username === post.username,
    [post, username]
  )

  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [addedViewCount, setAddedViewCount] = useState(false)

  // add viewCount in post
  useEffect(() => {
    const addViewCount = async () => {
      console.log(
        'Added count 1 to Post.viewCount, (current)User.providedViewCountTotal, (post owner)User.receivedViewCountTotal'
      )
      const batch = firestore.batch()
      batch.update(postRef, {
        viewCount: post.viewCount + 1
        // no updatedBy, updatedAt
      })
      batchUpdateViewCounts(batch, user?.uid, post.uid)
      await batch.commit()
    }
    if (postRef && post && user && !addedViewCount) {
      addViewCount()
      setAddedViewCount(true)
    }
  }, [postRef, post, user, addedViewCount])

  const removePost = useCallback(async () => {
    const batch = firestore.batch()
    batch.update(postRef, {
      deleted: true,
      updatedBy: username,
      updatedAt: serverTimestamp() as FirestoreTimestamp
    })

    batchUpdateUsers(batch, user.uid, {
      myPostCountTotal: increment(-1)
    })
    await batch.commit()
    toast.success('게시물을 성공적으로 삭제했습니다.')
    router.push('/')
  }, [postRef, router, user, username])
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
    <>
      <Metatags
        title={`inKRAU - ${post.title}`}
        description={`${post.excerpt}`}
        // TODO: change fallback to logo image
        image={post?.images?.[0]?.original?.url || ''}
      />
      <Paper sx={{ p: 2 }}>
        <FlexSpaceBetween style={{ alignItems: 'center' }}>
          <Tooltip title="뒤로가기" placement="bottom" arrow>
            <ArrowBackIcon
              onClick={() =>
                // window.history.pushState("", "", `/post/abcd`)
                // router.push("/", undefined, { shallow: true })
                //REVIEW: go back without reload/refresh/keep scroll
                router.push('/')
              }
              style={{ cursor: 'pointer' }}
            />
          </Tooltip>

          <FlexCenterDiv style={{ gap: '5px' }}>
            {(isPostOwner || isAdmin) && (
              <>
                <Tooltip title="수정" placement="bottom" arrow>
                  <EditIcon
                    // fontSize="small"
                    onClick={() => {
                      router.push(`/post/edit/${post.postId}`)
                    }}
                    style={{ cursor: 'pointer', color: '#0770bb' }}
                  />
                </Tooltip>
                <Tooltip title="삭제" placement="bottom" arrow>
                  <DeleteIcon
                    fontSize="small"
                    style={{ color: '#ff0000', cursor: 'pointer' }}
                    onClick={() => setDeleteAlertOpen(true)}
                  />
                </Tooltip>
              </>
            )}
            {isAdmin && (
              <FlexCenterDiv style={{ gap: '2px', fontSize: '14px' }}>
                <VisibilityIcon fontSize="small" style={{ color: 'gray' }} />
                <span>{post.viewCount}</span>
              </FlexCenterDiv>
            )}
          </FlexCenterDiv>
        </FlexSpaceBetween>
        <H1>{post?.title}</H1>
        <span className="text-sm">
          {/* Written by{" "}
        <Link href={`/${post.username}/`}>
          <a className="text-info">@{post.username}</a>
        </Link>{" "}
        on {dayjs(post.createdAt).format(KOR_FULL_DATE_FORMAT)} */}
          {/* <FlexCenterDiv style={{ gap: "2px", alignItems: "center" }}> */}
          <FlexVerticalCenterDiv style={{ gap: '8px', margin: '5px 0' }}>
            <div style={{ display: 'flex' }}>
              <AccountBoxIcon style={{ fontSize: '16px' }} />
              <div>{post.username}</div>
            </div>
            <div>|</div>
            <div>{dayjs(post.createdAt).format(KOR_FULL_DATE_FORMAT)}</div>
          </FlexVerticalCenterDiv>
          {/* </FlexCenterDiv> */}
        </span>
        {post.images?.[0]?.thumbnail300?.url ? (
          <div
            style={{
              width: '300px',
              margin: 'auto',
              marginTop: '15px',
              marginBottom: '15px'
            }}
          >
            <Image
              src={post.images[0].thumbnail300.url}
              alt=""
              width={'100%'}
              height={'70%'}
              layout="responsive"
              objectFit="contain"
              onClick={() => {
                // open original image in a new tab
                window.open(post.images[0].original.url, '_blank').focus()
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
        <div style={{ margin: '25px 0px' }}>
          <Linkify
            componentDecorator={(decoratedHref, decoratedText, key) => (
              <a
                target="blank"
                href={decoratedHref}
                key={key}
                style={{ color: '#00008B' }}
              >
                {decoratedText}
              </a>
            )}
          >
            <div style={{ whiteSpace: 'break-spaces' }}>{post?.content}</div>
          </Linkify>
        </div>
        <div
          style={{
            width: '40px',
            margin: 'auto',
            marginTop: '10px',
            marginBottom: '10px'
          }}
        >
          <Heart
            postId={post.postId}
            heartCount={post.heartCount}
            username={username}
          />
        </div>
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
        {/**
         * POST CONTEXT FOR COMMENTS
         */}
        <PostContext.Provider value={{ post }}>
          <CommentMain postRef={postRef} />
        </PostContext.Provider>
        {setDeleteAlertOpen && (
          <ConfirmDialog
            open={deleteAlertOpen}
            setOpen={setDeleteAlertOpen}
            leftLabel="취소"
            rightLabel="삭제"
            leftAction={() => setDeleteAlertOpen(false)}
            rightAction={() => removePost()}
            content="정말로 이 글을 지우시겠습니까?"
          />
        )}
      </Paper>
    </>
  )
}

export default PostContent
