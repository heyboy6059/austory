import { Dispatch, SetStateAction } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import {
  HorizontalScrollContainer,
  HorizontalScrollItem
} from 'react-simple-horizontal-scroller'
import { NextPage } from 'next'
import { topCategoryMenuList, TopCategoryTab } from '../../typing/enums'

interface Props {
  selectedTopCategoryMenu: TopCategoryTab
  setSelectedTopCategoryMenu: Dispatch<SetStateAction<TopCategoryTab>>
}
const TopCategoryMenu: NextPage<Props> = ({
  selectedTopCategoryMenu,
  setSelectedTopCategoryMenu
}) => {
  return (
    <Box
      style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '60px 1fr',
        margin: '5px 0',
        padding: '0 8px'
      }}
    >
      <Chip
        label={TopCategoryTab.ALL}
        color="info"
        variant={
          !selectedTopCategoryMenu ||
          selectedTopCategoryMenu === TopCategoryTab.ALL
            ? 'filled'
            : 'outlined'
        }
        style={{ cursor: 'pointer', borderRadius: '14px' }}
        onClick={() => {
          if (!(selectedTopCategoryMenu === TopCategoryTab.ALL)) {
            setSelectedTopCategoryMenu(TopCategoryTab.ALL)
          }
        }}
      />
      <HorizontalScrollContainer>
        {topCategoryMenuList
          .filter(cat => cat.topCategoryMenu !== TopCategoryTab.ALL)
          .map(topCategory => {
            return (
              <HorizontalScrollItem
                id={topCategory.topCategoryMenu}
                key={topCategory.topCategoryMenu}
                onClick={() => {
                  if (selectedTopCategoryMenu === topCategory.topCategoryMenu) {
                    setSelectedTopCategoryMenu(TopCategoryTab.ALL)
                  } else {
                    setSelectedTopCategoryMenu(topCategory.topCategoryMenu)
                  }
                }}
              >
                <Chip
                  label={topCategory.korLabel}
                  color="info"
                  style={{
                    margin: '0 5px',
                    cursor: 'pointer',
                    borderRadius: '14px'
                  }}
                  variant={
                    selectedTopCategoryMenu === topCategory.topCategoryMenu
                      ? 'filled'
                      : 'outlined'
                  }
                />
              </HorizontalScrollItem>
            )
          })}
      </HorizontalScrollContainer>
    </Box>
  )
}

export default TopCategoryMenu
