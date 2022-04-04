import { FC, useState } from 'react'
import {
  ORIGINAL_IMAGE_UPLOAD_MAX_THRESHOLD,
  FileExt
} from '../common/constants'
import Image from 'next/image'
import { UseFormSetValue } from 'react-hook-form/dist/types/form'
import { ImageDetails, PostWrite } from '../typing/interfaces'
import { resizeImageJpeg, uploadImageToStorage } from '../common/image'
import toast from 'react-hot-toast'
import { extractFilenameExtension } from '../common/functions'
import ImageIcon from '@mui/icons-material/Image'
import CircularProgress from '@mui/material/CircularProgress'
interface Props {
  setValue: UseFormSetValue<PostWrite>
  editThumbnailImgUrl?: string
}

const ImageUploader: FC<Props> = ({ setValue, editThumbnailImgUrl }) => {
  const [uploading, setUploading] = useState(false)
  const [thumbnailImgUrl, setThumbnailImgUrl] = useState(
    editThumbnailImgUrl || ''
  )

  // Creates a Firebase Upload Task
  const uploadFile = async e => {
    setUploading(true)

    let thumbnail200ImageDetails: ImageDetails = null
    let thumbnail600ImageDetails: ImageDetails = null
    let originalImageDetails: ImageDetails = null

    // Get the file
    const file = Array.from(e.target.files)[0] as File
    const size = file.size

    if (file) {
      const { filename: name, extension } = extractFilenameExtension(file.name)

      try {
        // Resize for thumbnail600
        thumbnail600ImageDetails = await resizeImageJpeg(
          file,
          'thumbnail600',
          name
        )

        // update thumbnail url to be shown in UI before storing original image
        setThumbnailImgUrl(thumbnail600ImageDetails.url)

        // Resize for thumbnail200
        thumbnail200ImageDetails = await resizeImageJpeg(
          file,
          'thumbnail200',
          name
        )

        if (
          size > ORIGINAL_IMAGE_UPLOAD_MAX_THRESHOLD &&
          extension !== FileExt.GIF // gif cannot be resized to jpeg
        ) {
          originalImageDetails = await resizeImageJpeg(file, 'original', name)
        } else {
          const { imgUrl, savedName } = await uploadImageToStorage(
            'original',
            name,
            file,
            extension
          )

          const { filename, extension: ext } =
            extractFilenameExtension(savedName)

          originalImageDetails = {
            url: imgUrl,
            name: filename,
            ext,
            size
          }
        }

        setValue('images', [
          {
            thumbnail200: thumbnail200ImageDetails,
            thumbnail600: thumbnail600ImageDetails,
            original: originalImageDetails
          }
        ])

        // toast.success(`성공적으로 이미지가 업로드 되었습니다.`)
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
        <label
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          {uploading ? (
            <CircularProgress size={16} />
          ) : (
            <>
              <ImageIcon /> 이미지
            </>
          )}
          <input
            type="file"
            onChange={uploadFile}
            accept="image/x-png,image/gif,image/jpeg"
            disabled={uploading}
          />
        </label>
      </div>
      {thumbnailImgUrl ? (
        <div style={{ width: '300px', margin: 'auto' }}>
          <Image
            src={thumbnailImgUrl}
            alt="thumbnail image"
            width={'100%'}
            height={'70%'}
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
