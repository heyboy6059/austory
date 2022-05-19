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
import { COLOURS, KOR_FULL_DATE_FORMAT } from '../../common/constants'
import NextImage from 'next/image'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import VisibilityIcon from '@mui/icons-material/Visibility'
import LinkIcon from '@mui/icons-material/Link'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useRouter } from 'next/router'
import {
  FlexCenterDiv,
  FlexSpaceBetween,
  FlexVerticalCenterDiv
  // H2
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
import {
  batchUpdateCategoryCounts,
  batchUpdateUsers,
  batchUpdateViewCounts
} from '../../common/update'
import CommentMain from '../Comment/CommentMain'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import AccountIconName from '../Account/AccountIconName'
import Box from '@mui/material/Box'

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
    () => user && user.uid === post.createdBy,
    [post, user]
  )

  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [addedViewCount, setAddedViewCount] = useState(false)
  const [mainImage, setMainImage] = useState<{
    originalUrl: string
    url: string
    width: number
    height: number
  }>(null)
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

  useEffect(() => {
    // TEMP fallback to original
    const imgUrl =
      post.images?.[0]?.thumbnail600?.url || post.images?.[0]?.original?.url
    if (imgUrl) {
      let width: number
      let height: number
      const img = new Image()
      img.src = imgUrl
      img.onload = function (event) {
        const loadedImage = event.currentTarget as HTMLImageElement
        width = loadedImage.width
        height = loadedImage.height
        console.log('image height: ' + height)
        console.log('image width: ' + width)
        setMainImage({
          originalUrl: post.images?.[0]?.original?.url,
          url: imgUrl,
          width,
          height
        })
      }
    }
  }, [post])

  const removePost = useCallback(async () => {
    const batch = firestore.batch()
    batch.update(postRef, {
      deleted: true,
      updatedBy: user.uid,
      updatedAt: serverTimestamp() as FirestoreTimestamp
    })

    batchUpdateUsers(batch, user.uid, {
      myPostCountTotal: increment(-1)
    })

    const selectedCategories = post.categories
    if (selectedCategories.length) {
      batchUpdateCategoryCounts(batch, selectedCategories, user.uid, {
        postCount: increment(-1)
      })
    }

    await batch.commit()
    toast.success('게시물을 성공적으로 삭제했습니다.')
    router.push('/')
  }, [post, postRef, router, user])
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

  // google adsense
  useEffect(() => {
    try {
      ;(window['adsbygoogle'] = window['adsbygoogle'] || []).push({})
      console.log('useEffect for google adsense')
    } catch (err) {
      console.log(err)
    }
  }, [])

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
          <FlexCenterDiv style={{ gap: '8px' }}>
            <Tooltip title="뒤로가기" placement="bottom" arrow>
              <ArrowBackIcon
                onClick={() =>
                  // window.history.pushState("", "", `/post/abcd`)
                  // router.push("/", undefined, { shallow: true })
                  //REVIEW: go back without reload/refresh/keep scroll

                  {
                    if (post?.isInkrauOfficial === false) {
                      router.push({
                        pathname: '/',
                        query: {
                          postType: 'community'
                        }
                      })
                    } else {
                      router.push('/')
                    }
                  }
                }
                style={{ cursor: 'pointer' }}
              />
            </Tooltip>

            {post.categories.length ? (
              <div>
                {post.categories.map(category => (
                  <Chip
                    key={category.categoryId}
                    label={category.name}
                    variant={'outlined'}
                    size="small"
                    style={{ marginRight: '4px', fontSize: '12px' }}
                  />
                ))}
              </div>
            ) : (
              <></>
            )}
          </FlexCenterDiv>

          <FlexCenterDiv style={{ gap: '5px' }}>
            <Tooltip title="링크 복사" placement="bottom" arrow>
              <LinkIcon
                style={{
                  cursor: 'pointer',
                  fontSize: '26px',
                  transform: 'rotate(135deg)'
                }}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  toast.success('게시물 링크를 복사했습니다.')
                }}
              />
            </Tooltip>
            {(isPostOwner || isAdmin) && (
              <>
                <Tooltip title="수정" placement="bottom" arrow>
                  <EditIcon
                    onClick={() => {
                      router.push(`/post/edit/${post.postId}`)
                    }}
                    style={{
                      cursor: 'pointer',
                      color: COLOURS.DARK_BLUE,
                      fontSize: '25px'
                    }}
                  />
                </Tooltip>
                <Tooltip title="삭제" placement="bottom" arrow>
                  <DeleteIcon
                    style={{
                      color: COLOURS.CANCEL_RED,
                      cursor: 'pointer',
                      fontSize: '24px'
                    }}
                    onClick={() => setDeleteAlertOpen(true)}
                  />
                </Tooltip>
              </>
            )}
            {isAdmin && (
              <FlexCenterDiv style={{ gap: '2px', fontSize: '14px' }}>
                <VisibilityIcon
                  fontSize="small"
                  style={{ color: COLOURS.PRIMARY_SPACE_GREY }}
                />
                <span>{post.viewCount}</span>
              </FlexCenterDiv>
            )}
          </FlexCenterDiv>
        </FlexSpaceBetween>
        <h2 style={{ margin: '10px 0' }}>{post?.title}</h2>
        <span className="text-sm">
          {/* Written by{" "}
        <Link href={`/${post.username}/`}>
          <a className="text-info">@{post.username}</a>
        </Link>{" "}
        on {dayjs(post.createdAt).format(KOR_FULL_DATE_FORMAT)} */}
          {/* <FlexCenterDiv style={{ gap: "2px", alignItems: "center" }}> */}
          <FlexVerticalCenterDiv style={{ gap: '8px', margin: '5px 0' }}>
            {/**
             * coverUsername is for admin purpose only
             * - temporarily cover the username
             */}
            <AccountIconName username={post.coverUsername || post.username} />
            <div>|</div>
            <div>{dayjs(post.createdAt).format(KOR_FULL_DATE_FORMAT)}</div>
          </FlexVerticalCenterDiv>
          {/* </FlexCenterDiv> */}
        </span>
        {mainImage?.url ? (
          <div
            style={{
              width: '100%',
              margin: 'auto',
              marginTop: '15px',
              marginBottom: '15px',
              cursor: 'pointer'
            }}
          >
            <NextImage
              src={mainImage.url}
              alt="main image"
              width={`${mainImage.width}px`}
              height={`${mainImage.height}px`}
              layout="responsive"
              objectFit="contain"
              onClick={() => {
                // open original image in a new tab
                window.open(mainImage.originalUrl, '_blank').focus()
              }}
              priority={true}
            />
          </div>
        ) : (
          <div></div>
        )}
        {/* <ReactMarkdown> */}
        {/* <Linky>
        <div style={{ whiteSpace: "break-spaces" }}>{post?.content}</div>
      </Linky> */}
        <div style={{ margin: '5px 0px', wordBreak: 'break-word' }}>
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
            <div style={{ whiteSpace: 'break-spaces' }}>
              {' '}
              <Typography>{post?.content}</Typography>
            </div>
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

        {/* REVIEW: GOOGLE ADSENSE */}
        <Box style={{ marginTop: '10px', width: '100%' }}>
          <ins
            className="adsbygoogle"
            style={{
              display: 'block',
              textAlign: 'center'
            }}
            data-ad-client="ca-pub-1805879168244149"
            data-ad-slot="3559760421"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </Box>
      </Paper>
    </>
  )
}

export default PostContent
