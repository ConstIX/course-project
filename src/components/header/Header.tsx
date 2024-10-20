import { Api, Login } from '@mui/icons-material'
import { AppBar, Box, Button, Toolbar, useMediaQuery } from '@mui/material'
import { FC } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HeaderMenu from './HeaderMenu'
import ThemeSwitcher from './ThemeSwitcher'

const Header: FC<{ isDarkMode: boolean; setIsDarkMode: (i: boolean) => void }> = ({ isDarkMode, setIsDarkMode }) => {
  const isMobile = useMediaQuery('(max-width: 450px)')
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

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
              <HeaderMenu />
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
