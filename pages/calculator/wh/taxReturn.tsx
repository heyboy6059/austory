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
        <GridDiv
          style={{ gridTemplateColumns: '100px 1fr', alignItems: 'center' }}
        >
          <FlexCenterDiv>
            <LabelWrapper>
              <div>회계년도</div>
              <div>
                <small>Financial Year</small>
              </div>
            </LabelWrapper>
          </FlexCenterDiv>
          <Select
            labelId="comment-order-select-label"
            id="comment-order-select"
            value={financialYear}
            onChange={(event: SelectChangeEvent) => {
              const fy = event.target.value as FinancialYear
              setFinancialYear(fy)
            }}
            size="small"
            style={{ height: '30px' }}
          >
            {FinancialYears.map(fy => (
              <MenuItem value={fy} key={fy}>
                {fy}
              </MenuItem>
            ))}
          </Select>
        </GridDiv>
        <GridDiv style={{ gridTemplateColumns: '100px 1fr' }}>
          <FlexCenterDiv>
            <LabelWrapper>
              <div>총 수입</div>
              <div>
                <small>Gross Income</small>
              </div>
            </LabelWrapper>
          </FlexCenterDiv>
          <div>
            <CustomCurrencyInput
              id="validationCustom01"
              name="input-1"
              // className={`form-control ${className}`}
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
            <KoreanWonLabel>
              {gross ? (
                <>
                  한화 약{currencyFormatter(gross * TEMP_KOR_AUS_RATE, 'KOR')}
                </>
              ) : (
                ''
              )}
            </KoreanWonLabel>
          </div>
        </GridDiv>
        <GridDiv style={{ gridTemplateColumns: '100px 1fr' }}>
          <FlexCenterDiv>
            <LabelWrapper>
              <div>이미 낸 세금</div>
              <div>
                <small>Tax withheld</small>
              </div>
            </LabelWrapper>
          </FlexCenterDiv>
          <div>
            <CustomCurrencyInput
              id="validationCustom01"
              name="input-1"
              // className={`form-control ${className}`}
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
            <KoreanWonLabel>
              {taxWithheld ? (
                <>
                  한화 약
                  {currencyFormatter(taxWithheld * TEMP_KOR_AUS_RATE, 'KOR')}
                </>
              ) : (
                ''
              )}
            </KoreanWonLabel>
          </div>
        </GridDiv>
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
