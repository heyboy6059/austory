import { NextApiRequest, NextApiResponse } from 'next'
import { insertAusKorDataset } from '../../common/insert'
import {
  AusKorCompare,
  AusKorData,
  DataDefinition,
  DataGroupName,
  UnitType,
  WorldBankDataList,
  WorldBankDataMetadata
} from '../../typing/data'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const logPrefix = `[AusKorData]`
  console.log(`${logPrefix} == BEGIN ==`)

  const worldBankDataDefinitionList: DataDefinition[] = [
    {
      dataGroupName: DataGroupName.DEMOGRAPHIC,
      dataLabelEng: 'Population',
      dataLabelKor: '총 인구',
      dataDesc: '',
      indicator: 'SP.POP.TOTL',
      sort: 100,
      unitType: UnitType.PEOPLE,
      isHighlight: true
    },
    {
      dataGroupName: DataGroupName.ECONOMY,
      dataLabelEng: 'GDP',
      dataLabelKor: '총 GDP',
      dataDesc: '',
      indicator: 'NY.GDP.MKTP.CD',
      sort: 200,
      unitType: UnitType.CURRENCY,
      isHighlight: true
    },
    {
      dataGroupName: DataGroupName.SOCIAL,
      dataLabelEng:
        'Proportion of seats held by women in national parliaments (%)',
      dataLabelKor: '여성 국회의원 비율',
      dataDesc: '',
      indicator: 'SG.GEN.PARL.ZS',
      sort: 300,
      unitType: UnitType.PERCENTAGE,
      isHighlight: true
    }
  ]

  console.log(
    `${logPrefix} worldBankDataDefinitionList length: ${worldBankDataDefinitionList.length}`
  )

  const ausKorDataList: AusKorData[] = []
  for (const definition of worldBankDataDefinitionList) {
    const INDICATOR = definition.indicator
    const dataLogPrefix = `[${definition.dataLabelEng}(${definition.indicator})]`
    console.log(`${dataLogPrefix} fetch data from worldBank api...`)

    const worldBankRes = await fetch(
      `http://api.worldbank.org/v2/country/au;kr/indicators/${INDICATOR}?date=2015:2040&format=json`
    )

    const worldBankData = await worldBankRes.json()

    const { sourcename, lastupdated } =
      worldBankData[0] as WorldBankDataMetadata

    const dataList = worldBankData[1] as WorldBankDataList

    const ausDataListDesc = dataList
      .filter(data => data.countryiso3code === 'AUS')
      .sort((a, b) => Number(b.date) - Number(a.date))

    const latestAusData = ausDataListDesc[0]

    console.log(
      `${dataLogPrefix} Latest Aus Data - Year: ${latestAusData.date} / value: ${latestAusData.value}`
    )

    const korDataList = dataList.filter(data => data.countryiso3code === 'KOR')

    let ausKorCompare: AusKorCompare = null

    for (const ausData of ausDataListDesc) {
      const matchedKorData = korDataList.find(
        korData => korData.date === ausData.date
      )
      if (matchedKorData) {
        ausKorCompare = {
          aus: {
            year: Number(matchedKorData.date),
            value: matchedKorData.value.toString()
          },
          kor: {
            year: Number(ausData.date),
            value: ausData.value.toString()
          }
        }
        console.log(
          `${dataLogPrefix} Found matched ausKorCompare data. year: ${matchedKorData.date}. ausValue: ${ausData.value} / korValue: ${matchedKorData.value}`
        )
        break
      }
    }

    const ausKorData: AusKorData = {
      definition,
      sourceName: sourcename,
      sourceLastUpdated: lastupdated,
      data: {
        ausOnly: {
          year: Number(latestAusData.date),
          value: latestAusData.value.toString()
        },
        ausKorCompare
      }
    }

    ausKorDataList.push(ausKorData)
  }

  // TODO: custom data

  // TODO: insert data into firebase

  console.log(
    `${logPrefix} Num of completed data list: ${ausKorDataList.length}`
  )

  await insertAusKorDataset({
    createdAt: Date.now(),
    ausKorDataList
  })

  console.log(`${logPrefix} Successfully inserted ausKorDataset to firestore.`)

  console.log(`${logPrefix} == END ==`)

  res.status(200).json({
    ausKorDataList
  })
}

export default handler
