import { FC } from "react"
import { User } from "../typing/interfaces"

// UI component for user profile
const UserProfile: FC<{
  user: User
}> = ({ user }) => {
  return (
    <div className="box-center">
      <img src={user.photoURL || "/hacker.png"} className="card-img-center" />
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName || "Anonymous User"}</h1>
    </div>
  )
}

export default UserProfile
