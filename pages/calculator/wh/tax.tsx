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
        </GridDiv>
        {/* <GridDiv style={{ gridTemplateColumns: '100px 1fr' }}>
          <FlexCenterDiv>
            <LabelWrapper>
              <div>이미 낸 세금</div>
              <div>
                <small>Tax withheld</small>
              </div>
            </LabelWrapper>
          </FlexCenterDiv>
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
        </GridDiv> */}
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
