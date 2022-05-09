import { FC } from 'react'
import { FlexCenterDiv } from '../../common/uiComponents'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import StarsIcon from '@mui/icons-material/Stars'

interface Props {
  username: string
}
const AccountIconName: FC<Props> = ({ username }) => {
  return (
    <FlexCenterDiv style={{ gap: '2px', alignItems: 'center' }}>
      {username === '인크라우' ? (
        <StarsIcon style={{ fontSize: '16px', color: 'darksalmon' }} />
      ) : (
        <AccountBoxIcon
          style={{
            fontSize: '17px',
            color: 'lightslategray',
            marginTop: '0.5px'
          }}
        />
      )}

      <div>{username}</div>
    </FlexCenterDiv>
  )
}

export default AccountIconName
