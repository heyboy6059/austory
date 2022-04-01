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
import { FlexSpaceBetweenCenter } from '../../common/uiComponents'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { PostContext, UserContext } from '../../common/context'
import { updatePost } from '../../common/update'
import toast from 'react-hot-toast'

interface Props {
  postRef: FirebaseDocumentRef
}
const CommentMain: FC<Props> = ({ postRef }) => {
  const { user } = useContext(UserContext)

  const { post } = useContext(PostContext)

  const commentCollectionRef = postRef.collection('comments')

  const [comments, setComments] = useState<Comment[]>([])

  const [newCommentNotification, setNewCommentNotification] = useState(
    user ? post.notificationIncludedUids.includes(user.uid) || false : false
  )

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
            [...post.notificationIncludedUids, user.uid]
          : // exclude current uid from the list
            post.notificationIncludedUids.filter(uid => uid !== user.uid),
        updatedBy: user.uid
      }

      await updatePost(post.slug, changes)
    },
    [post, user]
  )

  return (
    <div>
      <FlexSpaceBetweenCenter>
        <div>{comments.length}개의 댓글</div>
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
