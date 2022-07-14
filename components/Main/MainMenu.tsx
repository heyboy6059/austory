import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useRouter } from 'next/router'
import { FC, SyntheticEvent } from 'react'
import { FcCalculator, FcHome, FcCollaboration } from 'react-icons/fc'
import {
  FlexCenterDiv,
  FlexSpaceBetweenCenter
} from '../../common/uiComponents'
import { MainMenuTab } from '../../typing/enums'
import { useMainMenu } from '../Context/MainMenu'

function a11yProps(index: number) {
  return {
    id: `main-menu-tab-${index}`,
    'aria-controls': `main-menu-tabpanel-${index}`
  }
}

const MainMenu: FC = () => {
  const router = useRouter()
  const {
    selectedMainMenuTab: selectedMainMenuTab,
    setSelectedMainMenuTab: setSelectedMainMenuTab
  } = useMainMenu()

  const handleTab = (event: SyntheticEvent, newValue: MainMenuTab) => {
    setSelectedMainMenuTab(newValue)
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          // borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <FlexSpaceBetweenCenter>
          <Tabs
            value={selectedMainMenuTab}
            onChange={handleTab}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="main menu tabs"
            style={{ minHeight: '0', padding: '0', height: '44px' }}
            variant="scrollable"
            scrollButtons="auto"
          >
            {/* <Tab
              label={
                <FlexCenterDiv style={{ gap: '4px' }}>
                  <FcCollaboration fontSize={17} />
                  <div>
                    <strong>호주 데이터</strong>
                  </div>
                </FlexCenterDiv>
              }
              {...a11yProps(0)}
              style={{ padding: '10px 10px' }}
              value={MainMenuTab.COMMUNITY}
              onClick={() => router.push(`/`)}
            /> */}
            <Tab
              label={
                <FlexCenterDiv style={{ gap: '4px' }}>
                  <FcCollaboration fontSize={17} />
                  <div>
                    <strong>호주 소식</strong>
                  </div>
                </FlexCenterDiv>
              }
              {...a11yProps(0)}
              style={{ padding: '10px 10px' }}
              value={MainMenuTab.COMMUNITY}
              onClick={() => router.push(`/`)}
            />
            <Tab
              label={
                <FlexCenterDiv style={{ gap: '4px' }}>
                  <FcHome fontSize={17} />
                  <div>
                    <strong>부동산 트랜드</strong>
                  </div>
                </FlexCenterDiv>
              }
              {...a11yProps(1)}
              style={{ padding: '10px 6px' }}
              value={MainMenuTab.HOUSE_PRICE}
              onClick={() => router.push(`/houseprice`)}
            />
            <Tab
              label={
                <FlexCenterDiv style={{ gap: '4px' }}>
                  <FcCalculator fontSize={17} />
                  <div>
                    <strong>워홀 세금 계산기</strong>
                  </div>
                </FlexCenterDiv>
              }
              {...a11yProps(2)}
              style={{ padding: '10px 6px' }}
              value={MainMenuTab.WH_TAX_CAL}
              onClick={() => router.push(`/calculator/wh`)}
            />
          </Tabs>
        </FlexSpaceBetweenCenter>
      </Box>
    </Box>
  )
}

export default MainMenu
