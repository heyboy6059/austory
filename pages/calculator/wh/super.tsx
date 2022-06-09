import Box from '@mui/material/Box'
import { FC, useState, useCallback } from 'react'
import { FlexCenterDiv, GridDiv } from '../../../common/uiComponents'
import CurrencyInput from 'react-currency-input-field'
import Stack from '@mui/material/Stack'
import styled from 'styled-components'
import { COLOURS } from '../../../common/constants'
import Button from '@mui/material/Button'

const LabelWrapper = styled.div`
  text-align: center;
`
const Super: FC = () => {
  const [gross, setGross] = useState(0)
  const [taxWithheld, setTaxWithheld] = useState(0)
  const [estimatedTaxAmount, setEstimatedTaxAmount] = useState(0)

  console.log({ estimatedTaxAmount })
  const estimateTaxAmount = useCallback(() => {
    //TEMP
    console.log({ gross })
    console.log({ taxWithheld })
    setEstimatedTaxAmount(gross * 0.3 - taxWithheld)
  }, [gross, taxWithheld])

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        <GridDiv style={{ gridTemplateColumns: '100px 1fr' }}>
          <FlexCenterDiv>
            <LabelWrapper>
              <div>총 수입</div>
              <div>
                <small>Gross Income</small>
              </div>
            </LabelWrapper>
          </FlexCenterDiv>
          <CurrencyInput
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
            placeholder="금액을 입력해주세요"
            prefix="$"
            // step={1}
          />
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
          <CurrencyInput
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
            placeholder="금액을 입력해주세요"
            prefix="$"
            // step={1}
          />
        </GridDiv>
        <FlexCenterDiv style={{ margin: '25px 10px 0px 10px' }}>
          <Button variant="contained" onClick={() => estimateTaxAmount()}>
            계산하기
          </Button>
        </FlexCenterDiv>
        <GridDiv
        // style={{ gridTemplateColumns: '140px 1fr' }}
        >
          <FlexCenterDiv>
            <h1
              style={{
                color: COLOURS.PRIMARY_BLUE,
                marginBottom: '5px',
                marginTop: '10px'
              }}
            >
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'

                // These options are needed to round to whole numbers if that's what you want.
                //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
                //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
              }).format(estimatedTaxAmount)}
            </h1>
          </FlexCenterDiv>
          <FlexCenterDiv>
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

export default Super
