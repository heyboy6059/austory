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
  HOUSE_RICE = 'housePrice',
  RENTAL_PRICE = 'rentalPrice'
}

export enum PropertyReportType {
  HOUSE_PRICE = 'housePrice',
  RENTAL_PRICE = 'rentalPrice'
  // RENTAL = 'rental'
  // SCHOOL_ZONES = 'schoolZones'
}

export enum HousePriceReportType {
  HOUSE = 'house',
  UNIT = 'unit'
}

export enum MainMenuTab {
  COMMUNITY = 'Community',
  HOUSE_PRICE = 'HousePrice',
  WH_TAX_CAL = 'whTaxCal'
}

export enum TopCategoryTab {
  ALL = 'All',
  POPULAR = 'Popular',
  OFFICIAL = 'Official',
  DEAL = 'Deal',
  AUS_NEWS = 'AusNews',
  QUESTION = 'Question',
  INFO = 'Info'
}

export const topCategoryMenuList = [
  {
    topCategoryMenu: TopCategoryTab.ALL,
    korLabel: 'ALL'
  },
  // TODO: implement popular posts
  // {
  //   topCategoryMenu: TopCategoryTab.POPULAR,
  //   korLabel: '인기글'
  // },
  // {
  //   topCategoryMenu: TopCategoryTab.OFFICIAL,
  //   korLabel: '인크라우 공식'
  // },
  {
    topCategoryMenu: TopCategoryTab.DEAL,
    korLabel: 'DEAL'
  },
  {
    topCategoryMenu: TopCategoryTab.AUS_NEWS,
    korLabel: '호주 뉴스'
  },
  {
    topCategoryMenu: TopCategoryTab.INFO,
    korLabel: '정보'
  }
  // {
  //   topCategoryMenu: TopCategoryTab.QUESTION,
  //   korLabel: '질문'
  // },
]
