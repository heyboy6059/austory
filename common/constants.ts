export enum COLOURS {
  PRIMARY_SPACE_GREY = 'rgba(0,0,0,0.8)',
  SECONDARY_SPACE_GREY = '#424245',
  TEXT_GREY = '#808080',
  PRIMARY_WHITE = '#d6d6d6',
  LIGHT_BACKGROUND = 'f5f5f7',
  LINE_GREY = '#D3D3D3',
  DARK_BLUE = '#10508D',
  GREEN = '#72CC50'
}

export const POST_FEED_NUM_LIMIT = 10

export const KOR_MONTH_DAY_FORMAT = 'M월 D일 h:mm A'

export const KOR_FULL_DATE_FORMAT = 'YYYY년 M월 D일 h:mm A'

export const KOR_DATE_WITHOUT_TIME_FORMAT = 'YYYY년 M월 D일'

export const MAX_WIDTH_PX = 700

export const RESIZE_IMAGE_EXT = 'jpeg'

export const RESIZE_THUMBNAIL100_MAX_WIDTH_HEIGHT = 100
export const RESIZE_THUMBNAIL300_MAX_WIDTH_HEIGHT = 300
export const RESIZE_ORIGINAL_MAX_WIDTH_HEIGHT = 1920

export const IMAGE_THUMBNAIL100_PREFIX = 'thumbnail100_'
export const IMAGE_THUMBNAIL300_PREFIX = 'thumbnail300_'
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
