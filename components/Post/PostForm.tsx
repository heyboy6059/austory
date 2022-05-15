import { FC, useContext, useState, useEffect, useMemo } from 'react'
import {
  Category,
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
import { generateExcerpt } from '../../common/functions'
import toast from 'react-hot-toast'
import TextField from '@mui/material/TextField'
import ImageUploader from '../ImageUploader'
import { FlexCenterDiv } from '../../common/uiComponents'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import {
  batchUpdateCategoryCounts,
  batchUpdateUsers
} from '../../common/update'
import { generatePostDocumentId } from '../../common/idHelper'
import Stack from '@mui/material/Stack'
import {
  HorizontalScrollContainer,
  HorizontalScrollItem
} from 'react-simple-horizontal-scroller'
import Box from '@mui/material/Box'
import { getAllCategories } from '../../common/get'
import { Chip, Paper, Skeleton } from '@mui/material'

type ExtendedCategory = Category & {
  selected: boolean
}

interface Props {
  editPost?: Post
}
const PostForm: FC<Props> = ({ editPost }) => {
  const router = useRouter()
  const { isAdmin, user, username } = useContext(UserContext)
  const isEditMode = !!editPost
  const [categories, setCategories] = useState<ExtendedCategory[]>([])
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)

  // getAllCategories + pre select categories from editPost
  useEffect(() => {
    setCategoryLoading(true)
    getAllCategories()
      .then(categories => {
        console.log('getAllCategories...')
        // EDIT
        if (isEditMode) {
          // selected true from categories in edit post
          setCategories(
            categories.map(c => {
              const match = editPost.categories.find(
                editCat => editCat.categoryId === c.categoryId
              )
              return { ...c, selected: match ? true : false }
            })
          )
        }
        // CREATE
        else {
          setCategories(categories.map(c => ({ ...c, selected: false })))
        }
        setCategoryLoading(false)
      })
      .catch(err => {
        console.error(`Error in getAllCategories. ERROR: ${err}`)
        setCategoryLoading(false)
      })
  }, [editPost, isEditMode])

  const noCategorySelect = useMemo(
    () => categories.every(c => !c.selected),
    [categories]
  )

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
          isTest: editPost.isTest,
          coverUsername: editPost.coverUsername
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
      const selectedCategories = categories.filter(e => e.selected)

      // EDIT
      if (isEditMode) {
        const batch = firestore.batch()

        const postId = editPost.postId

        const postRef = firestore.collection('posts').doc(postId)

        batch.update(postRef, {
          ...data,
          categories: selectedCategories.map(category => ({
            categoryId: category.categoryId,
            name: category.name
          })),
          excerpt: generateExcerpt(data.content, 150),
          updatedBy: user.uid,
          updatedAt: serverTimestamp()
        })

        // increase counts for newly selected categories
        const newlySelectedCategories = categories.filter(
          c =>
            c.selected &&
            !editPost.categories.find(cat => cat.categoryId === c.categoryId)
        )
        if (newlySelectedCategories.length) {
          batchUpdateCategoryCounts(batch, newlySelectedCategories, user.uid, {
            postCount: increment(1)
          })
        }

        // decrease counts for newly unselected categories
        const newlyUnselectedCategories = categories.filter(
          c =>
            !c.selected &&
            editPost.categories.find(cat => cat.categoryId === c.categoryId)
        )
        if (newlyUnselectedCategories.length) {
          batchUpdateCategoryCounts(
            batch,
            newlyUnselectedCategories,
            user.uid,
            {
              postCount: increment(-1)
            }
          )
        }

        await batch.commit()

        toast.success('게시물 업데이트가 완료 되었습니다.')

        router.push(`/post/${postId}`)
      }
      // CREATE
      if (!isEditMode) {
        const postId = generatePostDocumentId(user.email)

        const postRef = firestore.collection('posts').doc(postId)

        const post: RawPost = {
          postId,
          uid: auth.currentUser.uid,
          coverUsername: data.coverUsername || '',
          username,
          title: data.title,
          content: data.content,
          excerpt: generateExcerpt(data.content, 150),
          deleted: false,
          heartCount: 0,
          viewCount: 0,
          commentCount: 0,
          images: data.images,
          categories: selectedCategories.map(category => ({
            categoryId: category.categoryId,
            name: category.name
          })),
          notificationIncludedUids: [],
          createdBy: user.uid,
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

        // add category counts
        if (selectedCategories.length) {
          batchUpdateCategoryCounts(batch, selectedCategories, user.uid, {
            postCount: increment(1)
          })
        }

        await batch.commit()

        toast.success('게시물이 성공적으로 등록 되었습니다.')
        router.push('/')
      }
    } catch (err) {
      console.error(`Error in PostForm create/edit. ${err.message}`)
      toast.error('에러가 발생했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <Paper sx={{ p: 2, mt: 1 }}>
      {/**
       * DEV ONLY - easy category creation
       */}
      {/* <button
        onClick={async () => {
          const tempObj: RawCategory = {
            categoryId: 'category-wa',
            name: 'WA',
            postCount: 0,
            sort: 1300,
            adminOnly: false,
            disabled: false,
            createdAt: serverTimestamp() as FirestoreTimestamp
          }
          await firestore
            .collection('categories')
            .doc(tempObj.categoryId)
            .set(tempObj)
          console.log('done')
        }}
      >
        CREATE (DEV ONLY)
      </button> */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'grid', gap: '10px', width: '100%' }}
      >
        {/**
         * REVIEW: react-hook-form & mui checkbox doesn't work with default value
         */}
        {isAdmin && (
          <>
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
            {/* <FormControlLabel
              label={`커버 닉네임 (관리자 전용)`}
              control={
                <Controller
                  name="coverUsername"
                  control={control}
                  render={({ field }) => <Checkbox {...field} />}
                />
              }
            /> */}
            <Controller
              name="coverUsername"
              control={control}
              rules={{ required: false }}
              render={({ field }) => (
                <TextField
                  label="커버 닉네임(관리자 전용)"
                  variant="outlined"
                  {...field}
                  fullWidth
                  helperText="기존 유저들의 닉네임을 피해서 사용하세요. 빈칸으로 두면 원래대로 현재 유저의 닉네임이 사용 됩니다."
                />
              )}
            />
          </>
        )}
        <Stack spacing={2} style={{ marginTop: '5px' }} sx={{ width: '100%' }}>
          {categoryLoading ? (
            <Skeleton width="100%" height={32} />
          ) : (
            <Box
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '60px 1fr'
              }}
            >
              <Chip
                label={'없음'}
                color="info"
                variant={noCategorySelect ? 'filled' : 'outlined'}
                onClick={() =>
                  // all selected false
                  setCategories(prev =>
                    prev.map(cat => ({ ...cat, selected: false }))
                  )
                }
              />

              {/* <FlexCenterDiv></FlexCenterDiv> */}
              <HorizontalScrollContainer>
                {categories.map(category => {
                  return (
                    <HorizontalScrollItem
                      id={category.categoryId}
                      key={category.categoryId}
                      // toggle selected
                      onClick={() => {
                        const selectedList = categories.filter(
                          cat => cat.selected
                        )
                        // no more than 3 categories
                        if (selectedList.length > 2) {
                          const matched = selectedList.find(
                            c => c.categoryId === category.categoryId
                          )
                          // enable toggle only when making true -> false
                          if (!matched || (matched && !matched.selected)) {
                            return
                          }
                        }
                        return setCategories(prev =>
                          prev.map(cat =>
                            cat.categoryId === category.categoryId
                              ? { ...cat, selected: !cat.selected }
                              : cat
                          )
                        )
                      }}
                    >
                      <Chip
                        label={category.name}
                        style={{ margin: '0 5px', cursor: 'pointer' }}
                        variant={category.selected ? 'filled' : 'outlined'}
                        color="primary"
                      />
                    </HorizontalScrollItem>
                  )
                })}
              </HorizontalScrollContainer>
            </Box>
          )}
          <Controller
            name="title"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField label="제목" variant="outlined" {...field} fullWidth />
            )}
          />
          <Controller
            name="content"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                label="내용"
                variant="outlined"
                {...field}
                multiline
                rows={15}
                fullWidth
              />
            )}
          />
        </Stack>
        <ImageUploader
          setValue={setValue}
          setImageLoading={setImageLoading}
          editThumbnailImgUrl={
            // REVIEW: this only supports single thumbnail url
            isEditMode ? editPost?.images?.[0]?.thumbnail600?.url || '' : null
          }
        />
        <FlexCenterDiv>
          <Button
            variant="outlined"
            type="submit"
            disabled={imageLoading || !watch().content || !watch().title}
            style={{ marginBottom: '5px' }}
          >
            완료
          </Button>
        </FlexCenterDiv>
      </form>
    </Paper>
  )
}

export default PostForm
