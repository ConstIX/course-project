import { Logout, Menu as MenuIcon } from '@mui/icons-material'
import { AppBar, Box, Button, IconButton, Toolbar } from '@mui/material'
import { FC, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Link, useNavigate } from 'react-router-dom'
import HeaderDrawer from './HeaderDrawer'
import ThemeSwitcher from './ThemeSwitcher'

const navigation = [
  { label: 'Home', link: '/' },
  { label: 'Profile', link: '/profile' }
]

const Header: FC<any> = ({ isDarkMode, setIsDarkMode }) => {
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
            <ThemeSwitcher isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

            <Button onClick={handleLogout} color="inherit" startIcon={<Logout />} sx={{ textTransform: 'none' }}>
              {token ? 'Logout' : 'Log-in'}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <HeaderDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} navigation={navigation} />
    </Box>
  )
}

export default Header
