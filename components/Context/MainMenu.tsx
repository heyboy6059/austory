import {
  FC,
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction
} from 'react'
import { MainMenuTab } from '../../typing/enums'

interface MainMenuProvider {
  selectedMainMenuTab: MainMenuTab | null
  setSelectedMainMenuTab: Dispatch<SetStateAction<MainMenuTab>>
}

const MainMenuContext = createContext<MainMenuProvider | null>(null)

const MainMenuProvider: FC = props => {
  const [selectedMainMenuTab, setSelectedMainMenuTab] = useState<MainMenuTab>(
    MainMenuTab.COMMUNITY
  )

  return (
    <MainMenuContext.Provider
      value={{
        selectedMainMenuTab,
        setSelectedMainMenuTab
      }}
    >
      {props.children}
    </MainMenuContext.Provider>
  )
}

const useMainMenu = (): MainMenuProvider => {
  const context = useContext(MainMenuContext)
  if (context === undefined) {
    throw new Error('useMainMenu must be used within an MainMenuProvider')
  }

  return context as MainMenuProvider
}

export { MainMenuProvider, useMainMenu }
