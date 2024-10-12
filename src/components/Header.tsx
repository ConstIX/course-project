import { Logout, Menu as MenuIcon } from '@mui/icons-material'
import MailIcon from '@mui/icons-material/Mail'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar
} from '@mui/material'
import { FC, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Link, useNavigate } from 'react-router-dom'

const navigation = [
  { label: 'Home', link: '/' },
  { label: 'Profile', link: '/profile' }
]

const Header: FC = () => {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const isMobile = useMediaQuery({ maxWidth: 767.98 })

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userID')
    navigate('/auth')
  }

  return (
    <Box>
      <AppBar position="fixed">
        <Toolbar>
          <Box className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 md1:p-0">
            {isMobile ? (
              <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
            ) : (
              <Box className="flex gap-5">
                {navigation.map((obj) => (
                  <Link key={obj.label} to={obj.link}>
                    {obj.label}
                  </Link>
                ))}
                <Link key="dashboard" to="/dashboard">
                  Dashboard
                </Link>
              </Box>
            )}
            <Button onClick={handleLogout} color="inherit" startIcon={<Logout />} sx={{ textTransform: 'none' }}>
              {token ? 'Logout' : 'Log-in'}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: '250px' }}>
          <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  )
}

export default Header
