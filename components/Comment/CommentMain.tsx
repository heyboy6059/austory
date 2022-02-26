import { FC, useState, useEffect, useCallback, useContext } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { COMMENT_CONTENT_MAX_COUNT } from '../../common/constants'
import CommentTree from './CommentTree'
import {
  FirebaseDocumentRef,
  RawComment,
  FirebaseDocumentSnapshot,
  Comment,
  FirestoreTimestamp
} from '../../typing/interfaces'
import {
  commentToJSON,
  firestore,
  serverTimestamp
} from '../../common/firebase'
import { FlexSpaceBetween } from '../../common/uiComponents'
import { generateCommentId } from '../../common/idHelper'
import { UserContext } from '../../common/context'

interface Props {
  postRef: FirebaseDocumentRef
}
const CommentMain: FC<Props> = ({ postRef }) => {
  const { username } = useContext(UserContext)
  const [content, setContent] = useState('')
  const [initFocus, setInitFocus] = useState(false)
  const [multiRows, setMultiRows] = useState(1)

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

  // increase textField rows for initial click
  useEffect(() => {
    if (initFocus) {
      setMultiRows(3)
    }
  }, [initFocus])

  const createComment = useCallback(async () => {
    if (!content.length) {
      alert('댓글 입력후 등록을 눌러주세요.')
    }

    const commentId = generateCommentId(username)
    const batch = firestore.batch()
    const comment: RawComment = {
      commentId,
      username,
      level: 1, // TODO: sub comments
      parentCommentId: null, // TODO: sub comments
      content,
      deleted: false,
      adminDeleted: false,
      adminDeletedReason: null,
      createdBy: username,
      createdAt: serverTimestamp() as FirestoreTimestamp,
      updatedBy: null,
      updatedAt: null
    }

    batch.set(commentRef.doc(commentId), comment)

    // TODO: add counts in post / user
    await batch.commit()
  }, [commentRef, content, username])
  return (
    <div>
      <div>{comments.length}개의 댓글</div>
      <div style={{ margin: '15px' }}>
        {/* <FormControl style={{ width: '100%' }}> */}
        <TextField
          id="outlined-multiline-flexible"
          label="댓글을 입력해주세요"
          multiline
          fullWidth
          rows={multiRows}
          value={content}
          onChange={e => setContent(e.target.value)}
          onFocus={() => !initFocus && setInitFocus(true)}
        />
        <FlexSpaceBetween style={{ alignItems: 'center' }}>
          <div>
            {content.length} / {COMMENT_CONTENT_MAX_COUNT}
          </div>
          <div>
            <Button
              size="small"
              color="info"
              variant="outlined"
              onClick={() => createComment()}
            >
              등록
            </Button>
          </div>
        </FlexSpaceBetween>
        <CommentTree comments={comments} />
      </div>
    </div>
  )
}

export default CommentMain
