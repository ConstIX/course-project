import { Api, Dashboard, Login, Logout, Person } from '@mui/icons-material'
import { AppBar, Box, Button, Toolbar, useMediaQuery } from '@mui/material'
import { FC } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGetUserByIdQuery } from '../../redux/services/users'
import DropdownMenu from '../ui/Menu'
import ThemeSwitcher from './ThemeSwitcher'

const Header: FC<{ isDarkMode: boolean; setIsDarkMode: (i: boolean) => void }> = ({ isDarkMode, setIsDarkMode }) => {
  const isMobile = useMediaQuery('(max-width: 450px)')
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userID')
  const { data: user } = useGetUserByIdQuery(userId || '')

  const actions = [
    { label: 'Profile', icon: <Person fontSize="small" />, function: () => navigate('/profile') },
    ...(user && user.role === 'admin' ? [{ label: 'Dashboard', icon: <Dashboard fontSize="small" />, function: () => navigate('/dashboard') }] : []),
    {
      label: 'Logout',
      icon: <Logout fontSize="small" />,
      function: () => {
        localStorage.clear()
        navigate('/auth')
      }
    }
  ]

  return (
    <Box>
      <AppBar position="fixed">
        <Toolbar>
          <Box className="custom-container flex items-center py-0 md1:p-0">
            <Link to="/" className="flex flex-1 items-center gap-3 text-2xl">
              <Api fontSize="large" /> {!isMobile && 'ReactApp'}
            </Link>

            <ThemeSwitcher isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            {token ? (
              <DropdownMenu actions={actions} isHeader />
            ) : (
              <Button onClick={() => navigate('/auth')} variant="contained" disableElevation startIcon={<Login />} sx={{ textTransform: 'none' }}>
                Sign-in
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header
