export enum DataGroupName {
  NATIONAL_INFO = 'NationalInfo',
  DEMOGRAPHIC = 'Demographic',
  ECONOMY = 'Economy',
  SOCIAL = 'Social',
  ENVIRONMENT = 'Environment'
}

export enum UnitType {
  PEOPLE = 'People',
  CURRENCY = 'Currency',
  NUMBER = 'Number',
  STRING = 'String',
  PERCENTAGE = 'Percentage',
  PERCENTAGE_FLOAT = 'PercentageFloat',
  TON_PER_CAPITA = 'TonPerCapita',
  KM2 = 'Km2'
}

export enum DataSourceType {
  WORLD_BANK = 'World Bank',
  CENSUS = 'Census',
  THE_WORLD_FACT = 'The World Fact',
  GOVERNMENT = 'Government',
  WORLDOMETERS = 'Worldometers',
  CUSTOM = 'Custom'
}
export interface DataDefinition {
  dataGroupName: DataGroupName
  dataLabelEng: string
  dataLabelKor: string
  dataDesc: string
  sort: number
  unitType: UnitType
  isHighlight: boolean
  dataSourceType: DataSourceType | null
  sourceLink?: string
  indicator?: string
}

export interface DataGroup {
  engLabel: string
  korLabel: string
  sort: number
}

export type DataValue = {
  year: number | null
  value: string
  subValue?: string
}

export type AusKorCompare = {
  aus: DataValue
  kor: DataValue
}

export interface AusKorData {
  definition: DataDefinition
  sourceName: string
  sourceLastUpdated: string | null
  data: {
    ausOnly: DataValue
    ausKorCompare: AusKorCompare
  }
}

export interface WorldBankDataMetadata {
  page: number
  pages: number
  per_page: number
  total: number
  sourceid: string
  sourcename: string
  lastupdated: string
}

export type WorldBankData = {
  indicator: {
    id: string
    value: string
  }
  country: {
    id: string
    value: string
  }
  countryiso3code: string
  date: string
  value: number
  unit: string
  obs_status: string
  decimal: number
}

export type WorldBankDataList = WorldBankData[]

export type MainSubStrData = {
  mainData: string
  subData: string
}
