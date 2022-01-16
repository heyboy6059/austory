import { auth, storage, STATE_CHANGED } from "../common/firebase"
import { ImageDetails, ImgType } from "../typing/interfaces"
import {
  IMAGE_THUMBNAIL100_PREFIX,
  IMAGE_ORIGINAL_PREFIX,
  RESIZE_THUMBNAIL300_MAX_WIDTH_HEIGHT,
  RESIZE_ORIGINAL_MAX_WIDTH_HEIGHT,
  RESIZE_IMAGE_EXT,
  RESIZE_THUMBNAIL100_MAX_WIDTH_HEIGHT,
  IMAGE_THUMBNAIL300_PREFIX,
} from "./constants"
import Resizer from "react-image-file-resizer"
import { extractFilenameExtension } from "./functions"

export const uploadImageToStorage = async (
  type: ImgType,
  name: string,
  blob: Blob,
  ext: string
): Promise<{ imgUrl: string; savedName: string }> => {
  const savedName = `${
    type === "thumbnail100"
      ? IMAGE_THUMBNAIL100_PREFIX
      : type === "thumbnail300"
      ? IMAGE_THUMBNAIL300_PREFIX
      : IMAGE_ORIGINAL_PREFIX
  }${name}_${Date.now()}.${ext}`

  const ref = storage.ref(`uploads/${auth.currentUser.uid}/${savedName}`)

  const task = await ref.put(blob)

  const imgUrl = await task.ref.getDownloadURL()

  return { imgUrl, savedName }

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
  type: ImgType,
  name: string
): Promise<ImageDetails> => {
  const maxWidthHeight =
    type === "thumbnail100"
      ? RESIZE_THUMBNAIL100_MAX_WIDTH_HEIGHT
      : type === "thumbnail300"
      ? RESIZE_THUMBNAIL300_MAX_WIDTH_HEIGHT
      : RESIZE_ORIGINAL_MAX_WIDTH_HEIGHT

  let url = ""
  let savedImgName = ""
  let size = null

  await new Promise<void>((resolve) => {
    Resizer.imageFileResizer(
      file,
      maxWidthHeight,
      maxWidthHeight,
      RESIZE_IMAGE_EXT,
      90,
      0,
      async (uri) => {
        // get resized blob
        const imgBlob = await (await fetch(uri as string)).blob()

        // upload it to firestore
        const { imgUrl, savedName } = await uploadImageToStorage(
          type,
          name,
          imgBlob,
          RESIZE_IMAGE_EXT
        )

        // update return values
        url = imgUrl
        size = imgBlob.size
        savedImgName = savedName

        console.log("SUCCESSFULLY GENERATED THUMBNAIL IMAGE")
        resolve()
      },
      "base64"
    )
  })

  const { filename, extension } = extractFilenameExtension(savedImgName)

  return {
    url,
    name: filename,
    ext: extension,
    size,
  }
}
