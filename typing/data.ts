export enum DataGroupName {
  DEMOGRAPHIC = 'Demographic',
  ECONOMY = 'Economy',
  SOCIAL = 'Social'
}

export enum UnitType {
  PEOPLE = 'People',
  CURRENCY = 'Currency',
  NUMBER = 'Number',
  PERCENTAGE = 'Percentage'
}

export interface DataDefinition {
  dataGroupName: DataGroupName
  dataLabelEng: string
  dataLabelKor: string
  dataDesc: string
  sort: number
  unitType: UnitType
  isHighlight: boolean
  sourceLink?: string
  indicator?: string
}

export interface DataGroup {
  engLabel: string
  korLabel: string
  sort: number
}

export type DataValue = {
  year: number
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
  sourceLastUpdated: string
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
