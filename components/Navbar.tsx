import { useContext, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { UserContext } from "../lib/context"
import { COLOURS } from "../common/constants"
import { ImageWrapper } from "../common/uiComponents"

/**
 * Material UI
 */
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import Button from "@mui/material/Button"
import MenuIcon from "@mui/icons-material/Menu"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import List from "@mui/material/List"
import Divider from "@mui/material/Divider"
import InboxIcon from "@mui/icons-material/MoveToInbox"
import MailIcon from "@mui/icons-material/Mail"

// Top navbar
export default function Navbar() {
  const { user, username } = useContext(UserContext)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [openDrawer, setOpenDrawer] = useState(false)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const toggleDrawer = useCallback(
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
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
        {["Dashboard", "Deals", "Data Central"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["Account"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        style={{ backgroundColor: COLOURS.PRIMARY_SPACE_GREY }}
      >
        <Toolbar variant="dense">
          <IconButton
            size="large"
            edge="start"
            // color="inherit"
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
          </IconButton>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Link href={`/`} passHref>
              <ImageWrapper style={{ display: "flex", cursor: "pointer" }}>
                <Image
                  src="/../public/InKRAU_Logo.png"
                  width={75}
                  height={35}
                  alt="InKRAU logo png file"
                />
              </ImageWrapper>
            </Link>

            {/* user is signed-in and has username */}
            {/* {username && (
              <Link href="/dashboard">
                <button className="btn-blue">Write Posts</button>
              </Link>
            )} */}

            <div>
              {/* user is not signed OR has not created username */}
              {!username ? (
                <Link href="/enter" passHref>
                  <Button size="small" variant="outlined" color="info">
                    Log in
                  </Button>
                </Link>
              ) : (
                // user is signed-in and has username
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Link href="/dashboard" passHref>
                    <Button
                      size="small"
                      variant="outlined"
                      style={{
                        color: COLOURS.PRIMARY_WHITE,
                        borderColor: COLOURS.PRIMARY_WHITE,
                      }}
                    >
                      Write Posts
                    </Button>
                  </Link>
                  <Link href={`/${username}`} passHref>
                    <ImageWrapper
                      style={{
                        display: "flex",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                    >
                      <Image
                        width={30}
                        height={30}
                        src={user?.photoURL}
                        alt="user photo"
                      />
                    </ImageWrapper>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        anchor="left"
        open={openDrawer}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {list()}
      </SwipeableDrawer>
    </Box>
  )
}
