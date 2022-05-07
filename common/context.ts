import { createContext } from 'react'
import { Post, UserDataContext } from '../typing/interfaces'

export const UserContext = createContext({
  userAuth: null,
  user: null,
  username: null,
  isAdmin: null,
  firebaseAuthLoading: null,
  userLoading: null
} as UserDataContext)

export const PostContext = createContext({
  post: null as Post
})
