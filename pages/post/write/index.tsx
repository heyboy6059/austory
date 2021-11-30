import { useContext } from "react"
import { useForm, Controller } from "react-hook-form"
import { UserContext } from "../../../common/context"
import toast from "react-hot-toast"
import { firestore, auth, serverTimestamp } from "../../../common/firebase"
import dayjs from "dayjs"
import { RawPost, Post, FirestoreTimestamp } from "../../../typing/interfaces"

// UI imports
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { FlexCenterDiv } from "../../../common/uiComponents"

type PostWrite = Pick<Post, "title" | "content">

export default function PostWrite() {
  const { user, username } = useContext(UserContext)

  const {
    handleSubmit,
    control,
    // reset, watch
  } = useForm<PostWrite>({
    defaultValues: {
      title: "",
      // tags: [],
      // imgUrls: [],
      content: "",
    },
  })

  const onSubmit = async (data: PostWrite) => {
    const docSlug = `${user.email.split("@")[0]}-${dayjs().unix()}`
    const ref = firestore.collection("posts").doc(docSlug)

    const post: RawPost = {
      slug: docSlug,
      uid: auth.currentUser.uid,
      username,
      title: data.title,
      content: data.content,
      deleted: false,
      heartCount: 0,
      viewCount: 0,
      imgSrc: "",
      createdAt: serverTimestamp() as FirestoreTimestamp,
      updatedAt: serverTimestamp() as FirestoreTimestamp,
    }

    await ref.set(post)

    toast.success("Post created!")
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
        <div>Title</div>
        <Controller
          name="title"
          control={control}
          rules={{ required: true }}
          render={({ field }) => <TextField {...field} fullWidth />}
        />
        <div>Content</div>
        <Controller
          name="content"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField {...field} multiline rows={10} fullWidth />
          )}
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
