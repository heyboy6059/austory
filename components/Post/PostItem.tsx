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
  EllipsisDiv
} from '../../common/uiComponents'

import Typography from '@mui/material/Typography'
import { KOR_MONTH_DAY_FORMAT } from '../../common/constants'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import Chip from '@mui/material/Chip'
import { AiOutlineHeart, AiOutlineComment } from 'react-icons/ai'

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
        border: post.isTest ? '2px solid dodgerblue' : 'none',
        borderRadius: '12px'
      }}
    >
      <div style={{ padding: '12px' }}>
        <GridDiv
          style={{
            // thumbnailImage? give 100px space
            gridTemplateColumns:
              // TEMP fallback to thumbnail100
              post.images?.[0]?.thumbnail200?.url ||
              post.images?.[0]?.['thumbnail100']?.url
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
              <Link href={`/post/${post.postId}`} passHref>
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
              <Link href={`/post/${post.postId}`} passHref>
                <Typography>
                  {post.excerpt ? `${post.excerpt}` : post.content}
                </Typography>
              </Link>

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
                <Link href={`/post/${post.postId}`} passHref>
                  <a>
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
                  </a>
                </Link>
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
            margin: '10px 0 5px 0'
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
              <AccountBoxIcon style={{ fontSize: '16px', marginTop: '4px' }} />
              <div>{post.username}</div>
            </FlexCenterDiv>
            {/* </Link> */}
            <span>|</span>
            <span>{dayjs(post.createdAt).format(KOR_MONTH_DAY_FORMAT)}</span>
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
                  color: '#8c519d'
                }}
              />
              {post.heartCount}
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
                  color: '#834799'
                }}
              />
              {post.commentCount || 0}
            </FlexVerticalCenterDiv>
          </FlexCenterDiv>
        </GridDiv>
      </div>
    </Paper>
  )
}

export default PostItem
