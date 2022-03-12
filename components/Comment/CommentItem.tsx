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
  CommentWithChildren,
  FirestoreTimestamp
} from '../../typing/interfaces'
import CommentEditor from './CommentEditor'
import { UserContext } from '../../common/context'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Tooltip from '@mui/material/Tooltip'
import { serverTimestamp } from '../../common/firebase'

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
  const { username, isAdmin } = useContext(UserContext)

  const [commentEditorOpen, setCommentEditorOpen] = useState(false)
  const noChildComments = useMemo(
    () => comment.childComments?.length,
    [comment]
  )

  const [editMode, setEditMode] = useState(false)

  const removeComment = useCallback(async () => {
    await commentCollectionRef.doc(comment.commentId).update({
      deleted: true,
      updatedBy: username,
      updatedAt: serverTimestamp() as FirestoreTimestamp
    })

    await refetchCommentData()
  }, [comment, commentCollectionRef, refetchCommentData, username])

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
        {comment.deleted ? (
          <GreyText>삭제된 댓글 입니다.</GreyText>
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
                          // fontSize="small"
                          onClick={() => {
                            // // router.push(`/post/edit/${post.slug}`)
                            // alert('hey')
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
            />
            {!commentEditorOpen && !isChild && !noChildComments && (
              <div>
                <Button
                  style={{
                    padding: '0px',
                    color: COLOURS.TEXT_GREY
                  }}
                  onClick={() => setCommentEditorOpen(true)}
                >
                  {'답글 작성'}
                </Button>
              </div>
            )}
            {commentEditorOpen && !noChildComments && (
              <CommentEditor
                commentCollectionRef={commentCollectionRef}
                level={comment.level + 1}
                comment={comment}
                refetchCommentData={refetchCommentData}
                createMode={true}
              />
            )}

            {noChildComments ? (
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
                    onClick={() => setCommentEditorOpen(true)}
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
