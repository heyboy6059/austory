import { FC, useState, useEffect, useCallback, useContext } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { COMMENT_CONTENT_MAX_COUNT } from '../../common/constants'
import { FlexSpaceBetweenCenter } from '../../common/uiComponents'
import {
  Comment,
  FirebaseCollectionRef,
  FirestoreTimestamp,
  RawComment
} from '../../typing/interfaces'
import { generateCommentId } from '../../common/idHelper'
import { firestore, serverTimestamp } from '../../common/firebase'
import { UserContext } from '../../common/context'
import toast from 'react-hot-toast'

interface Props {
  commentCollectionRef: FirebaseCollectionRef
  comment?: Comment
  level: number
  //   createComment?: (content: string, level: number) => void
  editComment?: () => void
}
const CommentEditor: FC<Props> = ({
  commentCollectionRef,
  comment,
  level,
  //   createComment,
  editComment
}) => {
  // TODO: edit
  comment
  editComment

  const { username } = useContext(UserContext)

  const [content, setContent] = useState('')
  const [initFocus, setInitFocus] = useState(false)
  const [multiRows, setMultiRows] = useState(1)

  // increase textField rows for initial click
  useEffect(() => {
    if (initFocus) {
      setMultiRows(3)
    }
  }, [initFocus])

  const createComment = useCallback(
    async (content: string) => {
      try {
        if (!content.length) {
          alert('댓글 입력후 등록을 눌러주세요.')
          return
        }

        const commentId = generateCommentId(username)
        const batch = firestore.batch()
        const newComment: RawComment = {
          commentId,
          username,
          level,
          parentCommentId: level === 1 ? null : comment.commentId, // TODO: sub comments
          content,
          deleted: false,
          adminDeleted: false,
          adminDeletedReason: null,
          createdBy: username,
          createdAt: serverTimestamp() as FirestoreTimestamp,
          updatedBy: null,
          updatedAt: null
        }

        batch.set(commentCollectionRef.doc(commentId), newComment)

        // TODO: add counts in post / user
        // batchUpdateUsers()

        await batch.commit()

        // TODO: only level 1 -> scroll to bottom
        window.scroll({
          top: document.body.offsetHeight,
          left: 0,
          behavior: 'smooth'
        })
        setContent('')
        toast.success('댓글이 성공적으로 등록 되었습니다.')
      } catch (err) {
        console.error(`Error in CommentEditor. ErrorMsg: ${err.message}`)
        toast.error('댓글 등록에 실패하였습니다. 다시 시도해주세요.')
      }
    },
    [comment, commentCollectionRef, level, username]
  )
  return (
    <div>
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
      <FlexSpaceBetweenCenter style={{ margin: '6px' }}>
        <div>
          <small>
            {content.length} / {COMMENT_CONTENT_MAX_COUNT}
          </small>
        </div>
        <div>
          <Button
            size="small"
            color="info"
            variant="outlined"
            onClick={() => createComment(content)}
          >
            등록
          </Button>
        </div>
      </FlexSpaceBetweenCenter>
    </div>
  )
}

export default CommentEditor
