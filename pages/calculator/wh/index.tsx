import {
  FC,
  useState,
  SyntheticEvent,
  useEffect,
  useContext,
  useCallback
} from 'react'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import InfoIcon from '@mui/icons-material/Info'
import {
  FlexCenterDiv,
  FlexVerticalCenterDiv
} from '../../../common/uiComponents'
import { FcCalculator } from 'react-icons/fc'
import CurrencyInput from 'react-currency-input-field'
import TaxReturn from './taxReturn'
import styled from 'styled-components'
import Tax from './tax'
import {
  CALCULATOR_AD_SLOT_ID,
  COLOURS,
  ROOT_INKRAU_URL
} from '../../../common/constants'
import AdSense from '../../../components/AdSense/AdSense'
import Link from 'next/link'
import { Feature, MainMenuTab } from '../../../typing/enums'
import { insertFeatureView } from '../../../common/insert'
import { updateFeatureDetail } from '../../../common/update'
import { AiOutlineEye } from 'react-icons/ai'
import { HiCursorClick } from 'react-icons/hi'
import { getFeatureDetail } from '../../../common/get'
import { UserContext } from '../../../common/context'
import Metatags from '../../../components/Metatags'
import Chip from '@mui/material/Chip'
import { useMainMenu } from '../../../components/Context/MainMenu'

export const LabelWrapper = styled.div`
  text-align: center;
`

export const CustomCurrencyInput = styled(CurrencyInput)`
  height: 40px;
  border: 1px solid lightgray;
  border-radius: 5px;
  font-size: 1.2rem;
`

export const KoreanWonLabel = styled.div`
  font-size: 12px;
  text-align: right;
  color: slategrey;
`

export const CustomInfoIcon = styled(InfoIcon)`
  font-size: 15px;
  color: ${COLOURS.BRIGHT_GREEN};
  cursor: pointer;
`

export const TaxDisclaimer = (
  <div>
    <FlexCenterDiv style={{ marginTop: '15px' }}>
      <Chip
        label="호주 국세청(ATO) 세금 관련 한국어 안내"
        component="a"
        href="https://www.ato.gov.au/General/Other-languages/In-detail/Korean/Tax-and-super-in-Australia---what-you-need-to-know---Korean/?anchor=Lodgingyourfirsttaxreturn1#Lodgingyourfirsttaxreturn1"
        variant="outlined"
        target="_blank"
        clickable
      />
    </FlexCenterDiv>
    <div
      style={{
        fontSize: '10px',
        margin: '10px 5px 0px 5px',
        color: COLOURS.TEXT_GREY
      }}
    >
      위 계산 금액은 개인의 현재 고용 상황과 재정 현황에 따라 약간씩 다를수
      있습니다. 참고용으로 사용해주세요.
      <div>
        자료출처:{' '}
        <Link
          href="https://www.ato.gov.au/rates/schedule-15---tax-table-for-working-holiday-makers/"
          passHref
        >
          <a target="_blank">
            ATO Schedule 15 – Tax table for working holiday makers
          </a>
        </Link>
      </div>
    </div>
  </div>
)

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
}

interface TabPanelProps {
  children?: React.ReactNode
  dir?: string
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const WorkingHolidayCalculator: FC = () => {
  const theme = useTheme()
  const [value, setValue] = useState(0)
  const { selectedMainMenuTab, setSelectedMainMenuTab } = useMainMenu()
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const { isAdmin } = useContext(UserContext)

  const [viewCountTotal, setViewCountTotal] = useState(0)
  const [submitCountTotal, setSubmitCountTotal] = useState(0)

  const featureCountHandler = useCallback(async () => {
    insertFeatureView(Feature.WH_TAX)
    await updateFeatureDetail(Feature.WH_TAX, 1)
    const featureDetail = await getFeatureDetail(Feature.WH_TAX)
    if (featureDetail.viewCountTotal) {
      setViewCountTotal(featureDetail.viewCountTotal)
    }
    if (featureDetail.submitCountTotal) {
      setSubmitCountTotal(featureDetail.submitCountTotal)
    }
  }, [])

  useEffect(() => {
    if (selectedMainMenuTab !== MainMenuTab.WH_TAX_CAL) {
      console.log('update mainMenuTab WH_TAX_CAL in useEffect')
      setSelectedMainMenuTab(MainMenuTab.WH_TAX_CAL)
    }
    featureCountHandler()
    console.log('featureCountHandler in useEffect')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Metatags
        title={`호주 워홀 세금/환급 계산기 - 인크라우`}
        description={`호주 워킹 홀리데이 워홀러 세금 계산기 환급 계산기`}
        type="website"
        link={`${ROOT_INKRAU_URL}/calculator/wh`}
      />
      <Box sx={{ width: '100%' }}>
        {isAdmin ? (
          <FlexCenterDiv style={{ justifyContent: 'right', gap: '10px' }}>
            <FlexVerticalCenterDiv>
              <AiOutlineEye
                fontSize={14}
                style={{
                  marginRight: '1px',
                  marginTop: '1px',
                  color: COLOURS.PRIMARY_SPACE_GREY
                }}
              />
              <span
                style={{
                  fontSize: '12px',
                  color: COLOURS.SECONDARY_SPACE_GREY
                }}
              >
                {viewCountTotal}
              </span>
            </FlexVerticalCenterDiv>
            <FlexVerticalCenterDiv>
              <HiCursorClick
                fontSize={14}
                style={{
                  color: COLOURS.PRIMARY_SPACE_GREY
                }}
              />
              <span
                style={{
                  fontSize: '12px',
                  color: COLOURS.SECONDARY_SPACE_GREY
                }}
              >
                {submitCountTotal}
              </span>
            </FlexVerticalCenterDiv>
          </FlexCenterDiv>
        ) : (
          <></>
        )}

        <FlexCenterDiv style={{ marginTop: '10px' }}>
          <FcCalculator fontSize={24} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            워킹홀리데이 세금/환급 계산기
          </Typography>
        </FlexCenterDiv>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          centered
        >
          <Tab
            label={
              <Typography sx={{ fontWeight: 'bold' }}>
                환급<small style={{ fontSize: '10px' }}>(Tax Return)</small>
              </Typography>
            }
            {...a11yProps(0)}
          />
          <Tab
            label={
              <Typography sx={{ fontWeight: 'bold' }}>
                세금<small style={{ fontSize: '10px' }}>(Tax)</small>
              </Typography>
            }
            {...a11yProps(1)}
          />
        </Tabs>
        <TabPanel value={value} index={0} dir={theme.direction}>
          <TaxReturn />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Tax />
        </TabPanel>
        <div>
          <AdSense adSlotId={CALCULATOR_AD_SLOT_ID} />
        </div>
      </Box>
    </>
  )
}

export default WorkingHolidayCalculator
