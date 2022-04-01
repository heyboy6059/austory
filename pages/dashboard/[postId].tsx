import styles from '../../styles/Dashboard.module.css'
import AuthCheck from '../../components/AuthCheck'
import { firestore, auth, serverTimestamp } from '../../common/firebase'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

import { useDocumentData } from 'react-firebase-hooks/firestore'
import { useForm } from 'react-hook-form'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import toast from 'react-hot-toast'

import ImageUploader from '../../components/ImageUploader'

import { Editor, EditorState, RichUtils } from 'draft-js'
import { convertToHTML } from 'draft-convert'

export default function OwnerPostEdit(props) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  )
}

function PostManager() {
  const [preview, setPreview] = useState(false)

  const router = useRouter()
  const { postId } = router.query

  const postRef = firestore
    .collection('users')
    .doc(auth.currentUser.uid)
    .collection('posts')
    .doc(postId as string)
  const [post] = useDocumentData(postRef)

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.postId}</p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? 'Edit' : 'Preview'}
            </button>
            <Link href={`/${post.username}/${post.postId}`} passHref>
              <button className="btn-blue">Live view</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  )
}

function PostForm({ defaultValues, postRef, preview }) {
  const {
    register,
    handleSubmit,
    reset,
    watch
    // formState: { isDirty, isValid, errors },
  } = useForm({
    defaultValues,
    mode: 'onChange'
  })

  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  console.log(
    'editor current content: ',
    convertToHTML(editorState?.getCurrentContent())
  )
  const editor = useRef(null)

  function focusEditor() {
    editor.current.focus()
  }

  // const onBoldClick = useCallback(()=>{

  // },[])

  useEffect(() => {
    focusEditor()
  }, [])

  //   console.log({ isValid })
  //   console.log({ isDirty })
  //   console.log({ errors })

  const updatePost = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp()
    })

    reset({ content, published })

    toast.success('Post updated successfully!')
  }

  console.log({ editorState })
  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <div>Image Upload disabled</div>
        {/* <ImageUploader /> */}
        <textarea
          name="content"
          {...(register('content'),
          {
            maxLength: 20000,
            minLength: 10,
            required: true
          })}
        ></textarea>

        <div
          onClick={focusEditor}
          style={{ backgroundColor: 'white', margin: '20px' }}
        >
          {/* <button onClick={}>Bold</button> */}
          <Editor
            ref={editor}
            editorState={editorState}
            onChange={editorState => setEditorState(editorState)}
          />
        </div>

        <fieldset>
          <input
            className={styles.checkbox}
            name="published"
            type="checkbox"
            {...register('published')}
          />
          <label>Published</label>
        </fieldset>

        {/* {errors.content && (
          <p className="text-danger">{errors.content.message}</p>
        )} */}

        <button
          type="submit"
          className="btn-green"
          // disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  )
}
