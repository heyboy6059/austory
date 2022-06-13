import Box from '@mui/material/Box'
import { FC, useState, useCallback } from 'react'
import { FlexCenterDiv, GridDiv } from '../../../common/uiComponents'
import Stack from '@mui/material/Stack'
import { COLOURS } from '../../../common/constants'
import Button from '@mui/material/Button'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { FinancialYear, FinancialYears } from '../../../typing/enums'
import { CustomCurrencyInput, LabelWrapper } from '.'
import { calculateWHTax } from '../../../common/functions'
import TaxInputBox from '../../../components/Calculator/TaxInputBox'

const Tax: FC = () => {
  const [gross, setGross] = useState(null)
  //   const [taxWithheld, setTaxWithheld] = useState(null)
  const [estimatedTax, setEstimatedTax] = useState(0)
  const [estimatedActualIncome, setEstimatedActualIncome] = useState(0)
  const [financialYear, setFinancialYear] = useState(FinancialYear.FY_2020_2021)

  const estimateTaxAmount = useCallback(() => {
    const taxReturnAmount = calculateWHTax(gross, false)
    setEstimatedTax(taxReturnAmount)
    setEstimatedActualIncome(gross - taxReturnAmount)
  }, [gross])

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        <TaxInputBox
          labels={{
            koreanTitle: '회계년도',
            englishSubTitle: 'Financial Year'
          }}
          inputField={
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
              style={{ height: '30px' }}
            >
              {FinancialYears.map(fy => (
                <MenuItem value={fy} key={fy}>
                  {fy}
                </MenuItem>
              ))}
            </Select>
          }
          infoTitle="회계년도 (Financial Year)"
          infoContent={
            <div>
              <div>
                호주의 회계년도는 지난해 7월 1일 부터 올해 6월 30일까지 입니다.
              </div>
              <div>
                <small>예) 2021-2022 = 2021년 7월 1일 - 2022년 6월 30일</small>
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
    </Box>
  )
}

export default Tax
