import { FC, useContext } from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import { UserContext } from '../common/context'

const RoundedImageWrapper = styled.div`
  width: 50px;
  margin: auto;
  img {
    border-radius: 50px;
  }
`
// UI component for user profile
const UserProfile: FC = () => {
  const { userAuth, user } = useContext(UserContext)

  return user ? (
    <div className="box-center">
      <RoundedImageWrapper>
        <Image
          src={userAuth?.photoURL || '/hacker.png'}
          alt="유저 사진"
          width={'100%'}
          height={'100%'}
        />
      </RoundedImageWrapper>
      <p>
        <i>{user.email}</i>
      </p>
      <h1>{user.username || '등록되지 않은 유저'}</h1>
    </div>
  ) : (
    <div>유저를 찾지 못했습니다.</div>
  )
}

export default UserProfile
