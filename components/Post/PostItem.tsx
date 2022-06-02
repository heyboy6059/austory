import { FC, useContext, useCallback, Dispatch, SetStateAction } from 'react'
import dayjs from 'dayjs'
import Link from 'next/link'
import Image from 'next/image'
import { Post } from '../../typing/interfaces'
import Paper from '@mui/material/Paper'
import {
  FlexVerticalCenterDiv,
  FlexCenterDiv,
  GridDiv,
  EllipsisDiv,
  EllipsisSpan
} from '../../common/uiComponents'

import Typography from '@mui/material/Typography'
import { COLOURS, KOR_MONTH_DAY_FORMAT } from '../../common/constants'
import Chip from '@mui/material/Chip'
import { AiOutlineHeart, AiOutlineComment, AiOutlineEye } from 'react-icons/ai'
import { UserContext } from '../../common/context'
import AccountIconName from '../Account/AccountIconName'
import { useRouter } from 'next/router'

const PostItem: FC<{
  post: Post
  ownerUser?: boolean
  // REVIEW: post context
  setSelectedPost?: Dispatch<SetStateAction<Post>>
  setSelectedScrollPosition?: Dispatch<SetStateAction<number>>
}> = ({
  post,
  ownerUser = false,
  setSelectedPost,
  setSelectedScrollPosition
}): JSX.Element => {
  const router = useRouter()
  const { isAdmin } = useContext(UserContext)

  const openPostContent = useCallback(() => {
    // keep scroll position before opening post content
    setSelectedScrollPosition(window.pageYOffset)
    // open post content
    setSelectedPost(post)
    // move to the top
    window.scrollTo(0, 0)
    // change url for proper copy
    router.push(`/`, `/post/${post.postId}`, { shallow: true })
  }, [router, post, setSelectedPost, setSelectedScrollPosition])

  // TODO: div clean up
  return (
    <Paper
      elevation={0}
      style={{
        marginBottom: '5px',
        border: post.isTest ? '2px solid dodgerblue' : 'none',
        borderRadius: '12px'
      }}
    >
      <div style={{ padding: '12px' }}>
        {post.categories.length ? (
          <div>
            {post.categories.map(category => (
              <Chip
                key={category.categoryId}
                label={category.name}
                variant={'outlined'}
                size="small"
                style={{ marginRight: '4px', fontSize: '12px' }}
              />
            ))}
          </div>
        ) : (
          <></>
        )}
        <GridDiv
          style={{
            // thumbnailImage? give 100px space
            gridTemplateColumns:
              // TEMP fallback to thumbnail100
              post.images?.[0]?.thumbnail200?.url ||
              post.images?.[0]?.['thumbnail100']?.url
                ? '1fr 100px'
                : '1fr',
            gap: '4px',
            alignItems: 'center'
          }}
        >
          <GridDiv
            style={{
              gridTemplateRows: '40px 45px',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span onClick={() => openPostContent()}>
                <Typography
                  style={{
                    fontSize: '17px',
                    margin: '2px 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    fontWeight: 'bold',
                    lineHeight: '1.2',
                    cursor: 'pointer'
                  }}
                >
                  {post.isTest && <Chip label="TEST" color="primary" />}
                  <span>{post.title}</span>
                </Typography>
              </span>
            </div>
            <EllipsisDiv
              style={{
                cursor: 'pointer'
              }}
            >
              <span onClick={() => openPostContent()}>
                <Typography
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    fontSize: '14px'
                  }}
                >
                  {post.excerpt ? `${post.excerpt}` : post.content}
                </Typography>
              </span>

              {ownerUser && (
                <>
                  <Link href={`/dashboard/${post.postId}`} passHref>
                    <h3>
                      <button className="btn-blue">Edit</button>
                    </h3>
                  </Link>
                </>
              )}
            </EllipsisDiv>
          </GridDiv>
          <div style={{ width: '100px', cursor: 'pointer' }}>
            {
              // TEMP: fallback to thumbnail600
              post.images?.[0]?.thumbnail200?.url ||
              post.images?.[0]?.['thumbnail100']?.url ? (
                <span onClick={() => openPostContent()}>
                  <Image
                    src={
                      post.images?.[0]?.thumbnail200?.url ||
                      post.images?.[0]?.['thumbnail100']?.url
                    }
                    alt="thumbnail image"
                    width={'100%'}
                    height={'100%'}
                    layout="responsive"
                    objectFit="cover"
                  />
                </span>
              ) : (
                ``
              )
            }
          </div>
        </GridDiv>
        <GridDiv
          style={{
            gridTemplateColumns: '1fr 10px 100px',
            alignItems: 'center',
            margin: '4px 0 5px 0'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'left',
              alignItems: 'center',
              gap: '4px',
              fontSize: '13px'
            }}
          >
            {/**
             * coverUsername is for admin purpose only
             * - temporarily cover the username
             */}
            <AccountIconName
              username={post.coverUsername || post.username}
              role={post.coverRole || post.createdByRole}
            />
            <span>|</span>
            <EllipsisSpan>
              {dayjs(post.createdAt).format(KOR_MONTH_DAY_FORMAT)}
            </EllipsisSpan>
          </div>
          <div></div>
          <FlexCenterDiv
            style={{
              gap: '6px'
              // justifyContent: 'right'
            }}
          >
            <FlexVerticalCenterDiv>
              {/* <FcLike
                fontSize={18}
                style={{ marginRight: '1px' }}
              /> */}
              <AiOutlineHeart
                fontSize={18}
                style={{
                  marginRight: '1px',
                  marginTop: '1px',
                  color: COLOURS.LIGHT_PURPLE
                }}
              />
              <span style={{ color: COLOURS.SECONDARY_SPACE_GREY }}>
                {post.heartCount}
              </span>
            </FlexVerticalCenterDiv>
            <FlexVerticalCenterDiv>
              {/* <FcSms
                fontSize={18}
                style={{ marginTop: '1px'}}
              /> */}
              <AiOutlineComment
                fontSize={18}
                style={{
                  marginRight: '1px',
                  marginTop: '1px',
                  color: COLOURS.LIGHT_PURPLE
                }}
              />
              <span style={{ color: COLOURS.SECONDARY_SPACE_GREY }}>
                {post.commentCount || 0}
              </span>
            </FlexVerticalCenterDiv>
            {/**
             * Count is visible only for Admin users
             */}
            {isAdmin && (
              <FlexVerticalCenterDiv>
                <AiOutlineEye
                  fontSize={18}
                  style={{
                    marginRight: '1px',
                    marginTop: '1px',
                    color: COLOURS.PRIMARY_SPACE_GREY
                  }}
                />
                <span style={{ color: COLOURS.SECONDARY_SPACE_GREY }}>
                  {post.viewCount || 0}
                </span>
              </FlexVerticalCenterDiv>
            )}
          </FlexCenterDiv>
        </GridDiv>
      </div>
    </Paper>
  )
}

export default PostItem
