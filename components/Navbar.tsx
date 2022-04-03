import { useContext, useState } from 'react'
import Link from 'next/link'
// import Image from "next/image"
import { UserContext } from '../common/context'
import { COLOURS, MAX_WIDTH_PX } from '../common/constants'
import {
  UserImage,
  LogoImage,
  FlexVerticalCenterDiv,
  FlexSpaceBetween,
  FlexCenterDiv
} from '../common/uiComponents'

import Logo from '../public/inKRAU_New_Logo.png'

/**
 * Material UI
 */
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
// import IconButton from "@mui/material/IconButton"
import Button from '@mui/material/Button'
// import MenuIcon from "@mui/icons-material/Menu"
// import SwipeableDrawer from "@mui/material/SwipeableDrawer"
// import ListItem from "@mui/material/ListItem"
// import ListItemIcon from "@mui/material/ListItemIcon"
// import ListItemText from "@mui/material/ListItemText"
// import List from "@mui/material/List"
// import Divider from "@mui/material/Divider"
// import InboxIcon from "@mui/icons-material/MoveToInbox"
// import MailIcon from "@mui/icons-material/Mail"
// import DashboardIcon from "@mui/icons-material/Dashboard"
// import CardGiftcardIcon from "@mui/icons-material/CardGiftcard"
// import QueryStatsIcon from "@mui/icons-material/QueryStats"
// import AccountBoxIcon from "@mui/icons-material/AccountBox"
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
// import MasksIcon from '@mui/icons-material/Masks'
import Tooltip from '@mui/material/Tooltip'
import CovidInfoDialog from './CovidInfoDialog'
import router from 'next/router'

// Top navbar
export default function Navbar() {
  const { userAuth, username, isAdmin } = useContext(UserContext)
  const [covidInfoOpen, setCovidInfoOpen] = useState(false)

  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // const [openDrawer, setOpenDrawer] = useState(false)

  // const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget)
  // }

  // const handleClose = () => {
  //   setAnchorEl(null)
  // }

  // const toggleDrawer = useCallback(
  //   (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
  //     if (
  //       event &&
  //       event.type === "keydown" &&
  //       ((event as React.KeyboardEvent).key === "Tab" ||
  //         (event as React.KeyboardEvent).key === "Shift")
  //     ) {
  //       return
  //     }

  //     setOpenDrawer(open)
  //   },
  //   []
  // )

  // const list = () => (
  //   <Box
  //     role="presentation"
  //     onClick={toggleDrawer(false)}
  //     onKeyDown={toggleDrawer(false)}
  //   >
  //     <List>
  //       <ListItem button key={"Dashboard"}>
  //         <ListItemIcon>
  //           <DashboardIcon />
  //         </ListItemIcon>
  //         <ListItemText primary={"Dashboard"} />
  //       </ListItem>
  //       <ListItem button key={"Deals"}>
  //         <ListItemIcon>
  //           <CardGiftcardIcon />
  //         </ListItemIcon>
  //         <ListItemText primary={"Deals"} />
  //       </ListItem>
  //       <ListItem button key={"Data Central"}>
  //         <ListItemIcon>
  //           <QueryStatsIcon />
  //         </ListItemIcon>
  //         <ListItemText primary={"Data Central"} />
  //       </ListItem>
  //     </List>
  //     <Divider />
  //     <List>
  //       <ListItem button key={"Account"}>
  //         <ListItemIcon>
  //           <AccountBoxIcon />
  //         </ListItemIcon>
  //         <ListItemText primary={"Account"} />
  //       </ListItem>
  //     </List>
  //   </Box>
  // )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ backgroundColor: 'white' }}>
        <Toolbar
          variant="dense"
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          {/* <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{
              mr: 2,
              svg: {
                color: COLOURS.PRIMARY_WHITE,
              },
            }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton> */}
          <FlexSpaceBetween
            style={{
              // display: "flex",
              // justifyContent: "space-between",
              width: `${MAX_WIDTH_PX}px`
            }}
          >
            <FlexCenterDiv>
              <Link href={`/`} passHref>
                <a>
                  <LogoImage
                    src={Logo}
                    width={100}
                    height={40}
                    alt="InKRAU logo png file"
                  />
                </a>
              </Link>
            </FlexCenterDiv>

            <FlexVerticalCenterDiv>
              {/* // user is signed-in and has username */}
              <FlexVerticalCenterDiv style={{ gap: '10px' }}>
                {/*
                 * REVIEW: temporarily closed
                 */}
                {/* <Tooltip title="코로나 전광판" placement="bottom" arrow>
                  <MasksIcon
                    style={{
                      cursor: 'pointer',
                      fontSize: '30px',
                      color: 'black'
                    }}
                    onClick={() => setCovidInfoOpen(true)}
                  />
                </Tooltip> */}
                {/* <Link href="/post/write" passHref> */}
                {/* <a> */}
                <Tooltip title="글쓰기" placement="bottom" arrow>
                  <DriveFileRenameOutlineIcon
                    onClick={() => {
                      if (!username) {
                        alert('로그인 후 글쓰기가 가능합니다.')
                        return
                      }
                      router.push('/post/write')
                    }}
                    style={{
                      cursor: 'pointer',
                      fontSize: '28px',
                      color: 'rebeccapurple'
                    }}
                  />
                </Tooltip>
                {/* </a> */}
                {/* </Link> */}

                {username ? (
                  // signed in user has username
                  <Link href={`/${username}`} passHref>
                    <a>
                      <UserImage
                        width={30}
                        height={30}
                        src={userAuth?.photoURL || '/hacker.png'}
                        alt="user photo"
                      />
                    </a>
                  </Link>
                ) : (
                  <Link href="/enter" passHref>
                    <a>
                      <Button
                        size="medium"
                        color="info"
                        style={{
                          color: COLOURS.PRIMARY_SPACE_GREY,
                          padding: '0px'
                        }}
                      >
                        LOG IN
                      </Button>
                    </a>
                  </Link>
                )}
                {isAdmin && (
                  <Tooltip
                    title="관리자로 로그인 되었습니다."
                    placement="bottom"
                    arrow
                  >
                    <AdminPanelSettingsIcon style={{ color: 'orange' }} />
                  </Tooltip>
                )}
              </FlexVerticalCenterDiv>
            </FlexVerticalCenterDiv>
          </FlexSpaceBetween>
        </Toolbar>
      </AppBar>
      {/* <SwipeableDrawer
        anchor="left"
        open={openDrawer}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {list()}
      </SwipeableDrawer> */}
      {covidInfoOpen && (
        <CovidInfoDialog open={covidInfoOpen} setOpen={setCovidInfoOpen} />
      )}
    </Box>
  )
}
