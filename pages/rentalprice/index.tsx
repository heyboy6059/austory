import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import {
  FC,
  useState,
  SyntheticEvent,
  useEffect,
  useCallback,
  useMemo,
  useContext
} from 'react'
import styled from 'styled-components'
import { relabelDomainEmbeddedHtml } from '../../common/functions'
import HouseIcon from '@mui/icons-material/House'
import ApartmentIcon from '@mui/icons-material/Apartment'
import {
  getAllPropertyReportLabels,
  getAllPropertyReports,
  getFeatureDetail
} from '../../common/get'
import { PropertyReport, PropertyReportLabel } from '../../typing/interfaces'
import {
  Feature,
  HousePriceReportType,
  MainMenuTab,
  PropertyReportType
} from '../../typing/enums'
import CircularProgress from '@mui/material/CircularProgress'
import { FlexCenterDiv, FlexVerticalCenterDiv } from '../../common/uiComponents'
import { FcOrganization } from 'react-icons/fc'
import Typography from '@mui/material/Typography'
import toast from 'react-hot-toast'
import {
  COLOURS,
  GENERIC_KOREAN_ERROR_MESSAGE,
  HOUSE_PRICE_AD_SLOT_ID,
  ROOT_INKRAU_URL
} from '../../common/constants'
import Metatags from '../../components/Metatags'
import AdSense from '../../components/AdSense/AdSense'
import { insertFeatureView } from '../../common/insert'
import { updateFeatureDetail } from '../../common/update'
import { UserContext } from '../../common/context'
import { AiOutlineEye } from 'react-icons/ai'
import { useMainMenu } from '../../components/Context/MainMenu'

const LabelWrapper = styled.div`
  font-size: 12px;
`
const DomainTableWrapper = styled.div`
  overflow: auto;
  width: 100vw; // this is not the best solution
  max-width: 600px;
  display: flex;
  justify-content: center;
  font-size: 16px;
  table {
    width: 100%;
    padding: 5px;
    border-spacing: 0px;
    text-align: center;
  }
  thead {
    tr {
      background: #e0e0e0;
    }
    th {
      padding: 10px 2px;
    }
  }
  tr:nth-child(even) {
    background: #e8e8e8;
  }
  tr {
    box-shadow: inset 0 -1px #e9e6ef;
    th:nth-child(3) {
      display: none;
    }
    th:nth-child(4) {
      display: none;
    }
    td {
      padding: 12px 4px;
    }
    td:nth-child(3) {
      display: none;
    }
    td:nth-child(4) {
      display: none;
    }
  }
  .css-4knjz3 {
    display: flex;
    justify-content: center;
    gap: 6px;
  }
  .table_source {
    padding-left: 20px;
    margin-bottom: 10px;
  }
`

