import { FC, useState } from "react"
import { auth, storage, STATE_CHANGED } from "../common/firebase"
import Loader from "./Loader"
import Resizer from "react-image-file-resizer"
import { RESIZE_IMAGE_EXT } from "../common/constants"
// import Lightbox from "react-image-lightbox"
// import "react-image-lightbox/style.css"
// import ImageList from "@mui/material/ImageList"
// import ImageListItem from "@mui/material/ImageListItem"
import Image from "next/image"
import ImageGallery from "react-image-gallery"
import { UseFormSetValue } from "react-hook-form/dist/types/form"
import { PostWrite } from "../typing/interfaces"

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
    // Get the file
    const file = Array.from(e.target.files)[0] as File

    // Resizer for thumbnail
    Resizer.imageFileResizer(
      file,
      300,
      300,
      RESIZE_IMAGE_EXT,
      85,
      0,
      async (uri) => {
        setUploading(true)

        // const extension = file.type.split("/")[1]
        const thumbnailImageBlob = await (await fetch(uri as string)).blob()

        // Makes reference to the storage bucket location
        const ref = storage.ref(
          `uploads/${auth.currentUser.uid}/${Date.now()}.${RESIZE_IMAGE_EXT}`
        )

        // BEGIN UPLOAD
        const task = ref.put(thumbnailImageBlob)

        // PROGRESS - Listen to updates to upload task
        task.on(STATE_CHANGED, (snapshot) => {
          const percentage = (
            (snapshot.bytesTransferred / snapshot.totalBytes) *
            100
          ).toFixed(0)
          setProgress(Number(percentage))
        })

        // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
        task
          .then((d) => ref.getDownloadURL())
          .then((url) => {
            setDownloadURL(url)
            setUploading(false)
            // update thumbnail url in post
            // setValue("images", "url")
          })
      },
      "base64"
    )

    // const extension = file.type.split("/")[1]

    // // Makes reference to the storage bucket location
    // const ref = storage.ref(
    //   `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
    // )
    // setUploading(true)

    // // Starts the upload
    // const task = ref.put(file as Blob | Uint8Array | ArrayBuffer)

    // // Listen to updates to upload task
    // task.on(STATE_CHANGED, (snapshot) => {
    //   const pct = (
    //     (snapshot.bytesTransferred / snapshot.totalBytes) *
    //     100
    //   ).toFixed(0)
    //   setProgress(Number(pct))
    // })

    // // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
    // task
    //   .then((d) => ref.getDownloadURL())
    //   .then((url) => {
    //     setDownloadURL(url)
    //     setUploading(false)
    //   })
  }

  return (
    <div>
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <div>
          <label className="btn">
            📸 이미지
            <input
              type="file"
              onChange={uploadFile}
              accept="image/x-png,image/gif,image/jpeg"
              multiple
            />
          </label>
        </div>
      )}

      <div>downloadURL: {downloadURL}</div>
      {/* <div>
        <ImageGallery
          items={[
            {
              original:
                "https://firebasestorage.googleapis.com/v0/b/austory-danpark.appspot.com/o/uploads%2FBgf0cFBYYQRFfiEh9ss4fGlUHMu1%2F1640346346728.jpeg?alt=media&token=ad58bb61-a511-41e0-9d6a-bff06e23950e",
              thumbnail:
                "https://firebasestorage.googleapis.com/v0/b/austory-danpark.appspot.com/o/uploads%2FBgf0cFBYYQRFfiEh9ss4fGlUHMu1%2F1640346346728.jpeg?alt=media&token=ad58bb61-a511-41e0-9d6a-bff06e23950e",
            },
            {
              original:
                "https://firebasestorage.googleapis.com/v0/b/austory-danpark.appspot.com/o/uploads%2FBgf0cFBYYQRFfiEh9ss4fGlUHMu1%2F1640346403445.jpeg?alt=media&token=98f59bc1-cf24-4983-b823-c3ff148a4e86",
              thumbnail:
                "https://firebasestorage.googleapis.com/v0/b/austory-danpark.appspot.com/o/uploads%2FBgf0cFBYYQRFfiEh9ss4fGlUHMu1%2F1640346403445.jpeg?alt=media&token=98f59bc1-cf24-4983-b823-c3ff148a4e86",
            },
          ]}
        />
      </div> */}
    </div>
  )
}

export default ImageUploader

// // Uploads images to Firebase Storage
// export default function ImageUploader<Props>({setValue}) {

// }
