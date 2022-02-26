import dayjs from 'dayjs'

export const generateCommentId = (username: string) =>
  `${username}_${dayjs().unix()}`
