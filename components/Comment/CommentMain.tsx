import { FC, useState, useEffect, useCallback } from 'react'
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
  const commentCollectionRef = postRef.collection('comments')

  console.log('Comment Main')
  const [comments, setComments] = useState<Comment[]>([])

  console.log({ comments })
  // REVIEW: move to context?
  const fetchComments = useCallback(async () => {
    const allRawComments = await commentCollectionRef.get()
    setComments(
      allRawComments.docs.map(comment =>
        commentToJSON(comment as FirebaseDocumentSnapshot<RawComment>)
      )
    )
  }, [commentCollectionRef])

  useEffect(() => {
    fetchComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div>{comments.length}개의 댓글</div>
      <div style={{ margin: '15px 5px' }}>
        <CommentEditor
          commentCollectionRef={commentCollectionRef}
          level={1}
          refetchCommentData={fetchComments}
        />
      </div>
      <CommentTree
        comments={comments}
        commentCollectionRef={commentCollectionRef}
        refetchCommentData={fetchComments}
      />
    </div>
  )
}

export default CommentMain