const RentalPrice: FC = () => {
  const { isAdmin } = useContext(UserContext)
  const { selectedMainMenuTab, setSelectedMainMenuTab } = useMainMenu()
  const [loading, setLoading] = useState(false)
  const [labelTabValue, setLabelTabValue] = useState('')
  const [houseUnitTabValue, setHouseUnitTabValue] = useState(
    HousePriceReportType.HOUSE
  )
  const [viewCountTotal, setViewCountTotal] = useState(0)
  const handleLabelTab = (event: SyntheticEvent, newValue: string) => {
    setLabelTabValue(newValue)
  }
  const handleHouseUnitTab = (
    event: SyntheticEvent,
    newValue: HousePriceReportType
  ) => {
    setHouseUnitTabValue(newValue)
  }

  const [allLabels, setAllLabels] = useState<PropertyReportLabel[]>([])
  const [allPropertyReports, setAllPropertyReports] = useState<
    PropertyReport[]
  >([])

  const getAllPropertyData = useCallback(async () => {
    setLoading(true)
    try {
      const labels = await getAllPropertyReportLabels(
        PropertyReportType.RENTAL_PRICE
      )
      const sortedLabels = labels.sort((a, b) => b.createdAt - a.createdAt)
      setLabelTabValue(sortedLabels[0].propertyReportLabelId)
      setAllLabels(sortedLabels)
      const reports = await getAllPropertyReports(
        PropertyReportType.RENTAL_PRICE
      )
      setAllPropertyReports(reports)
    } catch (err) {
      console.error(`Error in getAllPropertyData. ${err.message}`)
      toast.error(GENERIC_KOREAN_ERROR_MESSAGE)
    } finally {
      setLoading(false)
    }
  }, [])

  const featureCountHandler = useCallback(async () => {
    insertFeatureView(Feature.RENTAL_PRICE)
    await updateFeatureDetail(Feature.RENTAL_PRICE, 1)
    const featureDetail = await getFeatureDetail(Feature.RENTAL_PRICE)
    if (featureDetail.viewCountTotal) {
      setViewCountTotal(featureDetail.viewCountTotal)
    }
  }, [])

  useEffect(() => {
    if (selectedMainMenuTab !== MainMenuTab.RENTAL_PRICE) {
      setSelectedMainMenuTab(MainMenuTab.RENTAL_PRICE)
      console.log('update mainMenuTab RENTAL_PRICE in useEffect')
    }
    console.log('featureCountHandler in useEffect')
    featureCountHandler()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    console.log('getAllPropertyData in useEffect')
    getAllPropertyData()
  }, [getAllPropertyData])

  const embedHtml = useMemo(() => {
    if (allLabels && allPropertyReports) {
      const embedHtml = allPropertyReports.find(
        report =>
          report.propertyReportId === `${labelTabValue}-${houseUnitTabValue}`
      )?.embedHtml

      if (!embedHtml) return ''
      return relabelDomainEmbeddedHtml(embedHtml)
    }
    return ''
  }, [allLabels, allPropertyReports, houseUnitTabValue, labelTabValue])

  return (
    <>
      <Metatags
        title={`호주 부동산 렌트 가격 트랜드 리포트 - 인크라우`}
        description={`호주 지역별 부동산(하우스, 유닛) 렌트 가격 트랜드 리포트. 시드니, 멜번, 브리즈번, 아들레이드, 캔버라, 퍼스, 다윈, 호주 전역 부동산`}
        type="website"
        link={`${ROOT_INKRAU_URL}/rentalprice`}
      />
      <div
        style={{
          width: '100vw',
          maxWidth: '600px'
        }}
      >
        <FlexCenterDiv style={{ marginTop: '10px', gap: '10px' }}>
          <FcOrganization fontSize={24} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            렌트 주당 가격 트랜드 리포트
          </Typography>
          {isAdmin ? (
            <FlexCenterDiv
              style={{
                justifyContent: 'right',
                gap: '10px',
                marginRight: '10px'
              }}
            >
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
            </FlexCenterDiv>
          ) : (
            <></>
          )}
        </FlexCenterDiv>
        {loading ? (
          <FlexCenterDiv style={{ margin: '20px' }}>
            <CircularProgress />
          </FlexCenterDiv>
        ) : (
          <>
            <Box
              style={{
                width: '100%'
              }}
            >
              <Tabs
                value={labelTabValue}
                onChange={handleLabelTab}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="property-report-label-tab"
                textColor="secondary"
                indicatorColor="secondary"
              >
                {allLabels.map(label => (
                  <Tab
                    label={label.korLabel}
                    key={label.propertyReportLabelId}
                    value={label.propertyReportLabelId}
                  />
                ))}
              </Tabs>
            </Box>
            <Box style={{ width: '100%' }}>
              <Tabs
                value={houseUnitTabValue}
                onChange={handleHouseUnitTab}
                aria-label="house-unit-tab"
                variant="fullWidth"
                style={{ minHeight: '0', padding: '0', height: '44px' }}
                centered
              >
                <Tab
                  label={
                    <FlexCenterDiv style={{ gap: '6px' }}>
                      <HouseIcon />
                      <span>
                        <strong>하우스</strong>
                      </span>
                    </FlexCenterDiv>
                  }
                  value={HousePriceReportType.HOUSE}
                />
                <Tab
                  label={
                    <FlexCenterDiv style={{ gap: '6px' }}>
                      <ApartmentIcon />
                      <span>
                        <strong>유닛/아파트</strong>
                      </span>
                    </FlexCenterDiv>
                  }
                  value={HousePriceReportType.UNIT}
                />
              </Tabs>
            </Box>
            <DomainTableWrapper>
              {embedHtml ? (
                <div
                  dangerouslySetInnerHTML={{ __html: embedHtml }}
                  style={{ width: '100%' }}
                />
              ) : (
                <div>데이터가 없습니다.</div>
              )}
            </DomainTableWrapper>
            <div style={{ padding: '0px 10px' }}>
              <LabelWrapper>
                <strong>데이터 출처:</strong> Domain, powered by APM
              </LabelWrapper>
              <LabelWrapper>
                <strong>제공된 모든 렌트 가격은 중간값(Median) 입니다.</strong>
              </LabelWrapper>
            </div>
          </>
        )}
        <div style={{ marginTop: '4px' }}>
          <AdSense adSlotId={HOUSE_PRICE_AD_SLOT_ID} />
        </div>
      </div>
    </>
  )
}

export default RentalPrice
