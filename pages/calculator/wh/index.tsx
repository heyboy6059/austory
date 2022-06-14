import { FC, useState, SyntheticEvent } from 'react'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import InfoIcon from '@mui/icons-material/Info'
import { FlexCenterDiv } from '../../../common/uiComponents'
import { FcCalculator } from 'react-icons/fc'
import CurrencyInput from 'react-currency-input-field'
import TaxReturn from './taxReturn'
import styled from 'styled-components'
import Tax from './tax'
import { CALCULATOR_AD_SLOT_ID, COLOURS } from '../../../common/constants'
import AdSense from '../../../components/AdSense/AdSense'
import Link from 'next/link'

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

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <FlexCenterDiv style={{ marginTop: '10px' }}>
        <FcCalculator fontSize={24} />
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          워킹홀리데이 세금/환급 계산기
        </Typography>
      </FlexCenterDiv>
      <Tabs value={value} onChange={handleChange} variant="fullWidth" centered>
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
  )
}

export default WorkingHolidayCalculator
