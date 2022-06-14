import dayjs from 'dayjs'

export const generateCommentId = (email: string) =>
  `comment-${email.slice(0, 3)}${dayjs().unix()}`

export const generateHeartDocumentId = (postId: string, uid: string) => {
  return `heart-${postId}-${uid}`
}

export const generatePostDocumentId = (email: string) => {
  return `post-${email.slice(0, 3)}${dayjs().unix()}`
}

export const generateCalculatorLogId = (email: string) => {
  return `${email}-${dayjs().unix()}`
}
