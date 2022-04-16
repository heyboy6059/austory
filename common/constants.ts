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
  LIGHT_PURPLE = '#8c519d'
}

export const POST_FEED_NUM_LIMIT = 10

export const KOR_MONTH_DAY_FORMAT = 'M월 D일 h:mm A'

export const KOR_FULL_DATE_FORMAT = 'YYYY년 M월 D일 h:mm A'

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

export const GENERIC_KOREAN_ERROR_MESSAGE =
  '에러가 발생했습니다. 다시 시도해주세요.'

// URLs
export const REQUEST_GOOGLE_FORM_URL = 'https://forms.gle/fxLmKtN1RrYen7LH6'
