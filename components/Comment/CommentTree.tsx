import { FC, useMemo } from 'react'
import {
  Comment,
  FirebaseCollectionRef,
  CommentWithChildren
} from '../../typing/interfaces'
import CommentItem from './CommentItem'

interface Props {
  comments: Comment[]
  commentCollectionRef: FirebaseCollectionRef
  refetchCommentData: () => Promise<void>
}
const CommentTree: FC<Props> = ({
  comments,
  commentCollectionRef,
  refetchCommentData
}) => {
  const extendedComments: CommentWithChildren[] = useMemo(() => {
    if (comments.length) {
      const commentWithChildren = comments.reduce(
        (acc: CommentWithChildren[], current: Comment) => {
          // no parentCommentId = level 1
          if (!current.parentCommentId) {
            acc.push({ ...current, childComments: [] })
          }
          // yes parentCommentId = level 2
          if (current.parentCommentId) {
            const parentComment = acc.find(
              parent => parent.commentId === current.parentCommentId
            )
            if (parentComment) {
              parentComment.childComments.unshift(current)
            }
          }
          return acc
        },
        []
      )
      return commentWithChildren
    }
  }, [comments])

  return (
    <div>
      {!extendedComments?.length && <div>댓글이 없습니다.</div>}
      {extendedComments?.length &&
        extendedComments.map(comment => (
          <CommentItem
            key={comment.commentId}
            comment={comment}
            commentCollectionRef={commentCollectionRef}
            refetchCommentData={refetchCommentData}
          />
        ))}
    </div>
  )
}

export default CommentTree
