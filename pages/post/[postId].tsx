import { FC } from 'react'
import PostContent from '../../components/Post/PostContent'
import { firestore, postToJSON } from '../../common/firebase'

import Box from '@mui/material/Box'

import {
  FirebaseDocumentSnapshot,
  RawPost,
  Post
} from '../../typing/interfaces'
import {
  FlexCenterDiv,
  FlexSpaceBetweenCenter
} from '../../common/uiComponents'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import { FcCalculator, FcHome } from 'react-icons/fc'
import { useRouter } from 'next/router'

export const getServerSideProps = async context => {
  const query = firestore
    .collection('posts')
    .doc(context.params.postId as string)

  const queryDoc = await query.get()

  const post = postToJSON(queryDoc as FirebaseDocumentSnapshot<RawPost>)

  return {
    props: { post }
  }
}

interface PostProps {
  post: Post
  path: string
}
const SinglePost: FC<PostProps> = ({ post }) => {
  const router = useRouter()
  return (
    <Box
    // style={
    //   {
    //     padding: '8px 0px'
    //   }
    // }
    >
      {/**
       * TODO: globalize tab buttons
       */}
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            // borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <FlexSpaceBetweenCenter>
            <Tabs
              // value={0}
              // onChange={handleChange}
              // value={true}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="main menu tabs"
              style={{
                minHeight: '0',
                padding: '0',
                height: '42px',
                color: 'red'
              }}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab
                label={<strong>커뮤니티</strong>}
                style={{
                  padding: '10px 2px'
                }}
                onClick={async () => {
                  router.push(`/`)
                }}
              />
              <Tab
                label={<strong>인크라우 컨텐츠</strong>}
                style={{
                  padding: '10px 2px'
                }}
                onClick={async () => {
                  router.push({
                    pathname: '/',
                    query: {
                      postType: 'inkrau'
                    }
                  })
                }}
              />
            </Tabs>

            <FlexCenterDiv style={{ gap: '2px' }}>
              <Tooltip title="워홀 세금 계산기" placement="bottom" arrow>
                <Button
                  size="small"
                  color="info"
                  variant="outlined"
                  onClick={() => router.push(`/calculator/wh`)}
                >
                  <FlexCenterDiv style={{ gap: '2px' }}>
                    <FcCalculator />
                    워홀 세금
                  </FlexCenterDiv>
                </Button>
              </Tooltip>
              <Tooltip
                title="부동산 가격 트랜드 리포트"
                placement="bottom"
                arrow
              >
                <Button
                  size="small"
                  color="info"
                  variant="outlined"
                  onClick={() => router.push(`/houseprice`)}
                >
                  <FlexCenterDiv style={{ gap: '2px' }}>
                    <FcHome />
                    부동산
                  </FlexCenterDiv>
                </Button>
              </Tooltip>
            </FlexCenterDiv>
          </FlexSpaceBetweenCenter>
        </Box>
      </Box>

      <PostContent
        post={post}
        // this route is from direct access using url
        fromDirectLink={true}
      />
    </Box>
  )
}

export default SinglePost
