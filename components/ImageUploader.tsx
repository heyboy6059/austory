import { FC, useState } from "react"
import { auth, storage, STATE_CHANGED } from "../common/firebase"
import Loader from "./Loader"
import Resizer from "react-image-file-resizer"
import {
  RESIZE_IMAGE_EXT,
  ORIGINAL_IMAGE_UPLOAD_MAX_THRESHOLD,
  FileExt,
} from "../common/constants"
// import Lightbox from "react-image-lightbox"
// import "react-image-lightbox/style.css"
// import ImageList from "@mui/material/ImageList"
// import ImageListItem from "@mui/material/ImageListItem"
import Image from "next/image"
import { UseFormSetValue } from "react-hook-form/dist/types/form"
import { PostWrite } from "../typing/interfaces"
import { uploadImageToStorage } from "../common/image"
import toast from "react-hot-toast"

interface Props {
  setValue: UseFormSetValue<PostWrite>
}

const ImageUploader: FC<Props> = ({ setValue }) => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadURL, setDownloadURL] = useState(null)

  // Creates a Firebase Upload Task
  /**
   * TODO:
   *  1. handle multiple files (up to 5)
   *  2. save thumbnail (e.g. up to 100px X 100px)
   *  3. save original (e.g. up to )
   */
  const uploadFile = async (e) => {
    setUploading(true)

    let thumbnailImgBlob: Blob = null
    let originalImgBlob: Blob = null

    // Get the file
    const file = Array.from(e.target.files)[0] as File

    if (file) {
      const extension = file.type.split("/")[1]

      try {
        // Resizer for thumbnail
        Resizer.imageFileResizer(
          file,
          300,
          300,
          RESIZE_IMAGE_EXT,
          85,
          0,
          async (uri) => {
            thumbnailImgBlob = await (await fetch(uri as string)).blob()
            await uploadImageToStorage(
              "thumbnail",
              thumbnailImgBlob,
              RESIZE_IMAGE_EXT
            )
            console.log("SUCCESSFULLY GENERATED THUMBNAIL IMAGE")
            toast.success(`성공적으로 이미지가 업로드 되었습니다.`)
            setUploading(false)
          },
          "base64"
        )

        if (
          file.size > ORIGINAL_IMAGE_UPLOAD_MAX_THRESHOLD &&
          extension !== FileExt.GIF
        ) {
          console.log("original resizer", extension)
          // Resizer for original
          Resizer.imageFileResizer(
            file,
            1920,
            1920,
            RESIZE_IMAGE_EXT,
            80,
            0,
            async (uri) => {
              // const extension = file.type.split("/")[1]
              originalImgBlob = await (await fetch(uri as string)).blob()
              await uploadImageToStorage(
                "original",
                originalImgBlob,
                RESIZE_IMAGE_EXT
              )
              console.log("SUCCESSFULLY GENERATED ORIGINAL IMAGE")
            },
            "base64"
          )
        } else {
          await uploadImageToStorage("original", file, extension)
        }
      } catch (err) {
        console.error(`ERROR in image upload. ${err.message}`)
        // toast.error(`Sorry, there was an error while uploading the image. Please try again`)
        toast.error(`이미지 업로드중 에러가 발생했습니다. 다시 시도해주세요.`)
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

      {/* <div>downloadURL: {downloadURL}</div> */}
    </div>
  )
}

export default ImageUploader

// // Uploads images to Firebase Storage
// export default function ImageUploader<Props>({setValue}) {

// }
