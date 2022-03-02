import { FC, useState, useMemo } from 'react'
import Button from '@mui/material/Button'
import dayjs from 'dayjs'
import { COLOURS, KOR_FULL_DATE_FORMAT } from '../../common/constants'
import { FlexSpaceBetweenCenter } from '../../common/uiComponents'
import {
  FirebaseCollectionRef,
  CommentWithChildren
} from '../../typing/interfaces'
import CommentEditor from './CommentEditor'

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
  const [commentEditorOpen, setCommentEditorOpen] = useState(false)
  const noChildComments = useMemo(
    () => comment.childComments?.length,
    [comment]
  )
  return (
    <div
      style={{
        borderTop: `1px solid ${COLOURS.LINE_GREY}`,
        paddingTop: '12px',
        margin: '10px 0px',
        marginLeft: `${isChild ? '15px' : '0px'}`
      }}
    >
      <FlexSpaceBetweenCenter>
        <div style={{ fontWeight: 'bold' }}>{comment.username}</div>
        <small style={{ color: COLOURS.TEXT_GREY }}>
          {dayjs(comment.createdAt).format(KOR_FULL_DATE_FORMAT)}
        </small>
      </FlexSpaceBetweenCenter>
      <div style={{ margin: '8px 0' }}>{comment.content}</div>
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
          {commentEditorOpen && (
            <CommentEditor
              commentCollectionRef={commentCollectionRef}
              level={comment.level + 1}
              comment={comment}
              refetchCommentData={refetchCommentData}
            />
          )}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default CommentItem
