import debounce from "lodash.debounce"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { UserContext } from "../common/context"
import {
  auth,
  firestore,
  googleAuthProvider,
  serverTimestamp,
} from "../common/firebase"
import TextField from "@mui/material/TextField"
import Chip from "@mui/material/Chip"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import { FirestoreTimestamp, User } from "../typing/interfaces"
import { FlexCenterDiv } from "../common/uiComponents"

export default function Enter(props) {
  const { user, username } = useContext(UserContext)

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main>
      {/* <Metatags title="Enter" description="Sign up for this amazing app!" /> */}
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  )
}

// Sign in with Google button
function SignInButton() {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider)
  }

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={"/google.png"} /> Google 로그인
    </button>
  )
}

// Sign out button
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>
}

function UsernameForm() {
  const [inkrauUsername, setInkrauUsername] = useState("")
  const [isMarketingEmail, setIsMarketingEmail] = useState(false)

  const [isNotValid, setIsNotValid] = useState(false)
  const [isExistInDB, setIsExistInDB] = useState(false)
  const [loading, setLoading] = useState(false)

  const { user, username } = useContext(UserContext)

  const onSubmit = async (e) => {
    e.preventDefault()

    // Create refs for both documents
    const userDoc = firestore.doc(`users/${user.uid}`)
    const usernameDoc = firestore.doc(`usernames/${inkrauUsername}`)

    // Commit both docs together as a batch write
    const batch = firestore.batch()
    batch.set(userDoc, {
      username: inkrauUsername,
      photoURL: user.photoURL,
      displayName: user.displayName,
      email: user.email,
      heartCountTotal: 0,
      postCountTotal: 0,
      commentCountTotal: 0,
      viewCountTotal: 0,
      disabled: false,
      isAdmin: false,
      isMarketingEmail,
      role: "Base",
      createdAt: serverTimestamp() as FirestoreTimestamp,
      updatedAt: null,
    } as User)
    batch.set(usernameDoc, {
      uid: user.uid,
    })

    await batch.commit()

    // TODO
    // success toast
    // reroute to home page
  }

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase()
    // const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/
    const reg = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/

    // Only set from value if length is < 2 OR it passes regex
    // if (val.length < 2) {
    //   setInkrauUsername(val)
    //   setLoading(false)
    //   setIsNotValid(true)
    // }

    if (reg.test(val) && val.length < 20) {
      setIsNotValid(false)
    } else {
      setIsNotValid(true)
    }

    setInkrauUsername(val)
  }

  useEffect(() => {
    checkUsername(inkrauUsername)
  }, [inkrauUsername])

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length > 3) {
        const ref = firestore.doc(`usernames/${username}`)
        const { exists } = await ref.get()
        console.log("Firestore read executed!")
        setIsExistInDB(exists)
        setLoading(false)
      }
    }, 500),
    []
  )

  const usernameHelperText = (): string => {
    console.log("username in callback ", inkrauUsername)
    if (!inkrauUsername || inkrauUsername.length < 3) {
      return "한글과 영문 모두 사용 가능합니다."
    }
    if (isExistInDB) return "이미 존재하는 활동명 입니다."
    if (isNotValid) {
      return "한글, 영문, 숫자 조합으로 최대 20자 까지 가능합니다."
    }
    return "한글과 영문 모두 사용 가능합니다."
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
            value={user.email}
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
              label={`현재 이메일 프로필 이름 사용하기. ${user.displayName}`}
              variant="outlined"
              color="success"
              size="small"
              onClick={() => {
                setInkrauUsername(user.displayName)
                setIsNotValid(false)
              }}
            />
          )}

          {/* <UsernameMessage
            username={inkrauUsername}
            isValid={isValid}
            loading={loading}
          /> */}

          <div style={{ margin: "5px 0" }}>
            <FormControlLabel
              control={<Checkbox />}
              label={
                <span style={{ fontSize: "0.8rem" }}>
                  인크라우가 제공하는 알림, 호주 소식, 정보 등을 이메일로 받아
                  보시겠습니까?
                </span>
              }
            />
          </div>
          {/* <button type="submit" className="btn-green" disabled={!isValid}> */}
          <FlexCenterDiv style={{ margin: "10px 0" }}>
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
