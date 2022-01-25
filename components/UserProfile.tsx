import { FC } from "react"
import { RawUser } from "../typing/interfaces"
import Image from "next/image"
import styled from "styled-components"

// UI component for user profile
const UserProfile: FC<{
  user: RawUser
}> = ({ user }) => {
  const RoundedImageWrapper = styled.div`
    width: 50px;
    margin: auto;
    img {
      border-radius: 50px;
    }
  `

  return (
    <div className="box-center">
      <RoundedImageWrapper>
        <Image
          src={user.photoURL || "/hacker.png"}
          alt="유저 사진"
          width={"100%"}
          height={"100%"}
        />
      </RoundedImageWrapper>
      <p>
        <i>{user.email}</i>
      </p>
      <h1>{user.username || "등록되지 않은 유저"}</h1>
    </div>
  )
}

export default UserProfile
