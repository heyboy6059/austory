import {
  FC,
  useState,
  useEffect,
  useCallback,
  useContext,
  Dispatch,
  SetStateAction
} from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { COMMENT_CONTENT_MAX_COUNT } from '../../common/constants'
import {
  FlexCenterDiv,
  FlexSpaceBetweenCenter,
  GridDiv
} from '../../common/uiComponents'
import {
  Comment,
  FirebaseCollectionRef,
  FirestoreTimestamp,
  RawComment,
  Role,
  ROLE_ITEMS_WITH_NULL_LIST
} from '../../typing/interfaces'
import { generateCommentId, generateGuestUid } from '../../common/idHelper'
import { firestore, increment, serverTimestamp } from '../../common/firebase'
import { PostContext, UserContext } from '../../common/context'
import toast from 'react-hot-toast'
import {
  batchUpdateComments,
  batchUpdatePosts,
  batchUpdateUsers
} from '../../common/update'
import { getUidByUsername } from '../../common/get'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Linkify from 'react-linkify'
import Typography from '@mui/material/Typography'

interface Props {
  commentCollectionRef: FirebaseCollectionRef
  comment?: Comment
  level: number
  //   createComment?: (content: string, level: number) => void
  editComment?: () => void
  refetchCommentData: () => Promise<void>
  // TODO: mode type = 'view' | 'edit' | 'create'
  viewMode?: boolean
  editMode?: boolean
  setEditMode?: Dispatch<SetStateAction<boolean>>
  createMode?: boolean
  createCallback?: () => void
}
const CommentEditor: FC<Props> = ({
  commentCollectionRef,
  comment,
  level,
  //   createComment,
  editComment,
  refetchCommentData,
  viewMode,
  editMode,
  setEditMode,
  createMode,
  createCallback
}) => {
  // TODO: edit
  comment
  editComment

  const { user, username, isAdmin } = useContext(UserContext)
  const { post } = useContext(PostContext)

  // REVIEW: is this clean?
  const [content, setContent] = useState(
    createMode ? '' : comment?.content || ''
  )
  const [guestNickname, setGuestNickname] = useState(
    createMode ? '' : comment?.guestNickname || ''
  )
  // const [guestPassCode, setGuestPassCode] = useState(
  //   createMode ? '' : comment?.guestPassCode || ''
  // )

  const [coverUsername, setCoverUsername] = useState(
    createMode ? '' : comment?.coverUsername || ''
  )
  const [coverRole, setCoverRole] = useState<Role>(
    createMode ? null : comment?.coverRole || null
  )

  const [initFocus, setInitFocus] = useState(false)
  const [multiRows, setMultiRows] = useState(1)

  // TODO: doesn't look clean code
  const [internalViewMode, setInternalViewMode] = useState(false)

  // TODO: dirty solution?
  useEffect(() => {
    if (internalViewMode && editMode) {
      setInternalViewMode(false)
    }
  }, [editMode, internalViewMode])

  // increase textField rows for initial click
  useEffect(() => {
    if (initFocus || !viewMode) {
      setMultiRows(4)
    }
  }, [initFocus, viewMode])

  // TODO: refactor this callback function
  const createEditComment = useCallback(
    async (content: string, coverUsername: string, coverRole: Role) => {
      try {
        if (!content.length) {
          alert('댓글 입력후 등록을 눌러주세요.')
          return
        }

        if (editMode) {
          console.log('Edit comment')
          const batch = firestore.batch()
          batchUpdateComments(
            batch,
            commentCollectionRef,
            comment.commentId,
            user?.uid || generateGuestUid(guestNickname),
            {
              content,
              coverRole,
              coverUsername // only for admin purpose
            }
          )

          await batch.commit()

          await refetchCommentData()

          // TODO: maybe these are dirty state management
          setInternalViewMode(true)
          setEditMode(false)

          toast.success('댓글이 성공적으로 수정 되었습니다.')
        }

        // create new comment
        // REVIEW: is this check clean?
        if (!editMode || createMode) {
          console.log('Create comment')
          let commentId = ''
          let usernameUid = ''
          let createdBy = ''
          let createdByRole = Role.GUEST
          let updatedBy = ''
          // GUEST
          if (!user) {
            commentId = generateCommentId(guestNickname)
            usernameUid = generateGuestUid(guestNickname)
            createdBy = generateGuestUid(guestNickname)
            updatedBy = generateGuestUid(guestNickname)
            createdByRole = Role.GUEST
          }
          // NORMAL USER
          else {
            commentId = generateCommentId(user.email)
            usernameUid = username
            createdBy = user.uid
            createdByRole = user.role
            updatedBy = user.uid
          }
          const batch = firestore.batch()
          const newComment: RawComment = {
            commentId,
            username: usernameUid,
            // REVIEW: currently supports up to level 1
            level: level > 1 ? 2 : 1,
            parentCommentId: level === 1 ? null : comment.commentId, // TODO: sub comments
            content,
            coverUsername, // only for admin purpose
            coverRole, // only for admin purpose
            guestNickname,
            // guestPassCode,
            deleted: false,
            adminDeleted: false,
            adminDeletedReason: null,
            createdBy,
            createdAt: serverTimestamp() as FirestoreTimestamp,
            createdByRole,
            updatedBy: null,
            updatedAt: null
          }

          batch.set(commentCollectionRef.doc(commentId), newComment)

          // skip for guest
          if (user) {
            // add count 1 to current user
            batchUpdateUsers(batch, user.uid, {
              providedCommentCountTotal: increment(1)
            })

            const { uid: ownerUserId } = await getUidByUsername(post.username)

            // add count 1 to post owner
            batchUpdateUsers(batch, ownerUserId, {
              receivedCommentCountTotal: increment(1)
            })
          }

          // add count 1 to post
          batchUpdatePosts(batch, post.postId, updatedBy, {
            commentCount: increment(1)
          })

          await batch.commit()

          // refetch comment list in CommentMain
          await refetchCommentData()

          createCallback && createCallback()

          // only level 1 => moves scroll to bottom
          // if (level === 1) {
          //   window.scroll({
          //     top: document.body.offsetHeight,
          //     left: 0,
          //     behavior: 'smooth'
          //   })
          // }
          setContent('')
          setCoverUsername('')
          setCoverRole(null)
          setGuestNickname('')
          toast.success('댓글이 성공적으로 등록 되었습니다.')
        }
      } catch (err) {
        console.error(`Error in CommentEditor. ErrorMsg: ${err.message}`)
        toast.error('댓글 등록에 실패하였습니다. 다시 시도해주세요.')
      }
    },
    [
      editMode,
      createMode,
      commentCollectionRef,
      comment,
      user,
      refetchCommentData,
      setEditMode,
      username,
      level,
      guestNickname,
      // guestPassCode,
      post,
      createCallback
    ]
  )

  return (
    <div>
      {
        // viewMode is coming from parent / internalViewMode sets to true after edit the comment
        viewMode || internalViewMode ? (
          <div style={{ margin: '10px 0', wordBreak: 'break-word' }}>
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
                <Typography>{comment.content}</Typography>
              </div>
            </Linkify>
          </div>
        ) : (
          <>
            <TextField
              id="outlined-multiline-flexible"
              label="댓글을 입력해주세요"
              multiline
              fullWidth
              rows={multiRows}
              value={content}
              onChange={e => {
                const value = e.target.value
                // no more length than max count
                if (value && value.length > COMMENT_CONTENT_MAX_COUNT) {
                  return null
                }
                return viewMode ? null : setContent(value)
              }}
              onFocus={() => !initFocus && setInitFocus(true)}
            />

            <FlexSpaceBetweenCenter style={{ margin: '8px 0px' }}>
              {!user ? (
                <GridDiv
                // style={{
                //   gridTemplateColumns: '140px 100px',
                //   gap: '6px',
                //   margin: '8px 0 0 0'
                // }}
                >
                  <TextField
                    id="guest-nickname"
                    label="게스트 닉네임"
                    size="small"
                    value={guestNickname}
                    onChange={e => {
                      const value = e.target.value
                      if (value?.length > 10) return null
                      return viewMode ? null : setGuestNickname(value)
                    }}
                  />
                  {/**
                   * ENABLE THIS FOR EDIT/DELETE GUEST COMMENTS
                   */}
                  {/* <TextField
                  id="guest-passcode"
                  type="password"
                  label="비밀코드"
                  size="small"
                  value={guestPassCode}
                  onChange={e => {
                    const value = e.target.value
                    console.log('passcode', value)
                    if (value?.length > 4) return null
                    return viewMode ? null : setGuestPassCode(value)
                  }}
                /> */}
                </GridDiv>
              ) : (
                <div></div>
              )}
              <FlexCenterDiv style={{ gap: '6px' }}>
                <div
                // style={{ fontSize: '14px', width: '38px' }}
                >
                  <small
                    style={{
                      color:
                        content.length > COMMENT_CONTENT_MAX_COUNT - 1
                          ? 'red'
                          : 'black'
                    }}
                  >
                    {content.length} / {COMMENT_CONTENT_MAX_COUNT}
                  </small>
                </div>
                <div>
                  <Button
                    color="info"
                    variant="outlined"
                    onClick={() => {
                      // if (!username) {
                      //   alert('로그인 후 댓글 작성이 가능 합니다.')
                      //   // TODO: open login/sign up modal
                      //   return
                      // }
                      // if (!content || (!user && !guestNickname)) {
                      //   alert('댓글 내용고')
                      // }
                      if (!content) {
                        alert('댓글 내용이 없습니다.')
                        return
                      }

                      if (!user && !guestNickname) {
                        alert('게스트 닉네임이 없습니다.')
                        return
                      }
                      createEditComment(content, coverUsername, coverRole)
                    }}
                  >
                    등록
                  </Button>
                </div>
              </FlexCenterDiv>
            </FlexSpaceBetweenCenter>
            {isAdmin && (
              <>
                <div>
                  <TextField
                    id="cover-username-text-field"
                    label="커버 닉네임 (관리자 전용)"
                    fullWidth
                    value={coverUsername}
                    onChange={e => {
                      const value = e.target.value
                      return viewMode ? null : setCoverUsername(value)
                    }}
                    helperText="기존 유저들의 닉네임을 피해서 사용하세요. 빈칸으로 두면 원래대로 현재 유저의 닉네임이 사용 됩니다."
                  />
                </div>
                <div style={{ marginTop: '10px' }}>
                  <FormControl fullWidth>
                    <InputLabel id="role-select-label">
                      커버 나는 누구? *
                    </InputLabel>
                    <Select
                      labelId="cover-role-select-label"
                      id="cover-role-select"
                      value={coverRole}
                      label="커버 나는 누구? *"
                      onChange={(event: SelectChangeEvent) => {
                        setCoverRole(event.target.value as Role)
                      }}
                      required
                    >
                      {ROLE_ITEMS_WITH_NULL_LIST.map(roleItem => (
                        <MenuItem value={roleItem.role} key={roleItem.role}>
                          {roleItem.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </>
            )}
          </>
        )
      }
    </div>
  )
}

export default CommentEditor
