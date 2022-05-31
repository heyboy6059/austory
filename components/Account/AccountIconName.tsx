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
import Tooltip from '@mui/material/Tooltip'

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
        <Tooltip title="파트너 에디터" placement="bottom" arrow>
          <LocalPoliceIcon
            style={{
              fontSize: '17px',
              color: COLOURS.BRIGHT_GREEN,
              marginTop: '0.5px'
            }}
          />
        </Tooltip>
      ) : role === Role.WORKER ? (
        <Tooltip title="직장인" placement="bottom" arrow>
          <WorkIcon
            style={{
              fontSize: '17px',
              color: COLOURS.PRIMARY_BLUE,
              marginTop: '0.5px'
            }}
          />
        </Tooltip>
      ) : role === Role.STUDENT ? (
        <Tooltip title="학생" placement="bottom" arrow>
          <MenuBookIcon
            style={{
              fontSize: '17px',
              color: COLOURS.PRIMARY_BLUE,
              marginTop: '0.5px'
            }}
          />
        </Tooltip>
      ) : role === Role.WORKING_HOLIDAY ? (
        <Tooltip title="워홀러" placement="bottom" arrow>
          <LocalAirportIcon
            style={{
              fontSize: '17px',
              color: COLOURS.PRIMARY_BLUE,
              marginTop: '0.5px'
            }}
          />
        </Tooltip>
      ) : role === Role.BUSINESS ? (
        <Tooltip title="비즈니스" placement="bottom" arrow>
          <BusinessIcon
            style={{
              fontSize: '17px',
              color: COLOURS.PRIMARY_BLUE,
              marginTop: '0.5px'
            }}
          />
        </Tooltip>
      ) : role === Role.FREE_MAN ? (
        <Tooltip title="자유인" placement="bottom" arrow>
          <SkateboardingIcon
            style={{
              fontSize: '18px',
              color: COLOURS.LIGHT_PURPLE,
              marginTop: '0.5px'
            }}
          />
        </Tooltip>
      ) : role === Role.MYSTIC ? (
        <Tooltip title="신비주의" placement="bottom" arrow>
          <AirIcon
            style={{
              fontSize: '18px',
              color: COLOURS.LIGHT_PURPLE,
              marginTop: '0.5px'
            }}
          />
        </Tooltip>
      ) : (
        // handling undefined
        // Role.BASE
        <Tooltip title="일반인" placement="bottom" arrow>
          <AccountBoxIcon
            style={{
              fontSize: '17px',
              color: 'lightslategray',
              marginTop: '0.5px'
            }}
          />
        </Tooltip>
      )}
      <div style={{ color: COLOURS.SECONDARY_SPACE_GREY, fontSize: '0.85rem' }}>
        {username}
      </div>
    </FlexCenterDiv>
  )
}

export default AccountIconName
