import Box from '@mui/material/Box'
import { FC, useState, useCallback, useContext } from 'react'
import { FlexCenterDiv, GridDiv } from '../../../common/uiComponents'
import Stack from '@mui/material/Stack'
import {
  COLOURS,
  GUEST_UID,
  TEMP_KOR_AUS_RATE
} from '../../../common/constants'
import Button from '@mui/material/Button'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import {
  CalculatorLogType,
  Feature,
  FinancialYear,
  FinancialYears
} from '../../../typing/enums'
import {
  CustomCurrencyInput,
  KoreanWonLabel,
  LabelWrapper,
  TaxDisclaimer
} from '.'
import {
  calculateWHTax,
  roundUpKoreanWonValue
} from '../../../common/functions'
import TaxInputBox from '../../../components/Calculator/TaxInputBox'
import { insertCalculatorLog } from '../../../common/insert'
import { UserContext } from '../../../common/context'
import dayjs from 'dayjs'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'
import { updateFeatureDetail } from '../../../common/update'
import TableViewIcon from '@mui/icons-material/TableView'
import Tooltip from '@mui/material/Tooltip'
import WhTaxRateDialog from '../../../components/Dialog/WhTaxRateDialog'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import Menu from '@mui/material/Menu'
import CancelIcon from '@mui/icons-material/Cancel'
import { numToKorean, FormatOptions } from 'num-to-korean'

