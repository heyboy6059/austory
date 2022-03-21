import { FC } from 'react'
import dayjs from 'dayjs'
import Link from 'next/link'
import Image from 'next/image'
import { Post } from '../../typing/interfaces'
import Paper from '@mui/material/Paper'

import {
  FlexVerticalCenterDiv,
  FlexCenterDiv,
  GridDiv,
  FlexSpaceBetween,
  EllipsisDiv
} from '../../common/uiComponents'

import FavoriteIcon from '@mui/icons-material/Favorite'
import CommentIcon from '@mui/icons-material/Comment'
import Typography from '@mui/material/Typography'
import { KOR_MONTH_DAY_FORMAT } from '../../common/constants'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import Chip from '@mui/material/Chip'

const PostItem: FC<{
  post: Post
  ownerUser?: boolean
}> = ({ post, ownerUser = false }): JSX.Element => {
  // Naive method to calc word count and read time
  // const wordCount = post?.content.trim().split(/\s+/g).length
  // const minutesToRead = (wordCount / 100 + 1).toFixed(0)

  // TODO: div clean up
  return (
    <Paper
      elevation={0}
      style={{
        marginBottom: '5px',
        border: post.isTest ? '2px solid dodgerblue' : 'none'
      }}
    >
      <div style={{ padding: '12px' }}>
        <GridDiv
          style={{
            // thumbnailImage? give 100px space
            gridTemplateColumns: post.images?.[0]?.thumbnail100?.url
              ? '1fr 100px'
              : '1fr',
            gap: '4px'
          }}
        >
          <GridDiv
            style={{
              gridTemplateRows: '55px 45px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Link href={`/post/${post.slug}`} passHref>
                <Typography
                  style={{
                    fontSize: '20px',
                    margin: '2px 0',
                    wordWrap: 'break-word',
                    fontWeight: 'bold',
                    lineHeight: '1.2',
                    cursor: 'pointer'
                  }}
                >
                  {post.isTest && <Chip label="TEST" color="primary" />}
                  <span>{post.title}</span>
                </Typography>
              </Link>
            </div>
            <EllipsisDiv
              style={{
                cursor: 'pointer'
              }}
            >
              <Link href={`/post/${post.slug}`} passHref>
                <Typography>
                  {post.excerpt ? `${post.excerpt}` : post.content}
                </Typography>
              </Link>

              {ownerUser && (
                <>
                  <Link href={`/dashboard/${post.slug}`} passHref>
                    <h3>
                      <button className="btn-blue">Edit</button>
                    </h3>
                  </Link>
                </>
              )}
            </EllipsisDiv>
          </GridDiv>
          <div style={{ width: '100px', cursor: 'pointer' }}>
            {post.images?.[0]?.thumbnail100?.url ? (
              <Link href={`/post/${post.slug}`} passHref>
                <a>
                  <Image
                    src={post.images[0].thumbnail100?.url}
                    alt=""
                    width={'100%'}
                    height={'100%'}
                    layout="responsive"
                    objectFit="contain"
                  />
                </a>
              </Link>
            ) : (
              ``
            )}
          </div>
        </GridDiv>
        <FlexSpaceBetween
          style={{
            alignItems: 'center',
            margin: '15px 0 5px 0'
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
            {/* <Link href={`/${post.username}`} passHref> */}
            <FlexCenterDiv style={{ gap: '2px', alignItems: 'center' }}>
              <AccountBoxIcon style={{ fontSize: '16px' }} />
              <div>{post.username}</div>
            </FlexCenterDiv>
            {/* </Link> */}
            <span>|</span>
            <span>{dayjs(post.createdAt).format(KOR_MONTH_DAY_FORMAT)}</span>
          </div>
          <FlexCenterDiv
            style={{
              gap: '6px',
              justifyContent: 'right'
            }}
          >
            <FlexVerticalCenterDiv>
              <FavoriteIcon fontSize="small" /> {post.heartCount}
            </FlexVerticalCenterDiv>
            <FlexVerticalCenterDiv>
              <CommentIcon fontSize="small" /> {post.commentCount || 0}
            </FlexVerticalCenterDiv>
          </FlexCenterDiv>
        </FlexSpaceBetween>
      </div>
    </Paper>
  )
}

export default PostItem
