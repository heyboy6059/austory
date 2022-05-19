import { useState } from 'react'
import PostFeed from '../components/Post/PostFeed'

import {
  COLOURS,
  GENERIC_KOREAN_ERROR_MESSAGE,
  POST_FEED_NUM_LIMIT
} from '../common/constants'
import { FlexCenterDiv } from '../common/uiComponents'

import ScrollToTop from 'react-scroll-up'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp'
import Head from 'next/head'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
// import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Post, PostType } from '../typing/interfaces'
import { getPostsByType } from '../common/get'
import toast from 'react-hot-toast'
// import StarsIcon from '@mui/icons-material/Stars'

// interface TabPanelProps {
//   children?: React.ReactNode
//   index: number
//   value: number
// }

// function TabPanel(props: TabPanelProps) {
//   const { children, value, index, ...other } = props

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ p: 3 }}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   )
// }

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

export const getServerSideProps = async context => {
  const { postType } = context.query

  let posts = null
  let postTypeFromQuery = null
  if (postType === 'inkrau' || postType === 'community') {
    posts = await getPostsByType(postType)
    postTypeFromQuery = postType
  } else {
    posts = await getPostsByType('inkrau')
  }

  return {
    props: { posts, postTypeFromQuery }
  }
}

const Home = ({ posts, postTypeFromQuery }) => {
  const [postType, setPostType] = useState<PostType>(
    postTypeFromQuery || 'inkrau'
  )

  const [inkrauPosts, setInkrauPosts] = useState<Post[]>(
    // postType = inkrau or null
    postTypeFromQuery !== 'community' ? posts : []
  )
  const [communityPosts, setCommunityPosts] = useState<Post[]>(
    postTypeFromQuery === 'community' ? posts : []
  )

  const [inkrauPostEnd, setInkrauPostEnd] = useState(false)
  const [communityPostEnd, setCommunityPostEnd] = useState(false)

  // REVIEW: replace 0, 1 to actual string name
  // 0 = inkrau contents menu
  // 1 = community contents menu
  const [tabValue, setTabValue] = useState(
    postTypeFromQuery === 'inkrau'
      ? 0
      : postTypeFromQuery === 'community'
      ? 1
      : 0
  )

  // TODO: rename this
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const getMorePosts = async (postType: PostType) => {
    try {
      /**
       * 1. inkrau
       */
      if (postType === 'inkrau') {
        const newPosts = await getPostsByType(
          'inkrau',
          inkrauPosts[inkrauPosts.length - 1]
        )

        setInkrauPosts(inkrauPosts.concat(newPosts))

        if (newPosts.length < POST_FEED_NUM_LIMIT) {
          setInkrauPostEnd(true)
        }
        return
      }

      /**
       * 2. community
       */
      if (postType === 'community') {
        const newPosts = await getPostsByType(
          'community',
          communityPosts[communityPosts.length - 1]
        )

        console.log({ newPosts })
        setCommunityPosts(communityPosts.concat(newPosts))

        if (newPosts.length < POST_FEED_NUM_LIMIT) {
          setCommunityPostEnd(true)
        }
        return
      }

      throw new Error(`No matched postType found.`)
    } catch (err) {
      console.error(`Error in getMorePosts: ${err.message}`)
      toast.error(GENERIC_KOREAN_ERROR_MESSAGE)
    }
  }

  const getInitialPosts = async (postType: PostType) => {
    try {
      if (postType === 'community' && !communityPosts.length) {
        const posts = await getPostsByType('community')
        setCommunityPosts(posts)
      }
      if (postType === 'inkrau' && !inkrauPosts.length) {
        const posts = await getPostsByType('inkrau')
        setInkrauPosts(posts)
      }
    } catch (err) {
      console.error(`Error in getCommunityPosts: ${err.message}`)
      toast.error(GENERIC_KOREAN_ERROR_MESSAGE)
    }
  }

  return (
    <div>
      <Head>
        <title>inKRAU 인크라우</title>
      </Head>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="main menu tabs"
            style={{ minHeight: '0', padding: '0', height: '42px' }}
          >
            <Tab
              label={
                <strong>인크라우 컨텐츠</strong>
                // <FlexCenterDiv>
                //   <StarsIcon style={{ fontSize: '18px', marginRight: '2px' }} />
                //   <FlexCenterDiv>
                //     <strong>인크라우 컨텐츠</strong>
                //   </FlexCenterDiv>
                // </FlexCenterDiv>
              }
              {...a11yProps(0)}
              style={{ padding: '15px' }}
              onClick={async () => {
                setPostType('inkrau')
                await getInitialPosts(postType)
              }}
            />
            <Tab
              label={<strong>커뮤니티</strong>}
              {...a11yProps(1)}
              style={{ padding: '15px' }}
              onClick={async () => {
                setPostType('community')
                await getInitialPosts(postType)
              }}
            />
            {/* <Tab label="Item Three" {...a11yProps(2)} /> */}
          </Tabs>
        </Box>
        {/* <TabPanel value={tabValue} index={0}>
          Item One
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          Item Three
        </TabPanel> */}
      </Box>
      <PostFeed
        posts={postType === 'inkrau' ? inkrauPosts : communityPosts}
        loadMore={() => getMorePosts(postType)}
        hasMore={postType === 'inkrau' ? !inkrauPostEnd : !communityPostEnd}
      />

      <FlexCenterDiv style={{ marginBottom: '10px' }}>
        {/* {!loading && !postsEnd && (
          <Button onClick={getMorePosts}>Load more</Button>
        )} */}
        {((postType === 'inkrau' && inkrauPostEnd) ||
          (postType === 'community' && communityPostEnd)) &&
          '더 이상 읽을 글이 없습니다.'}
      </FlexCenterDiv>

      {/* <Loader show={loading} /> */}
      <ScrollToTop showUnder={300} style={{ bottom: 25, right: 15 }}>
        <span>
          <ArrowCircleUpIcon
            style={{
              backgroundColor: COLOURS.DARK_BLUE,
              color: 'white',
              borderRadius: '30px',
              fontSize: '35px',
              opacity: 0.85
            }}
          />
        </span>
      </ScrollToTop>
    </div>
  )
}

export default Home
