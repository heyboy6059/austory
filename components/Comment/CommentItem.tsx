import Button from '@mui/material/Button'
import dayjs from 'dayjs'
import { FC } from 'react'
import { COLOURS, KOR_FULL_DATE_FORMAT } from '../../common/constants'
import { FlexSpaceBetweenCenter } from '../../common/uiComponents'
import { Comment } from '../../typing/interfaces'

interface Props {
  comment: Comment
}
const CommentItem: FC<Props> = ({ comment }) => {
  console.log({ comment })
  return (
    <div
      style={{
        borderTop: `1px solid ${COLOURS.LINE_GREY}`,
        paddingTop: '12px',
        margin: '10px 0px'
      }}
    >
      <FlexSpaceBetweenCenter>
        <div style={{ fontWeight: 'bold' }}>{comment.username}</div>
        <small style={{ color: COLOURS.TEXT_GREY }}>
          {dayjs(comment.createdAt).format(KOR_FULL_DATE_FORMAT)}
        </small>
      </FlexSpaceBetweenCenter>
      <div style={{ margin: '8px 0' }}>{comment.content}</div>
      <div>
        <Button style={{ padding: '0px', color: COLOURS.TEXT_GREY }}>
          답글 작성
        </Button>
      </div>
    </div>
  )
}

export default CommentItem
