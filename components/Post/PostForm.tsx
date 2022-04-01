import { FC, useContext } from 'react'
import {
  FirestoreTimestamp,
  Post,
  PostWrite,
  RawPost
} from '../../typing/interfaces'
import { UserContext } from '../../common/context'
import {
  firestore,
  auth,
  serverTimestamp,
  increment
} from '../../common/firebase'
import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'
import dayjs from 'dayjs'
import { generateExcerpt } from '../../common/functions'
import toast from 'react-hot-toast'
import TextField from '@mui/material/TextField'
import ImageUploader from '../ImageUploader'
import { FlexCenterDiv } from '../../common/uiComponents'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { batchUpdateUsers } from '../../common/update'

interface Props {
  editPost?: Post
}
const PostForm: FC<Props> = ({ editPost }) => {
  const router = useRouter()
  const { user, username } = useContext(UserContext)
  const isEditMode = !!editPost

  const {
    handleSubmit,
    control,
    setValue,
    watch
    // reset, watch
  } = useForm<PostWrite>({
    defaultValues: isEditMode
      ? // EDIT
        {
          title: editPost.title,
          images: editPost.images,
          categories: editPost.categories,
          content: editPost.content,
          isTest: editPost.isTest
        }
      : // CREATE
        {
          title: '',
          images: [],
          categories: [],
          content: '',
          isTest: false
        }
  })

  const onSubmit = async (data: PostWrite) => {
    try {
      // EDIT
      if (isEditMode) {
        const docSlug = editPost.slug

        const postRef = firestore.collection('posts').doc(docSlug)
        await postRef.update({
          ...data,
          excerpt: generateExcerpt(data.content, 50),
          updatedAt: serverTimestamp()
        })
        toast.success('게시물 업데이트가 완료 되었습니다.')
      }
      // CREATE
      if (!isEditMode) {
        const docSlug = `${user.email.split('@')[0]}-${dayjs().unix()}`

        const postRef = firestore.collection('posts').doc(docSlug)

        const post: RawPost = {
          slug: docSlug,
          uid: auth.currentUser.uid,
          username,
          title: data.title,
          content: data.content,
          excerpt: generateExcerpt(data.content, 50),
          deleted: false,
          heartCount: 0,
          viewCount: 0,
          commentCount: 0,
          images: data.images,
          categories: [],
          notificationIncludedUids: [],
          createdBy: username,
          createdAt: serverTimestamp() as FirestoreTimestamp,
          updatedBy: null,
          updatedAt: null,
          isTest: data.isTest
        }

        const batch = firestore.batch()
        batch.set(postRef, post)

        batchUpdateUsers(batch, user.uid, {
          myPostCountTotal: increment(1)
        })

        await batch.commit()

        toast.success('게시물이 성공적으로 등록 되었습니다.')
      }

      router.push('/')
    } catch (err) {
      console.error(`Error in PostForm create/edit. ${err.message}`)
      toast.error('에러가 발생했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div
      style={{
        padding: '10px'
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'grid', gap: '10px' }}
      >
        {/**
         * REVIEW: react-hook-form & mui checkbox doesn't work with default value
         */}
        <FormControlLabel
          label={`테스트 게시물 (관리자 전용) - ${watch().isTest}`}
          control={
            <Controller
              name="isTest"
              control={control}
              render={({ field }) => <Checkbox {...field} />}
            />
          }
        />
        <Controller
          name="title"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField label="Title" variant="outlined" {...field} fullWidth />
          )}
        />
        <Controller
          name="content"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              label="Content"
              variant="outlined"
              {...field}
              multiline
              rows={15}
              fullWidth
            />
          )}
        />
        <ImageUploader
          setValue={setValue}
          editThumbnailImgUrl={
            // REVIEW: this only supports single thumbnail url
            isEditMode ? editPost?.images?.[0]?.thumbnail300?.url || '' : null
          }
        />
        <FlexCenterDiv>
          <Button variant="outlined" type="submit">
            완료
          </Button>
        </FlexCenterDiv>
      </form>
    </div>
  )
}

export default PostForm
