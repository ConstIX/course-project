import { Home, Logout, Menu as MenuIcon, Person } from '@mui/icons-material'
import { AppBar, Box, Button, IconButton, Toolbar } from '@mui/material'
import { FC, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Link, useNavigate } from 'react-router-dom'
import { useGetUserByIdQuery } from '../../redux/services/users'
import HeaderDrawer from './HeaderDrawer'
import ThemeSwitcher from './ThemeSwitcher'

const navigation = [
  { label: 'Home', link: '/', icon: <Home /> },
  { label: 'Profile', link: '/profile', icon: <Person /> }
]

const Header: FC<any> = ({ isDarkMode, setIsDarkMode }) => {
  const userId = localStorage.getItem('userID')
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { data: user } = useGetUserByIdQuery(userId)

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
                {user && user.status === 'admin' && <Link to="/dashboard">Dashboard</Link>}
              </Box>
            )}

            <Box className="flex items-center gap-5">
              <ThemeSwitcher isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

              <Button onClick={handleLogout} color="inherit" startIcon={<Logout />} sx={{ textTransform: 'none' }}>
                {userId ? 'Logout' : 'Log-in'}
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <HeaderDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        navigation={navigation}
        status={user?.status || ''}
      />
    </Box>
  )
}

export default Header
