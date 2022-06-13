import Box from '@mui/material/Box'
import { FC, useState, useCallback } from 'react'
import { FlexCenterDiv, GridDiv } from '../../../common/uiComponents'
import Stack from '@mui/material/Stack'
import { COLOURS, TEMP_KOR_AUS_RATE } from '../../../common/constants'
import Button from '@mui/material/Button'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { FinancialYear, FinancialYears } from '../../../typing/enums'
import { CustomCurrencyInput, KoreanWonLabel, LabelWrapper } from '.'
import { calculateWHTax, currencyFormatter } from '../../../common/functions'
import TaxInputBox from '../../../components/Calculator/TaxInputBox'

const TaxReturn: FC = () => {
  const [gross, setGross] = useState(null)
  const [taxWithheld, setTaxWithheld] = useState(null)
  const [estimatedTaxReturnAmount, setEstimatedTaxReturnAmount] = useState(0)
  const [financialYear, setFinancialYear] = useState(FinancialYear.FY_2020_2021)

  const estimateTaxAmount = useCallback(() => {
    const taxReturnAmount = calculateWHTax(gross, true, taxWithheld)
    setEstimatedTaxReturnAmount(taxReturnAmount)
  }, [gross, taxWithheld])

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={1}>
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
        <TaxInputBox
          labels={{
            koreanTitle: '이미 낸 세금',
            englishSubTitle: 'Tax Withheld'
          }}
          inputField={
            <CustomCurrencyInput
              id="taxWithheldCurrencyInput"
              name="taxWithheldCurrencyInput"
              value={taxWithheld}
              onValueChange={(
                value
                // , _, values
              ) => {
                if (!value) {
                  setTaxWithheld(Number(0))
                  return
                }
                setTaxWithheld(Number(value))
              }}
              placeholder="$"
              prefix="$"
              // step={1}
            />
          }
          koreanWon={taxWithheld}
          infoTitle="이미 낸 세금 (Tax Withheld)"
          infoContent={
            <div>고용주가 급여 지급시 미리 뗴어내어 국세청에 낸 세금</div>
          }
        />
        <FlexCenterDiv style={{ margin: '25px 10px 0px 10px' }}>
          <Button variant="contained" onClick={() => estimateTaxAmount()}>
            계산하기
          </Button>
        </FlexCenterDiv>
        <GridDiv
        // style={{ gridTemplateColumns: '140px 1fr' }}
        >
          <div>
            <FlexCenterDiv>
              <h1
                style={{
                  color: COLOURS.PRIMARY_BLUE,
                  marginBottom: '0px',
                  marginTop: '10px'
                }}
              >
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'

                  // These options are needed to round to whole numbers if that's what you want.
                  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
                  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
                }).format(estimatedTaxReturnAmount)}
              </h1>
            </FlexCenterDiv>
            <FlexCenterDiv>
              <KoreanWonLabel style={{ textAlign: 'center' }}>
                {estimatedTaxReturnAmount ? (
                  <>
                    한화 약{' '}
                    {currencyFormatter(
                      estimatedTaxReturnAmount * TEMP_KOR_AUS_RATE,
                      'KOR'
                    )}
                  </>
                ) : (
                  // <span style={{ color: 'white' }}>0</span>
                  ''
                )}
              </KoreanWonLabel>
            </FlexCenterDiv>
          </div>
          <FlexCenterDiv style={{ marginTop: '8px' }}>
            <LabelWrapper>
              <div>예상 세금 환급액</div>
              <div>
                <small>Estimated tax refund</small>
              </div>
            </LabelWrapper>
          </FlexCenterDiv>
        </GridDiv>
      </Stack>
    </Box>
  )
}

export default TaxReturn
