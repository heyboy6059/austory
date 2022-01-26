import { FC, useContext, useEffect } from "react"
import {
  FirestoreTimestamp,
  Post,
  PostWrite,
  RawPost,
} from "../../typing/interfaces"
import { UserContext } from "../../common/context"
import { firestore, auth, serverTimestamp } from "../../common/firebase"
import { useRouter } from "next/router"
import { useForm, Controller } from "react-hook-form"
import dayjs from "dayjs"
import { generateExcerpt } from "../../common/functions"
import toast from "react-hot-toast"
import TextField from "@mui/material/TextField"
import ImageUploader from "../ImageUploader"
import { FlexCenterDiv } from "../../common/uiComponents"
import Button from "@mui/material/Button"

interface Props {
  editPost?: Post
}
const PostForm: FC<Props> = ({ editPost }) => {
  const router = useRouter()
  const { user, username } = useContext(UserContext)
  const isEditMode = !!editPost
  console.log({ isEditMode })

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    // reset, watch
  } = useForm<PostWrite>({
    defaultValues: isEditMode
      ? // EDIT
        {
          title: editPost.title,
          images: editPost.images,
          categories: editPost.categories,
          content: editPost.content,
        }
      : // CREATE
        {
          title: "",
          images: [],
          categories: [],
          content: "",
        },
  })

  console.log("watch", watch())

  const onSubmit = async (data: PostWrite) => {
    // EDIT
    if (isEditMode) {
      const docSlug = editPost.slug
      const postRef = firestore.collection("posts").doc(docSlug)
      await postRef.update({
        ...data,
        updatedAt: serverTimestamp(),
      })
      toast.success("Post updated!")
    }
    // CREATE
    if (!isEditMode) {
      const docSlug = `${user.email.split("@")[0]}-${dayjs().unix()}`
      const ref = firestore.collection("posts").doc(docSlug)

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
        images: data.images,
        categories: [],
        createdAt: serverTimestamp() as FirestoreTimestamp,
        updatedAt: serverTimestamp() as FirestoreTimestamp,
      }

      await ref.set(post)

      toast.success("Post created!")
    }

    router.push("/")
  }

  return (
    <div
      style={{
        padding: "10px",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "grid", gap: "10px" }}
      >
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
        <ImageUploader setValue={setValue} />
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
