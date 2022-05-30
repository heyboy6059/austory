import { FC } from 'react'
import { FlexCenterDiv } from '../../common/uiComponents'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import StarsIcon from '@mui/icons-material/Stars'
import LocalPoliceIcon from '@mui/icons-material/LocalPolice'
import WorkIcon from '@mui/icons-material/Work'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import LocalAirportIcon from '@mui/icons-material/LocalAirport'
import BusinessIcon from '@mui/icons-material/Business'
import AirIcon from '@mui/icons-material/Air'
import SkateboardingIcon from '@mui/icons-material/Skateboarding'
import { COLOURS } from '../../common/constants'
import { Role } from '../../typing/interfaces'

interface Props {
  username: string
  role?: Role
}
const AccountIconName: FC<Props> = ({ username, role }) => {
  return (
    <FlexCenterDiv style={{ gap: '2px', alignItems: 'center' }}>
      {username === '인크라우' ? (
        <StarsIcon style={{ fontSize: '16px', color: 'darksalmon' }} />
      ) : role === Role.PARTNER ? (
        <LocalPoliceIcon
          style={{
            fontSize: '17px',
            color: COLOURS.BRIGHT_GREEN,
            marginTop: '0.5px'
          }}
        />
      ) : role === Role.WORKER ? (
        <WorkIcon
          style={{
            fontSize: '17px',
            color: COLOURS.PRIMARY_BLUE,
            marginTop: '0.5px'
          }}
        />
      ) : role === Role.STUDENT ? (
        <MenuBookIcon
          style={{
            fontSize: '17px',
            color: COLOURS.PRIMARY_BLUE,
            marginTop: '0.5px'
          }}
        />
      ) : role === Role.WORKING_HOLIDAY ? (
        <LocalAirportIcon
          style={{
            fontSize: '17px',
            color: COLOURS.PRIMARY_BLUE,
            marginTop: '0.5px'
          }}
        />
      ) : role === Role.BUSINESS ? (
        <BusinessIcon
          style={{
            fontSize: '17px',
            color: COLOURS.PRIMARY_BLUE,
            marginTop: '0.5px'
          }}
        />
      ) : role === Role.FREE_MAN ? (
        <SkateboardingIcon
          style={{
            fontSize: '18px',
            color: COLOURS.LIGHT_PURPLE,
            marginTop: '0.5px'
          }}
        />
      ) : role === Role.MYSTIC ? (
        <AirIcon
          style={{
            fontSize: '18px',
            color: COLOURS.LIGHT_PURPLE,
            marginTop: '0.5px'
          }}
        />
      ) : (
        // handling undefined
        // Role.BASE
        <AccountBoxIcon
          style={{
            fontSize: '17px',
            color: 'lightslategray',
            marginTop: '0.5px'
          }}
        />
      )}
      <div style={{ color: COLOURS.SECONDARY_SPACE_GREY, fontSize: '0.85rem' }}>
        {username}
      </div>
    </FlexCenterDiv>
  )
}

export default AccountIconName
