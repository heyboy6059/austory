import { FC, useState, useMemo, useContext, useCallback } from 'react'
import Button from '@mui/material/Button'
import dayjs from 'dayjs'
import { COLOURS, KOR_FULL_DATE_FORMAT } from '../../common/constants'
import {
  FlexSpaceBetweenCenter,
  FlexVerticalCenterDiv,
  GreyText
} from '../../common/uiComponents'
import {
  FirebaseCollectionRef,
  CommentWithChildren
} from '../../typing/interfaces'
import CommentEditor from './CommentEditor'
import { PostContext, UserContext } from '../../common/context'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Tooltip from '@mui/material/Tooltip'
import { firestore } from '../../common/firebase'
import toast from 'react-hot-toast'
import {
  batchUpdateCommentCounts,
  batchUpdateComments
} from '../../common/update'

interface Props {
  comment: CommentWithChildren
  commentCollectionRef: FirebaseCollectionRef
  refetchCommentData: () => Promise<void>
  isChild?: boolean
  isLastChild?: boolean
}
const CommentItem: FC<Props> = ({
  comment,
  commentCollectionRef,
  refetchCommentData,
  isChild = false
}) => {
  const { user, username, isAdmin } = useContext(UserContext)
  const { post } = useContext(PostContext)

  const [commentEditorOpen, setCommentEditorOpen] = useState(false)

  const hasChildComments = useMemo(
    () => comment.childComments?.length,
    [comment]
  )

  const [editMode, setEditMode] = useState(false)

  const removeComment = useCallback(async () => {
    try {
      const confirmRes = confirm('이 댓글을 정말로 지우시겠습니까?')
      // user says NO
      if (!confirmRes) return

      const batch = firestore.batch()
      batchUpdateComments(
        batch,
        commentCollectionRef,
        comment.commentId,
        username,
        {
          deleted: true
        }
      )

      await batchUpdateCommentCounts(
        batch,
        'remove',
        user.uid,
        username,
        post.username,
        post.postId
      )

      await batch.commit()

      await refetchCommentData()
      toast.success('댓글이 삭제 되었습니다.')
    } catch (err) {
      console.error(`Error in removeComment. ErrorMsg: ${err.message}`)
      toast.error(`댓글 삭제에 실패했습니다. 다시 시도해주세요.`)
    }
  }, [comment, commentCollectionRef, post, refetchCommentData, user, username])

  return (
    <>
      <div
        style={{
          borderTop: `1px solid ${COLOURS.LINE_GREY}`,
          paddingTop: '12px',
          margin: '10px 0px',
          marginLeft: `${isChild ? '15px' : '0px'}`
        }}
      >
        {/**
         * Deleted comment
         *  - still displays all children
         *  - don't show add more comments
         */}
        {comment.deleted ? (
          <>
            <GreyText>삭제된 댓글 입니다.</GreyText>
            {hasChildComments ? (
              comment.childComments.map(childComment => (
                <CommentItem
                  key={childComment.commentId}
                  comment={childComment}
                  commentCollectionRef={commentCollectionRef}
                  refetchCommentData={refetchCommentData}
                  isChild={true}
                />
              ))
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            <FlexSpaceBetweenCenter>
              <div style={{ fontWeight: 'bold' }}>{comment.username}</div>

              <FlexVerticalCenterDiv>
                <small style={{ color: COLOURS.TEXT_GREY }}>
                  {dayjs(comment.createdAt).format(KOR_FULL_DATE_FORMAT)}
                </small>

                {
                  // edit/delete button for admin user OR owner of the comment
                  isAdmin || username === comment.createdBy ? (
                    <>
                      <Tooltip title="수정" placement="bottom" arrow>
                        <EditIcon
                          fontSize="small"
                          onClick={() => {
                            setEditMode(true)
                          }}
                          style={{ cursor: 'pointer', color: '#0770bb' }}
                        />
                      </Tooltip>
                      <Tooltip title="삭제" placement="bottom" arrow>
                        <DeleteIcon
                          fontSize="small"
                          style={{ color: '#ff0000', cursor: 'pointer' }}
                          onClick={() => removeComment()}
                        />
                      </Tooltip>
                    </>
                  ) : (
                    <></>
                  )
                }
              </FlexVerticalCenterDiv>
            </FlexSpaceBetweenCenter>
            <CommentEditor
              commentCollectionRef={commentCollectionRef}
              comment={comment}
              level={comment.level}
              refetchCommentData={refetchCommentData}
              viewMode={!editMode}
              editMode={editMode}
              setEditMode={setEditMode}
            />

            {
              // top level comment
              !commentEditorOpen && !isChild && !hasChildComments && (
                <div>
                  <Button
                    style={{
                      padding: '0px',
                      color: COLOURS.TEXT_GREY
                    }}
                    onClick={() => {
                      if (!username) {
                        alert('로그인 후 댓글 작성이 가능 합니다.')
                        // TODO: open login/sign up modal
                        return
                      }
                      setCommentEditorOpen(true)
                    }}
                  >
                    {'답글 작성'}
                  </Button>
                </div>
              )
            }
            {commentEditorOpen && !hasChildComments && (
              <CommentEditor
                commentCollectionRef={commentCollectionRef}
                level={comment.level + 1}
                comment={comment}
                refetchCommentData={refetchCommentData}
                createMode={true}
                createCallback={() => setCommentEditorOpen(false)}
              />
            )}

            {hasChildComments ? (
              <div>
                {comment.childComments.map(childComment => (
                  <CommentItem
                    key={childComment.commentId}
                    comment={childComment}
                    commentCollectionRef={commentCollectionRef}
                    refetchCommentData={refetchCommentData}
                    isChild={true}
                  />
                ))}
                <div>
                  <Button
                    style={{
                      padding: '0px',
                      // marginTop: '6px',
                      color: COLOURS.TEXT_GREY
                    }}
                    onClick={() => {
                      if (!username) {
                        alert('로그인 후 댓글 작성이 가능 합니다.')
                        // TODO: open login/sign up modal
                        return
                      }
                      setCommentEditorOpen(true)
                    }}
                  >
                    추가 답글 작성
                  </Button>
                </div>

                {
                  // comment reply
                  commentEditorOpen && (
                    <CommentEditor
                      commentCollectionRef={commentCollectionRef}
                      level={comment.level + 1}
                      comment={comment}
                      refetchCommentData={refetchCommentData}
                      createMode={true}
                      createCallback={() => setCommentEditorOpen(false)}
                    />
                  )
                }
              </div>
            ) : (
              <div></div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default CommentItem
