export enum NotificationMethod {
  NONE = 'None',
  EMAIL = 'Email'
}

export enum MarketingEmailSubscription {
  SUBSCRIBE = 'SUBSCRIBE',
  UNSUBSCRIBE = 'UNSUBSCRIBE'
}

export enum CommentOrder {
  LATEST = 'Latest',
  OLDEST = 'Oldest'
}

export enum FinancialYear {
  FY_2020_2021 = '2020-2021',
  FY_2021_2022 = '2021-2022',
  FY_2022_2023 = '2022-2023'
}

export const FinancialYears = [
  FinancialYear.FY_2022_2023,
  FinancialYear.FY_2021_2022,
  FinancialYear.FY_2020_2021
]

export enum CalculatorLogType {
  WH_TAX_RETURN = 'whTaxReturn',
  WH_TAX = 'whTax'
}

export enum Feature {
  WH_TAX = 'whTax',
  HOUSE_RICE = 'housePrice'
}

export enum PropertyReportType {
  HOUSE_PRICE = 'housePrice'
  // RENTAL = 'rental'
  // SCHOOL_ZONES = 'schoolZones'
}

export enum HousePriceReportType {
  HOUSE = 'house',
  UNIT = 'unit'
}
