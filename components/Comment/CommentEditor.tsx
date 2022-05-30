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
import { FlexSpaceBetweenCenter } from '../../common/uiComponents'
import {
  Comment,
  FirebaseCollectionRef,
  FirestoreTimestamp,
  RawComment,
  Role,
  ROLE_ITEMS_WITH_NULL_LIST
} from '../../typing/interfaces'
import { generateCommentId } from '../../common/idHelper'
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
      setMultiRows(3)
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
            user.uid,
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
          const commentId = generateCommentId(user.email)
          const batch = firestore.batch()
          const newComment: RawComment = {
            commentId,
            username,
            // REVIEW: currently supports up to level 1
            level: level > 1 ? 2 : 1,
            parentCommentId: level === 1 ? null : comment.commentId, // TODO: sub comments
            content,
            coverUsername, // only for admin purpose
            coverRole, // only for admin purpose
            deleted: false,
            adminDeleted: false,
            adminDeletedReason: null,
            createdBy: user.uid,
            createdAt: serverTimestamp() as FirestoreTimestamp,
            createdByRole: user.role,
            updatedBy: null,
            updatedAt: null
          }

          batch.set(commentCollectionRef.doc(commentId), newComment)

          // add count 1 to current user
          batchUpdateUsers(batch, user.uid, {
            providedCommentCountTotal: increment(1)
          })

          const { uid: ownerUserId } = await getUidByUsername(post.username)

          // add count 1 to post owner
          batchUpdateUsers(batch, ownerUserId, {
            receivedCommentCountTotal: increment(1)
          })

          // add count 1 to post
          batchUpdatePosts(batch, post.postId, user.uid, {
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
      post,
      createCallback
    ]
  )

  return (
    <div>
      {
        // viewMode is coming from parent / internalViewMode sets to true after edit the comment
        viewMode || internalViewMode ? (
          <div style={{ margin: '10px 0' }}>{comment.content}</div>
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
            <FlexSpaceBetweenCenter style={{ margin: '6px' }}>
              <div>
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
                  size="small"
                  color="info"
                  variant="outlined"
                  onClick={() => {
                    if (!username) {
                      alert('로그인 후 댓글 작성이 가능 합니다.')
                      // TODO: open login/sign up modal
                      return
                    }
                    createEditComment(content, coverUsername, coverRole)
                  }}
                >
                  등록
                </Button>
              </div>
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
