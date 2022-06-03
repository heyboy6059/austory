import { FC, useState, useEffect, useCallback, useContext } from 'react'
import CommentTree from './CommentTree'
import {
  FirebaseDocumentRef,
  RawComment,
  FirebaseDocumentSnapshot,
  Comment,
  Post
} from '../../typing/interfaces'
import { commentToJSON } from '../../common/firebase'
import CommentEditor from './CommentEditor'
import {
  FlexCenterDiv,
  FlexSpaceBetweenCenter
} from '../../common/uiComponents'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { PostContext, UserContext } from '../../common/context'
import { updatePost } from '../../common/update'
import toast from 'react-hot-toast'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { CommentOrder } from '../../typing/enums'

interface Props {
  postRef: FirebaseDocumentRef
}
const CommentMain: FC<Props> = ({ postRef }) => {
  const { user } = useContext(UserContext)

  const { post } = useContext(PostContext)

  const commentCollectionRef = postRef.collection('comments')

  const [comments, setComments] = useState<Comment[]>([])

  const [newCommentNotification, setNewCommentNotification] = useState(false)

  const [commentOrder, setCommentOrder] = useState<CommentOrder>(
    CommentOrder.LATEST
  ) // createdAt desc

  useEffect(() => {
    if (user && post && post.notificationIncludedUids.includes(user.uid)) {
      console.log(`set newCommentNotification to true`)
      setNewCommentNotification(true)
    }
  }, [post, user])

  // REVIEW: move to context?
  const fetchComments = useCallback(async () => {
    console.log('Fetch all comments')
    const allRawComments = await commentCollectionRef
      .orderBy('level', 'asc')
      .orderBy('createdAt', 'desc')
      .get()
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

  const updateNotificationIncludedUids = useCallback(
    async (checked: boolean) => {
      const changes: Partial<Post> = {
        notificationIncludedUids: checked
          ? // add current uid into the list
            // TEMP: deduplicate same ids - due to state issue
            [
              ...Array.from(
                new Set([...post.notificationIncludedUids, user.uid])
              )
            ]
          : // exclude current uid from the list
            post.notificationIncludedUids.filter(uid => uid !== user.uid),
        updatedBy: user.uid
      }

      await updatePost(post.postId, changes)
    },
    [post, user]
  )

  return (
    <div>
      <FlexSpaceBetweenCenter>
        <FlexCenterDiv style={{ gap: '10px' }}>
          <div>{comments.length}개의 댓글</div>
          {comments.length > 1 ? (
            <div>
              <Select
                labelId="comment-order-select-label"
                id="comment-order-select"
                value={commentOrder}
                onChange={(event: SelectChangeEvent) => {
                  const commentOrder = event.target.value as CommentOrder
                  setCommentOrder(commentOrder)
                  setComments(prev => {
                    const levelOne = prev.filter(e => e.level === 1)
                    const levelTwo = prev.filter(e => e.level !== 1)
                    const sortedLevelOne = levelOne.sort((commentA, commentB) =>
                      commentOrder === CommentOrder.LATEST
                        ? commentB.createdAt - commentA.createdAt
                        : commentA.createdAt - commentB.createdAt
                    )
                    return [...sortedLevelOne, ...levelTwo]
                  })
                }}
                size="small"
                style={{ height: '30px' }}
              >
                <MenuItem value={CommentOrder.LATEST} key={1}>
                  최신순
                </MenuItem>
                <MenuItem value={CommentOrder.OLDEST} key={2}>
                  등록순
                </MenuItem>
              </Select>
            </div>
          ) : (
            <></>
          )}
        </FlexCenterDiv>
        <div>
          {
            // only visible when user logged in & when current user is not post owner
            // post owner will receive separated email notification anyway
            user && user.uid !== post.uid && (
              <FormControlLabel
                control={
                  <Switch
                    checked={newCommentNotification}
                    onChange={async (
                      event: React.ChangeEvent<HTMLInputElement>
                    ) => {
                      const checked = event.target.checked
                      try {
                        setNewCommentNotification(checked)
                        await updateNotificationIncludedUids(checked)
                        if (checked) {
                          toast.success(
                            '새 댓글이 달리면 이메일 알림이 전송 됩니다.'
                          )
                        }
                      } catch (err) {
                        console.error(
                          `Error in newCommentNotification Switch. ${err.message}`
                        )
                        toast.error(`에러가 발생했습니다. 다시 시도해주세요.`)
                      }
                    }}
                  />
                }
                label="새 댓글 알림"
              />
            )
          }
        </div>
      </FlexSpaceBetweenCenter>
      <div style={{ margin: '15px 5px' }}>
        <CommentEditor
          commentCollectionRef={commentCollectionRef}
          level={1}
          refetchCommentData={fetchComments}
          createMode={true}
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
