import { FC, useState } from 'react'
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
  isChild?: boolean
  isLastChild?: boolean
}
const CommentItem: FC<Props> = ({
  comment,
  commentCollectionRef,
  isChild = false,
  isLastChild = false
}) => {
  const [commentEditorOpen, setCommentEditorOpen] = useState(false)
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
      <div style={{ margin: '8px 0' }}>
        ({isChild ? 'Child' : 'Parent'}){comment.content}
      </div>
      {!commentEditorOpen && (!isChild || (isChild && isLastChild)) && (
        <div>
          <Button
            style={{
              padding: '0px',
              marginTop: `${isChild ? '6x' : '0px'}`,
              color: COLOURS.TEXT_GREY
            }}
            onClick={() => setCommentEditorOpen(true)}
          >
            {isChild ? '추가 답글 작성' : '답글 작성'}
          </Button>
        </div>
      )}
      {commentEditorOpen && (
        <CommentEditor
          commentCollectionRef={commentCollectionRef}
          level={comment.level + 1}
          comment={comment}
        />
      )}

      {comment.childComments?.length ? (
        comment.childComments.map((childComment, i) => (
          <CommentItem
            key={childComment.commentId}
            comment={childComment}
            commentCollectionRef={commentCollectionRef}
            isChild={true}
            isLastChild={comment.childComments.length === i + 1}
          />
        ))
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default CommentItem
