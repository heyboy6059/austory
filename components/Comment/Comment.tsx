import { FC, useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import { COMMENT_CONTENT_MAX_COUNT } from '../../common/constants'

const Comment: FC = () => {
  const [content, setContent] = useState('')
  const [initFocus, setInitFocus] = useState(false)
  const [multiRows, setMultiRows] = useState(1)

  // increase textField rows for initial click
  useEffect(() => {
    if (initFocus) {
      setMultiRows(3)
    }
  }, [initFocus])

  return (
    <div>
      <div>3개의 댓글</div>
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
        {/* </FormControl> */}
      </div>
    </div>
  )
}

export default Comment
