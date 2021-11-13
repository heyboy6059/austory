import "../styles/globals.css"
import Navbar from "../components/Navbar"
import { UserContext } from "../common/context"
import { useUserData } from "../common/hooks"
import { Toaster } from "react-hot-toast"

function MyApp({ Component, pageProps }) {
  const userData = useUserData()

  return (
    <UserContext.Provider value={userData}>
      <Navbar />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "700px" }}>
          <Component {...pageProps} />
        </div>
      </div>
      <Toaster />
    </UserContext.Provider>
  )
}

export default MyApp
