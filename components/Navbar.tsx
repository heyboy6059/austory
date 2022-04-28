import { useContext, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { UserContext } from '../common/context'
import {
  COLOURS,
  MAX_WIDTH_PX,
  REQUEST_GOOGLE_FORM_URL
} from '../common/constants'
import {
  LogoImage,
  FlexVerticalCenterDiv,
  FlexSpaceBetween,
  FlexCenterDiv
} from '../common/uiComponents'

import Logo from '../public/inKRAU_New_Logo_200_80.png'

/**
 * Material UI
 */
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import MenuIcon from '@mui/icons-material/Menu'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import QuizIcon from '@mui/icons-material/Quiz'
import LogoutIcon from '@mui/icons-material/Logout'
import FavoriteIcon from '@mui/icons-material/Favorite'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import Tooltip from '@mui/material/Tooltip'
import CovidInfoDialog from './CovidInfoDialog'
import router from 'next/router'
import { auth } from '../common/firebase'
import toast from 'react-hot-toast'

// Top navbar
export default function Navbar() {
  const { userAuth, username, isAdmin, user, firebaseAuthLoading } =
    useContext(UserContext)
  const [covidInfoOpen, setCovidInfoOpen] = useState(false)

  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [openDrawer, setOpenDrawer] = useState(false)

  // const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget)
  // }

  // const handleClose = () => {
  //   setAnchorEl(null)
  // }

  const isLoggingIn = useMemo(
    () => !firebaseAuthLoading && userAuth && user,
    [firebaseAuthLoading, user, userAuth]
  )

  const toggleDrawer = useCallback(
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }

      setOpenDrawer(open)
    },
    []
  )

  const list = () => (
    <Box
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {user ? (
          <>
            <ListItem
              button
              key={'Account'}
              onClick={() => router.push(`/${username}`)}
            >
              <ListItemIcon>
                <AccountBoxIcon />
              </ListItemIcon>
              <ListItemText primary={'내 계정'} />
            </ListItem>
            <ListItem
              button
              key={'HeartPosts'}
              onClick={() => router.push(`/user/heartPosts`)}
            >
              <ListItemIcon>
                <FavoriteIcon />
              </ListItemIcon>
              <ListItemText primary={'하트 누른 게시물'} />
            </ListItem>
            <ListItem
              button
              key={'Stats'}
              onClick={() => router.push(`/user/stats`)}
            >
              <ListItemIcon>
                <QueryStatsIcon />
              </ListItemIcon>
              <ListItemText primary={'나의 활동'} />
            </ListItem>
          </>
        ) : (
          <ListItem
            button
            key={'Account'}
            onClick={() => router.push(`/enter`)}
          >
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText
              primary={'등록'}
              secondary={'정상적인 이용을 위해 등록을 해주세요.'}
            />
          </ListItem>
        )}
      </List>
      <Divider />
      <List>
        <ListItem
          button
          key={'Request'}
          onClick={() => window.open(REQUEST_GOOGLE_FORM_URL, '_blank').focus()}
        >
          <ListItemIcon>
            <QuizIcon />
          </ListItemIcon>
          <ListItemText primary={'문의'} />
        </ListItem>
        <ListItem
          button
          key={'LogOut'}
          onClick={async () => {
            await auth.signOut()
            router.push('/')
            toast.success(`로그아웃 되었습니다.`)
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={'로그아웃'} />
        </ListItem>
      </List>
      {isAdmin && (
        <>
          <Divider />
          <List>
            <ListItem
              button
              key={'Admin'}
              onClick={() => router.push('/admin')}
            >
              <ListItemIcon>
                <AdminPanelSettingsIcon style={{ color: 'orange' }} />
              </ListItemIcon>
              <ListItemText primary={'관리자 페이지'} />
            </ListItem>
          </List>
        </>
      )}
    </Box>
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ backgroundColor: 'white' }}>
        <Toolbar
          variant="dense"
          style={{ display: 'flex', justifyContent: 'center' }}
        >
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
                    priority={true}
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

                {/* </a> */}
                {/* </Link> */}

                {isLoggingIn ? (
                  // signed in user has username
                  // <Link href={`/${username}`} passHref>
                  //   <a>
                  //     <UserImage
                  //       width={30}
                  //       height={30}
                  //       src={userAuth?.photoURL || '/hacker.png'}
                  //       alt="user photo"
                  //     />
                  //   </a>
                  // </Link>
                  <FlexVerticalCenterDiv
                    style={{
                      color: COLOURS.SECONDARY_SPACE_GREY,
                      fontSize: '13px',
                      maxWidth: '125px'
                    }}
                  >
                    <AccountBoxIcon fontSize="small" />
                    {username}
                  </FlexVerticalCenterDiv>
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
                {isAdmin && (
                  <Tooltip
                    title="관리자로 로그인 되었습니다."
                    placement="bottom"
                    arrow
                  >
                    <AdminPanelSettingsIcon style={{ color: 'orange' }} />
                  </Tooltip>
                )}
                {isLoggingIn && (
                  <IconButton
                    size="large"
                    edge="start"
                    aria-label="menu"
                    sx={{
                      svg: {
                        color: COLOURS.LIGHT_PURPLE
                      }
                    }}
                    style={{
                      paddingRight: '0'
                    }}
                    onClick={toggleDrawer(true)}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
              </FlexVerticalCenterDiv>
            </FlexVerticalCenterDiv>
          </FlexSpaceBetween>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        anchor="right"
        open={openDrawer}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {list()}
      </SwipeableDrawer>
      {covidInfoOpen && (
        <CovidInfoDialog open={covidInfoOpen} setOpen={setCovidInfoOpen} />
      )}
    </Box>
  )
}
