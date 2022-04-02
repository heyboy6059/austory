import debounce from 'lodash.debounce'
import { useCallback, useContext, useEffect, useState } from 'react'
import { UserContext } from '../common/context'
import {
  auth,
  facebookAuthProvider,
  firestore,
  googleAuthProvider,
  serverTimestamp
} from '../common/firebase'
import TextField from '@mui/material/TextField'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { FirestoreTimestamp, RawUser } from '../typing/interfaces'
import { FlexCenterDiv } from '../common/uiComponents'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import Stack from '@mui/material/Stack'
import Image from 'next/image'
import { NotificationMethod } from '../typing/enums'

export default function Enter() {
  const { userAuth, user, username } = useContext(UserContext)
  const router = useRouter()

  // route user to home page if account is already registered
  useEffect(() => {
    if (userAuth && username) {
      console.log('redirecting to Home page')
      router.push('/')
    }
  }, [router, userAuth, username])

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main>
      {/* <Metatags title="Enter" description="Sign up for this amazing app!" /> */}
      {/* {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )} */}
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          // REVIEW: maybe loading indicator?
          <div></div>
        )
      ) : (
        <SignInButton />
      )}
    </main>
  )
}

// Sign in with Google button
function SignInButton() {
  const signInWithPopup = async (provider: 'Google' | 'Facebook' | 'Apple') => {
    try {
      const authProvider =
        provider === 'Google'
          ? googleAuthProvider
          : provider === 'Facebook' && facebookAuthProvider
      // : new Error('Provider not found.')

      const authRes = await auth.signInWithPopup(authProvider)
      console.log({ authRes })
      console.log(`Successfully signed in with ${provider} popup.`)
    } catch (err) {
      console.error(`Error in signInWithPopup. ${err.message}`)
      if (
        !err.message.includes(
          'The popup has been closed by the user before finalizing the operation.'
        )
      ) {
        toast.error('로그인에 실패했습니다. 다시 시도해주세요.')
      }
    }
  }

  return (
    <>
      <Stack spacing={2}>
        <FlexCenterDiv
          style={{
            gap: '5px',
            backgroundColor: 'white',
            width: '250px',
            height: '60px',
            cursor: 'pointer'
          }}
          onClick={() => signInWithPopup('Google')}
        >
          <Image src={'/google.png'} width={30} height={30} />
          Google 로그인
        </FlexCenterDiv>
        <FlexCenterDiv
          style={{
            gap: '5px',
            backgroundColor: 'white',
            width: '250px',
            height: '60px',
            cursor: 'pointer'
          }}
          onClick={() => signInWithPopup('Facebook')}
        >
          <Image src={'/facebook.png'} width={30} height={30} />
          Facebook 로그인
        </FlexCenterDiv>
        <FlexCenterDiv
          style={{
            gap: '5px',
            backgroundColor: 'white',
            width: '250px',
            height: '60px',
            cursor: 'pointer'
          }}
          onClick={() => alert('준비중 입니다.')}
        >
          <Image src={'/apple.png'} width={30} height={30} />
          Apple 로그인
        </FlexCenterDiv>
      </Stack>
    </>
  )
}

// Sign out button
// function SignOutButton() {
//   return <button onClick={() => auth.signOut()}>Sign Out</button>
// }

