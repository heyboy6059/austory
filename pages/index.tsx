import { useState } from 'react'
import PostFeed from '../components/Post/PostFeed'
import { firestore, fromMillis, postToJSON } from '../common/firebase'

import { COLOURS, POST_FEED_NUM_LIMIT } from '../common/constants'
import { FlexCenterDiv } from '../common/uiComponents'

import ScrollToTop from 'react-scroll-up'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp'
import Head from 'next/head'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
// import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
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
  context
  const postsQuery = firestore
    .collection('posts')
    .where('deleted', '==', false)
    .orderBy('createdAt', 'desc')
    .limit(POST_FEED_NUM_LIMIT)

  const posts = (await postsQuery.get()).docs.map(postToJSON)

  return {
    props: { posts } // will be passed to the page component as props
  }
}

const Home = props => {
  const [posts, setPosts] = useState(props.posts)
  // const [loading, setLoading] = useState(false)

  const [postsEnd, setPostsEnd] = useState(false)

  const [tabValue, setTabValue] = useState(0)

  // TODO: rename this
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const getMorePosts = async () => {
    // setLoading(true)
    const last = posts[posts.length - 1]

    const cursor =
      typeof last.createdAt === 'number'
        ? fromMillis(last.createdAt)
        : last.createdAt

    const query = firestore
      .collection('posts')
      .where('deleted', '==', false)
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(POST_FEED_NUM_LIMIT)

    const newPosts = (await query.get()).docs.map(postToJSON)

    setPosts(posts.concat(newPosts))
    // setLoading(false)

    if (newPosts.length < POST_FEED_NUM_LIMIT) {
      setPostsEnd(true)
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
            />
            <Tab
              label={<strong>커뮤니티</strong>}
              {...a11yProps(1)}
              style={{ padding: '15px' }}
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
      <PostFeed posts={posts} loadMore={getMorePosts} hasMore={!postsEnd} />

      <FlexCenterDiv style={{ marginBottom: '10px' }}>
        {/* {!loading && !postsEnd && (
          <Button onClick={getMorePosts}>Load more</Button>
        )} */}
        {postsEnd && '더 이상 읽을 글이 없습니다.'}
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
