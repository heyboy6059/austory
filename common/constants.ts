export const ROOT_INKRAU_URL = 'https://www.inkrau.com'

export enum COLOURS {
  PRIMARY_SPACE_GREY = 'rgba(0,0,0,0.8)',
  SECONDARY_SPACE_GREY = '#424245',
  TEXT_GREY = '#808080',
  PRIMARY_WHITE = '#d6d6d6',
  LIGHT_BACKGROUND = 'f5f5f7',
  LINE_GREY = '#D3D3D3',
  DARK_BLUE = '#10508D',
  GREEN = '#72CC50',
  BRIGHT_GREEN = '#8bc34a',
  HEART_RED = '#f44336',
  CANCEL_RED = '#E3242B',
  LIGHT_PURPLE = '#8c519d',
  PRIMARY_BLUE = '#1769aa',
  SECONDARY_BLUE = '#2196f3'
}

export const POST_FEED_NUM_LIMIT = 10

export const KOR_MONTH_DAY_FORMAT = 'M월 D일 h:mm A'

export const KOR_FULL_DATE_FORMAT = 'YYYY년 M월 D일 h:mm A'

export const NUM_DATE_FORMAT = 'YYYY.MM.DD h:mm A'

export const KOR_DATE_WITHOUT_TIME_FORMAT = 'YYYY년 M월 D일'

export const MAX_WIDTH_PX = 600

export const RESIZE_IMAGE_EXT = 'jpeg'

export const RESIZE_THUMBNAIL200_MAX_WIDTH_HEIGHT = 200
export const RESIZE_THUMBNAIL600_MAX_WIDTH_HEIGHT = 600
export const RESIZE_ORIGINAL_MAX_WIDTH_HEIGHT = 1920

export const IMAGE_THUMBNAIL200_PREFIX = 'thumbnail200_'
export const IMAGE_THUMBNAIL600_PREFIX = 'thumbnail600_'
export const IMAGE_ORIGINAL_PREFIX = 'original_'

export const ORIGINAL_IMAGE_UPLOAD_MAX_THRESHOLD = 1024 * 2000 // 2MB
export const IMAGE_UPLOAD_SIZE_LIMIT = 1024 * 8000 // 8MB

export enum FileExt {
  GIF = 'gif',
  PNG = 'png'
}

export const COMMENT_CONTENT_MAX_COUNT = 300

//FIRESTORE COLLECTION NAMES
export const FIRESTORE_USERNAMES = 'usernames'
export const FIRESTORE_POSTS = 'posts'
export const FIRESTORE_USERS = 'users'
export const FIRESTORE_COMMENTS = 'comments'
export const FIRESTORE_CATEGORIES = 'categories'

export const GENERIC_KOREAN_ERROR_MESSAGE =
  '에러가 발생했습니다. 다시 시도해주세요.'

// URLs
export const REQUEST_GOOGLE_FORM_URL = 'https://forms.gle/fxLmKtN1RrYen7LH6'
export const FACEBOOK_INKRAU_URL = 'https://www.facebook.com/inKRAUofficial'
export const INSTAGRAM_INKRAU_URL = 'https://www.instagram.com/inkrau_official'

export const INKRAU_OFFICIAL_USER_ID = '7eBBo9hmZPgYIi3dws9derB0SYe2'

export const WHTaxRates = {
  upTo45000: {
    rateAmountLimit: 45000,
    rate: 0.15
  },
  upTo120000: {
    rateAmountLimit: 120000,
    rate: 0.325
  },
  upTo180000: {
    rateAmountLimit: 180000,
    rate: 0.37
  },
  over180000: {
    rateAmountLimit: 99999999999,
    rate: 0.45
  }
}

export const TEMP_KOR_AUS_RATE = 905

/**
 * ADSENSE
 */
export const CONTENT_AD_SLOT_ID = '3559760421'
export const CALCULATOR_AD_SLOT_ID = '1419401955'
