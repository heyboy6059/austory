import { FC } from 'react'
import { Comment } from '../../typing/interfaces'
import CommentItem from './CommentItem'

interface Props {
  comments: Comment[]
}
const CommentTree: FC<Props> = ({ comments }) => {
  return (
    <div>
      {!comments.length && <div>댓글이 없습니다.</div>}
      {comments.length &&
        comments.map(comment => (
          <CommentItem key={comment.commentId} comment={comment} />
        ))}
    </div>
  )
}

export default CommentTree
