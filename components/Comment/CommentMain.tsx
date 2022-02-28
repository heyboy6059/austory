import { FC, useState, useEffect } from 'react'
import CommentTree from './CommentTree'
import {
  FirebaseDocumentRef,
  RawComment,
  FirebaseDocumentSnapshot,
  Comment
} from '../../typing/interfaces'
import { commentToJSON } from '../../common/firebase'
import CommentEditor from './CommentEditor'

interface Props {
  postRef: FirebaseDocumentRef
}
const CommentMain: FC<Props> = ({ postRef }) => {
  const commentRef = postRef.collection('comments')

  const [comments, setComments] = useState<Comment[]>([])

  useEffect(() => {
    if (commentRef) {
      const getAllComments = async () => {
        const allRawComments = await commentRef.get()
        setComments(
          allRawComments.docs.map(comment =>
            commentToJSON(comment as FirebaseDocumentSnapshot<RawComment>)
          )
        )
      }
      getAllComments()
    }
  }, [commentRef])

  return (
    <div>
      <div>{comments.length}개의 댓글</div>
      <div style={{ margin: '15px 5px' }}>
        <CommentEditor commentRef={commentRef} level={1} />
      </div>
      <CommentTree comments={comments} />
    </div>
  )
}

export default CommentMain
