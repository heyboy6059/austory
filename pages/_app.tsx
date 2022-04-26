import '../styles/globals.css'
import Navbar from '../components/Navbar'
import { UserContext } from '../common/context'
import { useUserData } from '../common/hooks'
import { Toaster } from 'react-hot-toast'
import { MAX_WIDTH_PX } from '../common/constants'

function MyApp({ Component, pageProps }) {
  const userData = useUserData()

  return (
    <UserContext.Provider value={userData}>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: `${MAX_WIDTH_PX}px` }}>
          <Component {...pageProps} />
        </div>
      </div>
      <Toaster />
    </UserContext.Provider>
  )
}

export default MyApp
