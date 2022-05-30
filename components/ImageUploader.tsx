import { FC, Dispatch, SetStateAction, useState, useEffect } from 'react'
import {
  ORIGINAL_IMAGE_UPLOAD_MAX_THRESHOLD,
  FileExt,
  COLOURS,
  IMAGE_UPLOAD_SIZE_LIMIT
} from '../common/constants'
import Image from 'next/image'
import { UseFormSetValue } from 'react-hook-form/dist/types/form'
import { ImageDetails, PostWrite } from '../typing/interfaces'
import { resizeImageJpeg, uploadImageToStorage } from '../common/image'
import toast from 'react-hot-toast'
import { extractFilenameExtension } from '../common/functions'
import ImageIcon from '@mui/icons-material/Image'
import CircularProgress from '@mui/material/CircularProgress'
import CancelIcon from '@mui/icons-material/Cancel'
import Tooltip from '@mui/material/Tooltip'

interface Props {
  setValue: UseFormSetValue<PostWrite>
  setImageLoading?: Dispatch<SetStateAction<boolean>>
  editThumbnailImgUrl?: string
  thumbnailOnly?: boolean
}

const ImageUploader: FC<Props> = ({
  setValue,
  setImageLoading,
  editThumbnailImgUrl,
  thumbnailOnly
}) => {
  const [uploading, setUploading] = useState(false)
  const [thumbnailImgUrl, setThumbnailImgUrl] = useState(
    editThumbnailImgUrl || ''
  )

  useEffect(() => {
    if (editThumbnailImgUrl) {
      console.log('update thumbnailImgUrl')
      setThumbnailImgUrl(editThumbnailImgUrl)
    }
  }, [editThumbnailImgUrl])

  // Creates a Firebase Upload Task
  const uploadFile = async e => {
    setUploading(true)
    // parent component loading
    setImageLoading && setImageLoading(true)

    let thumbnail200ImageDetails: ImageDetails = null
    let thumbnail600ImageDetails: ImageDetails = null
    let originalImageDetails: ImageDetails = null

    // Get the file
    const file = Array.from(e.target.files)[0] as File
    const size = file.size

    if (file) {
      const { filename: name, extension } = extractFilenameExtension(file.name)

      try {
        // file size check - early return
        if (size > IMAGE_UPLOAD_SIZE_LIMIT) {
          toast.error(`이미지는 최대 8MB 까지 업로드 가능합니다.`)
          return
        }

        /**
         * Thumbnail(200px) Only
         *  - Temporarily off = Thumbnail Only mode still needs Original size for embedded link in FB
         */
        // if (thumbnailOnly) {
        //   // Resize for thumbnail200
        //   thumbnail200ImageDetails = await resizeImageJpeg(
        //     file,
        //     'thumbnail200',
        //     name
        //   )

        //   // update thumbnail url to be shown in UI before storing original image
        //   setThumbnailImgUrl(thumbnail200ImageDetails.url)

        //   setValue('images', [
        //     {
        //       thumbnail200: thumbnail200ImageDetails,
        //       thumbnail600: null,
        //       original: null
        //     }
        //   ])
        // }

        /**
         * Thumbnail(200px)
         * Optimized(600px)
         * Original(1080px)
         */
        // if (!thumbnailOnly) {
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
        // }
        // toast.success(`성공적으로 이미지가 업로드 되었습니다.`)
      } catch (err) {
        console.error(`ERROR in image upload. ${err.message}`)
        toast.error(`이미지 업로드중 에러가 발생했습니다. 다시 시도해주세요.`)
      } finally {
        setUploading(false)
        setImageLoading && setImageLoading(false)
      }
    } else {
      //HANDLE FILE ERROR
      console.error(`ERROR in image file`)
      toast.error(`이미지 파일을 다시 한번 확인해주세요.`)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          {uploading ? (
            <CircularProgress size={16} />
          ) : (
            <>
              <ImageIcon /> <span>{thumbnailOnly ? '썸네일' : '이미지'}</span>
            </>
          )}
          <input
            type="file"
            onChange={uploadFile}
            accept=".jpg, .jpeg, .png, .gif"
            disabled={uploading}
          />
        </label>
        {!uploading && thumbnailImgUrl && (
          <Tooltip title="삭제" placement="bottom" arrow>
            <CancelIcon
              fontSize="small"
              style={{
                color: COLOURS.CANCEL_RED,
                margin: '0 6px',
                cursor: 'pointer'
              }}
              onClick={() => {
                // remove from main value object
                setValue('images', [])
                // remove in thumbnailImgUrl
                setThumbnailImgUrl('')
              }}
            />
          </Tooltip>
        )}
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
