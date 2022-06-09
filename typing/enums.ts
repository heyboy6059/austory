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
  FY_2021_2022 = '2021-2022'
}

export const FinancialYears = [
  FinancialYear.FY_2020_2021,
  FinancialYear.FY_2021_2022
]
