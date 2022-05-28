import { Dispatch, FC, SetStateAction, useMemo, useRef, useState } from 'react'
const ReactQuill =
  typeof window === 'object' ? require('react-quill') : () => false
import 'react-quill/dist/quill.snow.css'
import {
  FileExt,
  IMAGE_UPLOAD_SIZE_LIMIT,
  ORIGINAL_IMAGE_UPLOAD_MAX_THRESHOLD
} from '../../common/constants'
import { extractFilenameExtension } from '../../common/functions'
import toast from 'react-hot-toast'
import { ImageDetails } from '../../typing/interfaces'
import { resizeImageJpeg, uploadImageToStorage } from '../../common/image'
import styled from 'styled-components'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

const QuillWrapper = styled.div`
  height: 100%;
  border-radius: 25px;
  .ql-container {
    font-size: 1rem !important;
    border-radius: 0px 0px 4px 4px;
  }
  .quill > .ql-container > .ql-editor.ql-blank::before {
    font-style: normal;
  }
  .ql-toolbar {
    border-radius: 4px 4px 0px 0px;
  }
`

interface Props {
  content: string
  setContent: Dispatch<SetStateAction<string>>
}
const QuillEditor: FC<Props> = ({ content, setContent }) => {
  //   const [content, setContent] = useState('')
  const [imageLoading, setImageLoading] = useState(false)
  const [totalNumOfUploadingImages, setTotalNumOfUploadingImages] = useState(0)
  const [numOfCompletedImages, setNumOfCompletedImages] = useState(0)

  // 11:50
  // const module = {
  //     toolbar: {
  //         container: [

  //         ]
  //     }
  // }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quillRef = useRef<any>()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const imageHandler = e => {
    // const editor = quillRef.current.getEditor();
    const editor = quillRef && quillRef.current && quillRef.current.getEditor()
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.setAttribute('multiple', 'true')
    input.click()

    input.onchange = async () => {
      setImageLoading(true)

      const fileArray = Array.from(input.files)

      setTotalNumOfUploadingImages(fileArray.length)

      const overSizeFiles = fileArray.filter(file => {
        const size = file.size
        if (size > IMAGE_UPLOAD_SIZE_LIMIT) {
          return true
        }
        return false
      })

      if (overSizeFiles.length) {
        toast.error(`이미지는 최대 8MB 까지 업로드 가능합니다.`)
        setImageLoading(false)
        return
      }

      // TODO: image uploading sequential order
      // TODO: styling
      try {
        // run await operations sequentially
        let count = 0
        for (const file of fileArray) {
          setNumOfCompletedImages(count)
          if (/^image\//.test(file.type)) {
            const { filename: name, extension } = extractFilenameExtension(
              file.name
            )
            const size = file.size
            let originalImageDetails: ImageDetails = null

            try {
              // file size check - early return
              if (size > IMAGE_UPLOAD_SIZE_LIMIT) {
                toast.error(`이미지는 최대 8MB 까지 업로드 가능합니다.`)
                return
              }

              if (
                size > ORIGINAL_IMAGE_UPLOAD_MAX_THRESHOLD &&
                extension !== FileExt.GIF // gif cannot be resized to jpeg
              ) {
                originalImageDetails = await resizeImageJpeg(
                  file,
                  'original',
                  name
                )
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

              // update thumbnail url to be shown in UI before storing original image
              await editor.insertEmbed(
                editor.getSelection(),
                'image',
                originalImageDetails.url
              )

              count++
              // toast.success(`성공적으로 이미지가 업로드 되었습니다.`)
            } catch (err) {
              throw err
            }
          } else {
            throw new Error(`Not passed regex test.`)
          }
        }
      } catch (err) {
        console.error(`ERROR in image upload. ${err.message}`)
        toast.error(`이미지 업로드중 에러가 발생했습니다. 다시 시도해주세요.`)
      } finally {
        //   setUploading(false)
        setNumOfCompletedImages(0)
        setImageLoading(false)
      }
    }
  }

  const module = useMemo(
    () => ({
      toolbar: {
        container: [
          // [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
          [{ header: [1, 2, 3, 4, false] }],
          [
            'bold',
            'italic',
            'underline'
            // , 'strike'
          ], // toggled buttons
          // ['blockquote', 'code-block'],
          //   [{ header: 1 }, { header: 2 }], // custom button values
          //   [{ list: 'ordered' }, { list: 'bullet' }],
          // [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          // [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          // [{ direction: 'rtl' }], // text direction
          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          // [{ font: [] }],
          [{ align: [] }],
          ['link', 'image']
          // ['clean'] // remove formatting button
        ],
        handlers: {
          image: imageHandler
        }
      }
      //   handlers: {
      //     image: () => imageHandler()
      //   }
    }),
    []
  )

  return (
    <>
      <QuillWrapper>
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={e => setContent(e)}
          theme="snow"
          modules={module}
          style={{
            //   height: 'calc(100% - 58px)',
            // borderRadius: '25px'
            // display: 'grid',
            // gridTemplateRows: 'auto 1fr',
            // height: '100%'
            height: '400px'
          }}
          placeholder="내용"
        />
      </QuillWrapper>
      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open={imageLoading}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" /> 업로드 ({numOfCompletedImages}/
        {totalNumOfUploadingImages})
      </Backdrop>
    </>
  )
}

export default QuillEditor
