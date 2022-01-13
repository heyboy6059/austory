import { FC, useState } from "react"
import Loader from "./Loader"
import Resizer from "react-image-file-resizer"
import {
  RESIZE_IMAGE_EXT,
  ORIGINAL_IMAGE_UPLOAD_MAX_THRESHOLD,
  FileExt,
  RESIZE_THUMBNAIL_MAX_WIDTH_HEIGHT,
  RESIZE_ORIGINAL_MAX_WIDTH_HEIGHT,
} from "../common/constants"
import Image from "next/image"
import { UseFormSetValue } from "react-hook-form/dist/types/form"
import { PostWrite } from "../typing/interfaces"
import { resizeImageJpeg, uploadImageToStorage } from "../common/image"
import toast from "react-hot-toast"

interface Props {
  setValue: UseFormSetValue<PostWrite>
}

const ImageUploader: FC<Props> = ({ setValue }) => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadURL, setDownloadURL] = useState(null)
  const [thumbnailImgUrl, setThumbnailImgUrl] = useState("")

  // Creates a Firebase Upload Task
  const uploadFile = async (e) => {
    setUploading(true)

    let thumbnailImgBlob: Blob = null
    let originalImgBlob: Blob = null

    let thumbnailImgUrl = ""
    let originalImgUrl = ""

    // Get the file
    const file = Array.from(e.target.files)[0] as File

    if (file) {
      const extension = file.type.split("/")[1]

      try {
        // Resizer for thumbnail
        const { imageUrl } = await resizeImageJpeg(file, "thumbnail")
        setThumbnailImgUrl(imageUrl)
        thumbnailImgUrl = imageUrl
        toast.success(`성공적으로 이미지가 업로드 되었습니다.`)
        // await new Promise<void>((resolve) => {
        //   Resizer.imageFileResizer(
        //     file,
        //     RESIZE_THUMBNAIL_MAX_WIDTH_HEIGHT,
        //     RESIZE_THUMBNAIL_MAX_WIDTH_HEIGHT,
        //     RESIZE_IMAGE_EXT,
        //     85,
        //     0,
        //     async (uri) => {
        //       thumbnailImgBlob = await (await fetch(uri as string)).blob()
        //       const { imgUrl } = await uploadImageToStorage(
        //         "thumbnail",
        //         thumbnailImgBlob,
        //         RESIZE_IMAGE_EXT
        //       )
        //       setThumbnailImgUrl(imgUrl)
        //       thumbnailImgUrl = imgUrl
        //       console.log("SUCCESSFULLY GENERATED THUMBNAIL IMAGE")
        //       toast.success(`성공적으로 이미지가 업로드 되었습니다.`)
        //       resolve()
        //     },
        //     "base64"
        //   )
        // })

        if (
          file.size > ORIGINAL_IMAGE_UPLOAD_MAX_THRESHOLD &&
          extension !== FileExt.GIF // gif cannot be resized to jpeg
        ) {
          const { imageUrl } = await resizeImageJpeg(file, "original")
          originalImgUrl = imageUrl
          // Resizer for original
          // await new Promise<void>((resolve) => {
          //   Resizer.imageFileResizer(
          //     file,
          //     RESIZE_ORIGINAL_MAX_WIDTH_HEIGHT,
          //     RESIZE_ORIGINAL_MAX_WIDTH_HEIGHT,
          //     RESIZE_IMAGE_EXT,
          //     85,
          //     0,
          //     async (uri) => {
          //       originalImgBlob = await (await fetch(uri as string)).blob()
          //       const { imgUrl } = await uploadImageToStorage(
          //         "original",
          //         originalImgBlob,
          //         RESIZE_IMAGE_EXT
          //       )
          //       originalImgUrl = imgUrl
          //       console.log("SUCCESSFULLY GENERATED ORIGINAL IMAGE")
          //       resolve()
          //     },
          //     "base64"
          //   )
          // })
        } else {
          const { imgUrl } = await uploadImageToStorage(
            "original",
            file,
            extension
          )
          originalImgUrl = imgUrl
        }

        setValue("images", [
          {
            thumbnailImgUrl,
            originalImgUrl,
          },
        ])
      } catch (err) {
        console.error(`ERROR in image upload. ${err.message}`)
        toast.error(`이미지 업로드중 에러가 발생했습니다. 다시 시도해주세요.`)
      } finally {
        setUploading(false)
      }
    } else {
      //HANDLE FILE ERROR
      console.error(`ERROR in image file`)
      toast.error(`이미지 파일을 다시 한번 확인해주세요.`)
    }
  }

  return (
    <div>
      <div>
        <label className="btn">
          📸 이미지 <Loader show={uploading} />
          <input
            type="file"
            onChange={uploadFile}
            accept="image/x-png,image/gif,image/jpeg"
            disabled={uploading}
            // TODO:
            // multiple
          />
        </label>
      </div>
      {thumbnailImgUrl ? (
        <div style={{ width: "300px" }}>
          <Image
            src={thumbnailImgUrl}
            alt="thumbnail image"
            width={"100%"}
            height={"100%"}
            layout="responsive"
            objectFit="contain"
          />
        </div>
      ) : (
        <div></div>
      )}
      {/* <div>downloadURL: {downloadURL}</div> */}
    </div>
  )
}

export default ImageUploader

// // Uploads images to Firebase Storage
// export default function ImageUploader<Props>({setValue}) {

// }
