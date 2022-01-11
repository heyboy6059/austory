import { auth, storage, STATE_CHANGED } from "../common/firebase"
import { IMAGE_THUMBNAIL_PREFIX, IMAGE_ORIGINAL_PREFIX } from "./constants"

export const uploadImageToStorage = async (
  type: "thumbnail" | "original",
  blob: Blob,
  ext: string
): Promise<{ imgUrl: string }> => {
  const ref = storage.ref(
    `uploads/${auth.currentUser.uid}/${
      type === "thumbnail" ? IMAGE_THUMBNAIL_PREFIX : IMAGE_ORIGINAL_PREFIX
    }${Date.now()}.${ext}`
  )

  const task = await ref.put(blob)

  const imgUrl = await task.ref.getDownloadURL()

  return { imgUrl }
  // PROGRESS
  // task.on(STATE_CHANGED, (snapshot) => {
  //   const pct = (
  //     (snapshot.bytesTransferred / snapshot.totalBytes) *
  //     100
  //   ).toFixed(0)
  //   setProgress(Number(pct))
}
