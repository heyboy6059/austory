export const getHeartDocumentId = (postId: string, username: string) => {
  return `${postId}_${username}`
}
