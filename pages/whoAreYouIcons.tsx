import { FC } from 'react'
import { FlexCenterDiv } from '../common/uiComponents'
import AccountIconName from '../components/Account/AccountIconName'
import { FULL_ROLE_ITEMS_LIST } from '../typing/interfaces'
const WhoAreYouIcons: FC = () => {
  return (
    <div>
      <FlexCenterDiv style={{ margin: '10px' }}>
        등급별 아이콘 테스트
      </FlexCenterDiv>
      <div>
        {FULL_ROLE_ITEMS_LIST.map(roleItem => (
          <AccountIconName
            key={roleItem.role}
            username={roleItem.label}
            role={roleItem.role}
          />
        ))}
      </div>
    </div>
  )
}

export default WhoAreYouIcons