function UsernameForm() {
  const router = useRouter()

  const [inkrauUsername, setInkrauUsername] = useState('')
  const [isMarketingEmail, setIsMarketingEmail] = useState(false)

  const [isNotValid, setIsNotValid] = useState(false)
  const [isExistInDB, setIsExistInDB] = useState(false)
  // const [loading, setLoading] = useState(false)

  const { userAuth, user, username } = useContext(UserContext)

  const onSubmit = async e => {
    e.preventDefault()

    try {
      // Create refs for both documents
      const userDoc = firestore.doc(`users/${userAuth.uid}`)
      const usernameDoc = firestore.doc(`usernames/${inkrauUsername}`)

      // Commit both docs together as a batch write
      const batch = firestore.batch()
      batch.set(userDoc, {
        uid: userAuth.uid,
        username: inkrauUsername,
        photoURL: userAuth.photoURL,
        displayName: userAuth.displayName,
        email: userAuth.email,
        providedHeartCountTotal: 0,
        receivedHeartCountTotal: 0,
        myPostCountTotal: 0,
        receivedCommentCountTotal: 0,
        providedCommentCountTotal: 0,
        receivedViewCountTotal: 0,
        providedViewCountTotal: 0,
        disabled: false,
        isAdmin: false,
        isMarketingEmail,
        notificationMethod: NotificationMethod.EMAIL,
        role: 'Base',
        createdAt: serverTimestamp() as FirestoreTimestamp,
        updatedAt: null,
        disabledAt: null
      } as RawUser)
      batch.set(usernameDoc, {
        uid: userAuth.uid,
        username: inkrauUsername
      })

      await batch.commit()

      toast.success('환영합니다!')

      // direct to home page
      router.push('/')
    } catch (err) {
      console.error(`Error in sign up. ${err.message}`)
      toast.error('계정 생성중 에러가 발생했습니다. 다시 시도해주세요.')
    }
  }

  const onChange = e => {
    // update setIsExistInDB false first as it will be rechecked with debounce
    setIsExistInDB(false)

    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase()

    // Korean, English, number only regex
    const reg = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/

    if (reg.test(val) && val.length < 20) {
      setIsNotValid(false)
    } else {
      setIsNotValid(true)
    }

    setInkrauUsername(val)
  }

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkUsername = useCallback(
    debounce(async username => {
      if (username.length > 3) {
        console.log('checkUsername...')
        const ref = firestore.doc(`usernames/${username}`)
        const { exists } = await ref.get()
        setIsExistInDB(exists)
        // setLoading(false)
      }
    }, 500),
    []
  )

  useEffect(() => {
    checkUsername(inkrauUsername)
  }, [checkUsername, inkrauUsername])

  const usernameHelperText = (): string => {
    console.log('username in callback ', inkrauUsername)
    if (!inkrauUsername || inkrauUsername.length < 3) {
      return '한글과 영문 모두 사용 가능합니다.'
    }
    if (isExistInDB) return '이미 존재하는 활동명 입니다.'
    if (isNotValid) {
      return '한글, 영문, 숫자 조합으로 최대 20자 까지 가능합니다.'
    }
    return '한글과 영문 모두 사용 가능합니다.'
  }

  return (
    !username && (
      <section>
        <form onSubmit={onSubmit}>
          <TextField
            required={true}
            label="Email"
            size="small"
            fullWidth
            margin="normal"
            disabled={true}
            value={userAuth.email}
          />
          <TextField
            required={true}
            label="활동명"
            size="small"
            fullWidth
            margin="normal"
            onChange={onChange}
            value={inkrauUsername}
            error={inkrauUsername?.length > 2 && (isExistInDB || isNotValid)}
            helperText={usernameHelperText()}
          />
          {inkrauUsername?.length < 2 && inkrauUsername !== user.displayName && (
            // display it inkrauUsername is not equals to displayName
            <Chip
              label={`기존 이메일 프로필 사용. ${userAuth.displayName}`}
              variant="outlined"
              color="success"
              size="small"
              onClick={() => {
                setInkrauUsername(userAuth.displayName)
                setIsNotValid(false)
              }}
            />
          )}

          {/* <UsernameMessage
            username={inkrauUsername}
            isValid={isValid}
            loading={loading}
          /> */}

          <div style={{ margin: '20px 0' }}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={e => {
                    setIsMarketingEmail(e.target.checked)
                  }}
                />
              }
              label={
                <span style={{ fontSize: '0.8rem' }}>
                  인크라우가 제공하는 알림, 호주 소식, 정보 등을 이메일로 받아
                  보시겠습니까?
                </span>
              }
            />
          </div>
          <FlexCenterDiv style={{ margin: '10px 0' }}>
            <Button
              type="submit"
              disabled={
                !(
                  inkrauUsername &&
                  inkrauUsername.length > 2 &&
                  !isExistInDB &&
                  !isNotValid
                )
              }
              variant="outlined"
            >
              완료
            </Button>
          </FlexCenterDiv>
          {/* </button> */}

          {/* <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div> */}
        </form>
      </section>
    )
  )
}

// function UsernameMessage({ username, isValid, loading }) {
//   if (loading) {
//     return <p>Checking...</p>
//   } else if (isValid) {
//     return <p className="text-success">{username} is available!</p>
//   } else if (username && !isValid) {
//     return <p className="text-danger">That username is taken!</p>
//   } else {
//     return <p></p>
//   }
// }
