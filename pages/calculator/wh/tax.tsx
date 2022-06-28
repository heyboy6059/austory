import Box from '@mui/material/Box'
import { FC, useState, useCallback, useContext } from 'react'
import { FlexCenterDiv, GridDiv } from '../../../common/uiComponents'
import Stack from '@mui/material/Stack'
import { COLOURS, GUEST_UID } from '../../../common/constants'
import Button from '@mui/material/Button'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import {
  CalculatorLogType,
  Feature,
  FinancialYear,
  FinancialYears
} from '../../../typing/enums'
import { CustomCurrencyInput, LabelWrapper, TaxDisclaimer } from '.'
import { calculateWHTax } from '../../../common/functions'
import TaxInputBox from '../../../components/Calculator/TaxInputBox'
import { insertCalculatorLog } from '../../../common/insert'
import { UserContext } from '../../../common/context'
import dayjs from 'dayjs'
import { updateFeatureDetail } from '../../../common/update'
import Tooltip from '@mui/material/Tooltip'
import TableViewIcon from '@mui/icons-material/TableView'
import WhTaxRateDialog from '../../../components/Dialog/WhTaxRateDialog'

const Tax: FC = () => {
  const { user } = useContext(UserContext)
  const [gross, setGross] = useState(null)
  const [estimatedTax, setEstimatedTax] = useState(0)
  const [estimatedActualIncome, setEstimatedActualIncome] = useState(0)
  const [financialYear, setFinancialYear] = useState(FinancialYear.FY_2021_2022)
  const [taxRateTableOpen, setTaxRateTableOpen] = useState(false)

  const estimateTaxAmount = useCallback(() => {
    const taxReturnAmount = calculateWHTax(gross, false)
    setEstimatedTax(taxReturnAmount)
    setEstimatedActualIncome(gross - taxReturnAmount)
    try {
      insertCalculatorLog(
        user?.email || GUEST_UID,
        CalculatorLogType.WH_TAX,
        JSON.stringify({
          user: user || GUEST_UID,
          financialYear,
          gross,
          estimatedTax: taxReturnAmount,
          estimatedActualIncome: gross - taxReturnAmount,
          calculatedAt: dayjs().format()
        }),
        user?.uid || GUEST_UID
      )

      // update submit count
      updateFeatureDetail(Feature.WH_TAX, null, 1)
    } catch (err) {
      // no throwing error
      console.error(`ERROR in insertCalculatorLog. ${err.message}`)
    }
  }, [financialYear, gross, user])

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        <TaxInputBox
          labels={{
            koreanTitle: '회계년도',
            englishSubTitle: 'Financial Year'
          }}
          inputField={
            <GridDiv style={{ gridTemplateColumns: '1fr 40px', gap: '4px' }}>
              <Select
                labelId="tax-financial-year-select-label"
                id="tax-financial-year-order-select"
                value={financialYear}
                onChange={(event: SelectChangeEvent) => {
                  const fy = event.target.value as FinancialYear
                  setFinancialYear(fy)
                }}
                size="small"
                fullWidth
                style={{ height: '40px', backgroundColor: 'white' }}
              >
                {FinancialYears.map(fy => (
                  <MenuItem value={fy} key={fy}>
                    {fy}
                  </MenuItem>
                ))}
              </Select>
              <FlexCenterDiv>
                <Tooltip title="소득세율표" placement="bottom" arrow>
                  <TableViewIcon
                    fontSize="medium"
                    color="primary"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setTaxRateTableOpen(true)}
                  />
                </Tooltip>
              </FlexCenterDiv>
            </GridDiv>
          }
          infoTitle="회계년도 (Financial Year)"
          infoContent={
            <div>
              <div>
                호주의 회계년도는 지난해 7월 1일 부터 올해 6월 30일까지 입니다.
              </div>
              <div style={{ paddingLeft: '8px' }}>
                <small>
                  예) FY 2021-2022 = 2021년 7월 1일 ~ 2022년 6월 30일
                </small>
              </div>
            </div>
          }
        />
        <TaxInputBox
          labels={{
            koreanTitle: '총 수입',
            englishSubTitle: 'Gross Income'
          }}
          inputField={
            <CustomCurrencyInput
              id="grossIncomeCurrencyInput"
              name="grossIncomeCurrencyInput"
              value={gross}
              onValueChange={(
                value
                // , _, values
              ) => {
                if (!value) {
                  setGross(Number(0))
                  return
                }
                setGross(Number(value))
              }}
              placeholder="$"
              prefix="$"
              // step={1}
            />
          }
          koreanWon={gross}
          infoTitle="총 수입 (Gross Income)"
          infoContent={
            <div>세금을 포함하고, 연금은 제외한 1년간의 총 수입</div>
          }
        />
        <FlexCenterDiv style={{ margin: '25px 10px 0px 10px' }}>
          <Button variant="contained" onClick={() => estimateTaxAmount()}>
            계산하기
          </Button>
        </FlexCenterDiv>
        <GridDiv>
          <FlexCenterDiv>
            <h1
              style={{
                color: COLOURS.SECONDARY_BLUE,
                marginBottom: '5px',
                marginTop: '10px'
              }}
            >
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(estimatedTax)}
            </h1>
          </FlexCenterDiv>
          <FlexCenterDiv>
            <LabelWrapper>
              <div>예상 세금</div>
              <div>
                <small>Estimated Tax</small>
              </div>
            </LabelWrapper>
          </FlexCenterDiv>
        </GridDiv>
        <GridDiv>
          <FlexCenterDiv>
            <h1
              style={{
                color: COLOURS.PRIMARY_BLUE,
                marginBottom: '5px',
                marginTop: '0px'
              }}
            >
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(estimatedActualIncome)}
            </h1>
          </FlexCenterDiv>
          <FlexCenterDiv>
            <LabelWrapper>
              <div>예상 순수입</div>
              <div>
                <small>Estimated Actual Income</small>
              </div>
            </LabelWrapper>
          </FlexCenterDiv>
        </GridDiv>
      </Stack>
      {TaxDisclaimer}
      {taxRateTableOpen && (
        <WhTaxRateDialog
          open={taxRateTableOpen}
          setOpen={setTaxRateTableOpen}
          financialYear={financialYear}
        />
      )}
    </Box>
  )
}

export default Tax
