import { FC, useMemo } from 'react'
import { Comment, FirebaseCollectionRef } from '../../typing/interfaces'
import CommentItem from './CommentItem'

interface CommentWithChildren extends Comment {
  childComments?: CommentWithChildren[]
}
interface Props {
  comments: Comment[]
  commentCollectionRef: FirebaseCollectionRef
}
const CommentTree: FC<Props> = ({ comments, commentCollectionRef }) => {
  // console.log({ comments })
  // console.log('hit!')

  // TODO: complete extendedComments with childrenTree
  // const extendedComments: CommentWithChildren[] = useMemo(() => {
  //   if (comments.length) {
  //     const commentWithChildren = comments.reduce(
  //       (acc: CommentWithChildren[], current: Comment) => {
  //         // if(acc.find(e => e.))
  //         acc.push(current)
  //         return acc
  //       },
  //       []
  //     )
  //     console.log({ commentWithChildren })
  //     return comments
  //   }
  // }, [comments])

  // console.log({ extendedComments })
  return (
    <div>
      {!comments.length && <div>댓글이 없습니다.</div>}
      {comments.length &&
        comments.map(comment => (
          <CommentItem
            key={comment.commentId}
            comment={comment}
            commentCollectionRef={commentCollectionRef}
          />
        ))}
    </div>
  )
}

export default CommentTree
