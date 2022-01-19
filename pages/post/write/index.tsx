import { useContext } from "react"
import { useForm, Controller } from "react-hook-form"
import { UserContext } from "../../../common/context"
import toast from "react-hot-toast"
import { firestore, auth, serverTimestamp } from "../../../common/firebase"
import dayjs from "dayjs"
import {
  RawPost,
  Post,
  FirestoreTimestamp,
  PostWrite,
} from "../../../typing/interfaces"

// UI imports
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { FlexCenterDiv } from "../../../common/uiComponents"
import ImageUploader from "../../../components/ImageUploader"
import { useRouter } from "next/router"
import { generateExcerpt } from "../../../common/functions"

export default function WritePost() {
  const router = useRouter()
  const { user, username } = useContext(UserContext)

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    // reset, watch
  } = useForm<PostWrite>({
    defaultValues: {
      title: "",
      images: [],
      categories: [],
      content: "",
    },
  })

  console.log("watch", watch())

  const onSubmit = async (data: PostWrite) => {
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
              rows={10}
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