const TaxReturn: FC = () => {
  const { user } = useContext(UserContext)
  const [gross, setGross] = useState(null)
  const [taxWithheld, setTaxWithheld] = useState(null)
  const [estimatedTaxReturnAmount, setEstimatedTaxReturnAmount] = useState(0)
  const [financialYear, setFinancialYear] = useState(FinancialYear.FY_2022_2023)
  const [taxRateTableOpen, setTaxRateTableOpen] = useState(false)

  enum AddMenuItem {
    SECOND_JOB = 'secondJob',
    EXTRA_INCOME = 'extraIncome',
    DEDUCTION = 'deduction'
  }

  interface AddMenuStatus {
    enabled: boolean
    value: number
  }

  const [secondJobIncomeMenu, setSecondJobIncomeMenu] = useState<AddMenuStatus>(
    {
      enabled: false,
      value: null
    }
  )
  const [secondJobTaxMenu, setSecondJobTaxMenu] = useState<AddMenuStatus>({
    enabled: false,
    value: null
  })
  const [extraIncomeMenu, setExtraIncomeMenu] = useState<AddMenuStatus>({
    enabled: false,
    value: null
  })
  const [deductionMenu, setDeductionMenu] = useState<AddMenuStatus>({
    enabled: false,
    value: null
  })

  const [anchorEl, setAnchorEl] = useState<null | SVGSVGElement>(null)
  const addMenuOpen = Boolean(anchorEl)

  const handleAddMenu = (addMenuItem: AddMenuItem | null) => {
    setAnchorEl(null)
    if (addMenuItem === AddMenuItem.SECOND_JOB) {
      setSecondJobIncomeMenu(prev => ({ ...prev, enabled: !prev.enabled }))
      setSecondJobTaxMenu(prev => ({ ...prev, enabled: !prev.enabled }))
    }
    if (addMenuItem === AddMenuItem.EXTRA_INCOME) {
      setExtraIncomeMenu(prev => ({ ...prev, enabled: !prev.enabled }))
    }
    if (addMenuItem === AddMenuItem.DEDUCTION) {
      setDeductionMenu(prev => ({ ...prev, enabled: !prev.enabled }))
    }
  }

  const estimateTaxAmount = useCallback(() => {
    let grossTotal = gross
    // TODO: secondJob
    if (extraIncomeMenu.enabled) {
      grossTotal += extraIncomeMenu.value
    }
    if (deductionMenu.enabled) {
      grossTotal -= deductionMenu.value
    }
    const taxReturnAmount = calculateWHTax(grossTotal, true, taxWithheld)
    setEstimatedTaxReturnAmount(taxReturnAmount)
    try {
      insertCalculatorLog(
        user?.email || GUEST_UID,
        CalculatorLogType.WH_TAX_RETURN,
        JSON.stringify({
          user: user || GUEST_UID,
          financialYear,
          gross: grossTotal,
          taxWithheld,
          taxReturnAmount,
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
  }, [deductionMenu, extraIncomeMenu, financialYear, gross, taxWithheld, user])

  const korValueHandler = (dollarValue: number) => {
    const negative = dollarValue < 0
    const absDollarValue = Math.abs(dollarValue)
    // negative
    if (dollarValue < 0) {
    }
    const koreanWon = numToKorean(
      roundUpKoreanWonValue(absDollarValue * TEMP_KOR_AUS_RATE),
      FormatOptions.MIXED
    )

    return negative ? `-${koreanWon}` : koreanWon
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={1}>
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
            <div>
              <div>고용주가 급여 지급시 미리 떼어내어 국세청에 낸 세금</div>
              <FlexCenterDiv style={{ margin: '10px 4px 5px 8px', gap: '4px' }}>
                <FlexCenterDiv>
                  <TipsAndUpdatesIcon fontSize="small" color="warning" />
                </FlexCenterDiv>
                <FlexCenterDiv>
                  <small>
                    페이슬립(Payslip)에서 PAYG tax 부분을 확인해보세요.
                  </small>
                </FlexCenterDiv>
              </FlexCenterDiv>
            </div>
          }
        />

        {/**
         * TODO: temporarily disabled
         */}
        {secondJobIncomeMenu.enabled && (
          <>
            <TaxInputBox
              labels={{
                koreanTitle: '2nd 수입',
                englishSubTitle: '2nd Gross Income'
              }}
              inputField={
                <CustomCurrencyInput
                  id="2ndGrossIncomeCurrencyInput"
                  name="2ndGrossIncomeCurrencyInput"
                  value={secondJobIncomeMenu.value}
                  onValueChange={value => {
                    if (!value) {
                      setSecondJobIncomeMenu(prev => ({
                        ...prev,
                        value: Number(0)
                      }))
                      return
                    }
                    setSecondJobIncomeMenu(prev => ({
                      ...prev,
                      value: Number(value)
                    }))
                  }}
                  placeholder="$"
                  prefix="$"
                />
              }
              koreanWon={secondJobIncomeMenu.value}
              infoTitle="총 수입 (Gross Income)"
              infoContent={
                <div>세금을 포함하고, 연금은 제외한 1년간의 총 수입</div>
              }
            />
            <TaxInputBox
              labels={{
                koreanTitle: '2nd 세금',
                englishSubTitle: '2nd Tax Withheld'
              }}
              inputField={
                <CustomCurrencyInput
                  id="2ndTaxWithheldCurrencyInput"
                  name="2ndTaxWithheldCurrencyInput"
                  value={secondJobTaxMenu.value}
                  onValueChange={value => {
                    if (!value) {
                      setSecondJobTaxMenu(prev => ({
                        ...prev,
                        value: Number(0)
                      }))
                      return
                    }
                    setSecondJobTaxMenu(prev => ({
                      ...prev,
                      value: Number(value)
                    }))
                  }}
                  placeholder="$"
                  prefix="$"
                />
              }
              koreanWon={secondJobTaxMenu.value}
              infoTitle="이미 낸 세금 (Tax Withheld)"
              infoContent={
                <div>
                  <div>고용주가 급여 지급시 미리 떼어내어 국세청에 낸 세금</div>
                  <FlexCenterDiv
                    style={{ margin: '10px 4px 5px 8px', gap: '4px' }}
                  >
                    <FlexCenterDiv>
                      <TipsAndUpdatesIcon fontSize="small" color="warning" />
                    </FlexCenterDiv>
                    <FlexCenterDiv>
                      <small>
                        페이슬립(Payslip)에서 PAYG tax 부분을 확인해보세요.
                      </small>
                    </FlexCenterDiv>
                  </FlexCenterDiv>
                </div>
              }
            />
          </>
        )}

        {extraIncomeMenu.enabled && (
          <TaxInputBox
            labels={{
              koreanTitle: '추가 수입',
              englishSubTitle: 'Extra Income'
            }}
            inputField={
              <GridDiv style={{ gridTemplateColumns: '1fr 15px', gap: '4px' }}>
                <CustomCurrencyInput
                  id="extraIncomeCurrencyInput"
                  name="extraIncomeCurrencyInput"
                  value={extraIncomeMenu.value}
                  onValueChange={value => {
                    if (!value) {
                      setExtraIncomeMenu(prev => ({
                        ...prev,
                        value: Number(0)
                      }))
                      return
                    }
                    setExtraIncomeMenu(prev => ({
                      ...prev,
                      value: Number(value)
                    }))
                  }}
                  placeholder="$"
                  prefix="$"
                />
                <FlexCenterDiv>
                  <Tooltip title="계산에서 제외" placement="bottom" arrow>
                    <CancelIcon
                      fontSize="small"
                      style={{ color: COLOURS.HEART_RED, cursor: 'pointer' }}
                      onClick={() =>
                        setExtraIncomeMenu(prev => ({
                          ...prev,
                          enabled: false
                        }))
                      }
                    />
                  </Tooltip>
                </FlexCenterDiv>
              </GridDiv>
            }
            koreanWon={extraIncomeMenu.value}
            infoTitle="추가 수입 (Extra Income)"
            infoContent={
              <div>
                근로 소득을 제외한 추가 수입.
                <div>예) 은행 이자 수익, 주식 투자 수익 등</div>
              </div>
            }
          />
        )}

        {deductionMenu.enabled && (
          <TaxInputBox
            labels={{
              koreanTitle: '세금 공제',
              englishSubTitle: 'Deductions'
            }}
            inputField={
              <GridDiv style={{ gridTemplateColumns: '1fr 15px', gap: '4px' }}>
                <CustomCurrencyInput
                  id="deductionCurrencyInput"
                  name="deductionCurrencyInput"
                  value={deductionMenu.value}
                  onValueChange={value => {
                    if (!value) {
                      setDeductionMenu(prev => ({
                        ...prev,
                        value: Number(0)
                      }))
                      return
                    }
                    setDeductionMenu(prev => ({
                      ...prev,
                      value: Number(value)
                    }))
                  }}
                  placeholder="$"
                  prefix="$"
                />
                <FlexCenterDiv>
                  <Tooltip title="계산에서 제외" placement="bottom" arrow>
                    <CancelIcon
                      fontSize="small"
                      style={{ color: COLOURS.HEART_RED, cursor: 'pointer' }}
                      onClick={() =>
                        setDeductionMenu(prev => ({
                          ...prev,
                          enabled: false
                        }))
                      }
                    />
                  </Tooltip>
                </FlexCenterDiv>
              </GridDiv>
            }
            koreanWon={deductionMenu.value}
            infoTitle="소득 공제 (Deductions)"
            infoContent={
              <div>
                업무와 관련해서 지출한 비용. 소득을 얻는데 직접적인 관련이
                있어야 하고 증명할 기록이 있어야 합니다. (영수증, 은행 기록 등)
                <FlexCenterDiv
                  style={{ margin: '10px 4px 5px 8px', gap: '4px' }}
                >
                  <FlexCenterDiv>
                    <TipsAndUpdatesIcon fontSize="small" color="warning" />
                  </FlexCenterDiv>
                  <FlexCenterDiv>
                    <small>
                      예) 유니폼 세탁 비용, 장비 구입, 홈오피스, 업무 중 교통비,
                      회계관련 비용 등
                    </small>
                  </FlexCenterDiv>
                </FlexCenterDiv>
              </div>
            }
          />
        )}

        {!(extraIncomeMenu.enabled && deductionMenu.enabled) && (
          <FlexCenterDiv>
            <Tooltip title="추가하기" placement="bottom" arrow>
              <AddCircleIcon
                // fontSize="medium"
                style={{
                  fontSize: '26px',
                  color: COLOURS.BRIGHT_GREEN,
                  cursor: 'pointer'
                }}
                onClick={event => {
                  setAnchorEl(event.currentTarget)
                }}
              />
            </Tooltip>
            <Menu
              id="tax-extra-menu"
              anchorEl={anchorEl}
              open={addMenuOpen}
              onClose={() => handleAddMenu(null)}
              MenuListProps={{
                'aria-labelledby': 'tax-extra-menu-button'
              }}
            >
              {/* <MenuItem onClick={() => handleAddMenu(AddMenuItem.SECOND_JOB)}>
              2nd 일자리 수입/세금
            </MenuItem> */}
              {!extraIncomeMenu.enabled && (
                <MenuItem
                  onClick={() => handleAddMenu(AddMenuItem.EXTRA_INCOME)}
                >
                  추가 수입
                </MenuItem>
              )}
              {!deductionMenu.enabled && (
                <MenuItem onClick={() => handleAddMenu(AddMenuItem.DEDUCTION)}>
                  세금 공제액
                </MenuItem>
              )}
            </Menu>
          </FlexCenterDiv>
        )}
        <FlexCenterDiv style={{ margin: '20px 10px 0px 10px' }}>
          <Button variant="contained" onClick={() => estimateTaxAmount()}>
            계산하기
          </Button>
        </FlexCenterDiv>
        <GridDiv>
          <div>
            <FlexCenterDiv>
              <h1
                style={{
                  // surplus = blue / minus = red
                  color:
                    estimatedTaxReturnAmount >= 0
                      ? COLOURS.PRIMARY_BLUE
                      : COLOURS.HEART_RED,
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
                  <>한화 약 {korValueHandler(estimatedTaxReturnAmount)} 원</>
                ) : (
                  // <span style={{ color: 'white' }}>0</span>
                  ''
                )}
              </KoreanWonLabel>
            </FlexCenterDiv>
          </div>
          <FlexCenterDiv style={{ marginTop: '8px' }}>
            <LabelWrapper>
              <div>
                예상 세금{' '}
                <strong>
                  {estimatedTaxReturnAmount >= 0 ? '환급액' : '납부액'}
                </strong>
              </div>
              <div>
                <small>
                  Estimated{' '}
                  {estimatedTaxReturnAmount >= 0 ? 'tax refund' : 'tax payment'}{' '}
                </small>
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

export default TaxReturn
