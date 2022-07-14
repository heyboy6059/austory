import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { Post } from '../typing/interfaces'
import { getPostsByTopCategory } from '../common/get'
import { MainMenuTab, TopCategoryTab } from '../typing/enums'
import TopCategoryMenu from '../components/Main/TopCategoryMenu'
import Community from '../components/Main/Community'
import { useMainMenu } from '../components/Context/MainMenu'

export const getServerSideProps = async context => {
  context
  const posts = await getPostsByTopCategory(TopCategoryTab.ALL)
  return {
    props: { posts }
  }
}

const Home = ({ posts }) => {
  const { selectedMainMenuTab, setSelectedMainMenuTab } = useMainMenu()
  const [communityTabPosts, setCommunityTabPosts] = useState<Post[]>(posts)

  const [selectedTopCategoryMenu, setSelectedTopCategoryMenu] =
    useState<TopCategoryTab | null>(null)

  const [selectedPost, setSelectedPost] = useState<Post>(null)

  const updateCommunityTabPosts = useCallback(
    async (topCategoryTab: TopCategoryTab) => {
      const posts = await getPostsByTopCategory(topCategoryTab)
      setCommunityTabPosts(posts)
    },
    []
  )

  useEffect(() => {
    if (selectedTopCategoryMenu) {
      updateCommunityTabPosts(selectedTopCategoryMenu)
    }
  }, [selectedTopCategoryMenu, updateCommunityTabPosts])

  useEffect(() => {
    if (selectedMainMenuTab !== MainMenuTab.COMMUNITY) {
      setSelectedMainMenuTab(MainMenuTab.COMMUNITY)
      console.log('update mainMenuTab COMMUNITY in useEffect')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Head>
        <title>인크라우 inKRAU</title>
      </Head>
      {!selectedPost && (
        <TopCategoryMenu
          selectedTopCategoryMenu={selectedTopCategoryMenu}
          setSelectedTopCategoryMenu={setSelectedTopCategoryMenu}
        />
      )}
      <Community
        posts={communityTabPosts}
        selectedPost={selectedPost}
        setSelectedPost={setSelectedPost}
        selectedTopCategoryMenu={selectedTopCategoryMenu}
      />
    </div>
  )
}

export default Home
