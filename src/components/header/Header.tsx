import { Api } from '@mui/icons-material'
import { AppBar, Box, Toolbar, useMediaQuery } from '@mui/material'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import HeaderMenu from './HeaderMenu'
import ThemeSwitcher from './ThemeSwitcher'

const Header: FC<{ isDarkMode: boolean; setIsDarkMode: (i: boolean) => void }> = ({ isDarkMode, setIsDarkMode }) => {
  const isMobile = useMediaQuery('(max-width: 450px)')

  return (
    <Box>
      <AppBar position="fixed">
        <Toolbar>
          <Box className="mx-auto flex w-full max-w-7xl items-center px-3 md1:p-0">
            <Link to="/" className="flex flex-1 gap-3 text-2xl">
              <Api fontSize="large" /> {!isMobile && 'ReactApp'}
            </Link>

            <ThemeSwitcher isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            <HeaderMenu />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header
