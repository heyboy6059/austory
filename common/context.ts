import { createContext } from 'react'
import { Post } from '../typing/interfaces'

export const UserContext = createContext({
  user: null,
  username: null,
  isAdmin: null
})

export const PostContext = createContext({
  post: null as Post
})
