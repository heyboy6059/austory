import { FC } from 'react'
import { Comment } from '../../typing/interfaces'

interface Props {
  comments: Comment[]
}
const CommentTree: FC<Props> = ({ comments }) => {
  return (
    <div>
      {!comments.length && <div>댓글이 없습니다.</div>}
      {comments.length && JSON.stringify(comments)}
    </div>
  )
}

export default CommentTree
