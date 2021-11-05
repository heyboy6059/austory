import { useContext, useState } from "react"
import Link from "next/link"
import { UserContext } from "../lib/context"

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
// import AccountCircle from "@mui/icons-material/AccountCircle"
// import MenuItem from "@mui/material/MenuItem"
// import Menu from "@mui/material/Menu"

// Top navbar
export default function Navbar() {
  const { user, username } = useContext(UserContext)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ backgroundColor: "#666666" }}>
        <Toolbar variant="dense">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Link href={`/`}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              InKRAU
            </Typography>
          </Link>
          {/* {username && ( */}
          <div>
            {/* user is not signed OR has not created username */}
            {!username ? (
              <Link href="/enter">
                <Button>Log in</Button>
              </Link>
            ) : (
              <Link href={`/${username}`}>
                <img width="30px" height="30px" src={user?.photoURL} />
              </Link>
            )}
            {/* <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
              </Menu> */}
          </div>
          {/* // )} */}
        </Toolbar>
      </AppBar>
    </Box>
    // <nav className="navbar">
    //   <ul>
    //     <li>
    //       <Link href="/">
    //         <button className="btn-logo">FEED</button>
    //       </Link>
    //     </li>

    //     {/* user is signed-in and has username */}
    //     {username && (
    //       <>
    //         <li className="push-left">
    //           <Link href="/dashboard">
    //             <button className="btn-blue">Write Posts</button>
    //           </Link>
    //         </li>
    //         <li>
    //           <Link href={`/${username}`}>
    //             <img src={user?.photoURL} />
    //           </Link>
    //         </li>
    //       </>
    //     )}

    //     {/* user is not signed OR has not created username */}
    //     {!username && (
    //       <li>
    //         <Link href="/enter">
    //           <button className="btn-blue">Log in</button>
    //         </Link>
    //       </li>
    //     )}
    //   </ul>
    // </nav>
  )
}
