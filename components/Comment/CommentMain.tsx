import { FC, useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import { COMMENT_CONTENT_MAX_COUNT } from '../../common/constants'
import CommentTree from './CommentTree'
import {
  FirebaseDocumentRef,
  RawComment,
  FirebaseDocumentSnapshot,
  Comment
} from '../../typing/interfaces'
import { commentToJSON } from '../../common/firebase'

interface Props {
  postRef: FirebaseDocumentRef
}
const CommentMain: FC<Props> = ({ postRef }) => {
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
        <div>
          {content.length} / {COMMENT_CONTENT_MAX_COUNT}
        </div>
        <CommentTree comments={comments} />
      </div>
    </div>
  )
}

export default CommentMain
