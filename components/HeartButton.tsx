import { FC } from "react"
import { firestore, auth, increment } from "../common/firebase"
import { useDocument } from "react-firebase-hooks/firestore"
import { FirebaseDocumentRef } from "../typing/interfaces"

import FavoriteIcon from "@mui/icons-material/Favorite"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import { FlexVerticalCenterDiv } from "../common/uiComponents"

interface HeartButtonProps {
  postRef: FirebaseDocumentRef
  heartCount: number
}
// Allows user to heart or like a post
const HeartButton: FC<HeartButtonProps> = ({ postRef, heartCount }) => {
  // Listen to heart document for currently logged in user
  const heartRef = postRef.collection("hearts").doc(auth.currentUser.uid)
  const [heartDoc] = useDocument(heartRef)

  // Create a user-to-post relationship
  const addHeart = async () => {
    alert("not ready yet!")
    return

    const uid = auth.currentUser.uid
    const batch = firestore.batch()

    batch.update(postRef, { heartCount: increment(1) })
    batch.set(heartRef, { uid })

    await batch.commit()
  }

  // Remove a user-to-post relationship
  const removeHeart = async () => {
    alert("not ready yet!")
    return
    const batch = firestore.batch()

    batch.update(postRef, { heartCount: increment(-1) })
    batch.delete(heartRef)

    await batch.commit()
  }

  return heartDoc?.exists ? (
    <FlexVerticalCenterDiv style={{ gap: "2px" }}>
      <FavoriteIcon style={{ cursor: "pointer" }} onClick={removeHeart} />{" "}
      {heartCount}
    </FlexVerticalCenterDiv>
  ) : (
    <FlexVerticalCenterDiv style={{ gap: "2px" }}>
      <FavoriteBorderIcon style={{ cursor: "pointer" }} onClick={addHeart} />{" "}
      {heartCount}
    </FlexVerticalCenterDiv>
  )
}

export default HeartButton
