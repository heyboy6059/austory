import '../styles/globals.css'
import Navbar from '../components/Navbar'
import { UserContext } from '../common/context'
import { useUserData } from '../common/hooks'
import { Toaster } from 'react-hot-toast'
import { MAX_WIDTH_PX } from '../common/constants'
import Head from 'next/head'
import MainMenu from '../components/Main/MainMenu'
import { MainMenuProvider } from '../components/Context/MainMenu'

function MyApp({ Component, pageProps }) {
  const userData = useUserData()

  return (
    <UserContext.Provider value={userData}>
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1805879168244149"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <Navbar />
      <MainMenuProvider>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: `${MAX_WIDTH_PX}px` }}>
            <MainMenu />
            <Component {...pageProps} />
          </div>
        </div>
      </MainMenuProvider>
      <Toaster />
    </UserContext.Provider>
  )
}

export default MyApp
