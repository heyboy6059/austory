import { auth, storage, STATE_CHANGED } from "../common/firebase"
import { ImgType } from "../typing/interfaces"
import {
  IMAGE_THUMBNAIL_PREFIX,
  IMAGE_ORIGINAL_PREFIX,
  RESIZE_THUMBNAIL_MAX_WIDTH_HEIGHT,
  RESIZE_ORIGINAL_MAX_WIDTH_HEIGHT,
  RESIZE_IMAGE_EXT,
} from "./constants"
import Resizer from "react-image-file-resizer"

export const uploadImageToStorage = async (
  type: ImgType,
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

export const resizeImageJpeg = async (
  file: File,
  type: ImgType
): Promise<{ imageUrl: string }> => {
  const maxWidthHeight =
    type === "thumbnail"
      ? RESIZE_THUMBNAIL_MAX_WIDTH_HEIGHT
      : RESIZE_ORIGINAL_MAX_WIDTH_HEIGHT

  let imageUrl = ""
  await new Promise<void>((resolve) => {
    Resizer.imageFileResizer(
      file,
      maxWidthHeight,
      maxWidthHeight,
      RESIZE_IMAGE_EXT,
      90,
      0,
      async (uri) => {
        const imgBlob = await (await fetch(uri as string)).blob()
        const { imgUrl } = await uploadImageToStorage(
          "thumbnail",
          imgBlob,
          RESIZE_IMAGE_EXT
        )
        // setThumbnailImgUrl(imgUrl)
        imageUrl = imgUrl
        console.log("SUCCESSFULLY GENERATED THUMBNAIL IMAGE")
        // toast.success(`성공적으로 이미지가 업로드 되었습니다.`)
        resolve()
      },
      "base64"
    )
  })

  return {
    imageUrl,
  }
}
