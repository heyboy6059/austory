import { FC, useState } from 'react'
import Button from '@mui/material/Button'
import dayjs from 'dayjs'
import { COLOURS, KOR_FULL_DATE_FORMAT } from '../../common/constants'
import { FlexSpaceBetweenCenter } from '../../common/uiComponents'
import { Comment, FirebaseCollectionRef } from '../../typing/interfaces'
import CommentEditor from './CommentEditor'

interface Props {
  comment: Comment
  commentCollectionRef: FirebaseCollectionRef
}
const CommentItem: FC<Props> = ({ comment, commentCollectionRef }) => {
  const [commentEditorOpen, setCommentEditorOpen] = useState(false)

  return (
    <div
      style={{
        borderTop: `1px solid ${COLOURS.LINE_GREY}`,
        paddingTop: '12px',
        margin: '10px 0px'
      }}
    >
      <FlexSpaceBetweenCenter>
        <div style={{ fontWeight: 'bold' }}>{comment.username}</div>
        <small style={{ color: COLOURS.TEXT_GREY }}>
          {dayjs(comment.createdAt).format(KOR_FULL_DATE_FORMAT)}
        </small>
      </FlexSpaceBetweenCenter>
      <div style={{ margin: '8px 0' }}>
        ({comment.level}){comment.content}
      </div>
      {!commentEditorOpen && (
        <div>
          <Button
            style={{ padding: '0px', color: COLOURS.TEXT_GREY }}
            onClick={() => setCommentEditorOpen(true)}
          >
            답글 작성
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
    </div>
  )
}

export default CommentItem
