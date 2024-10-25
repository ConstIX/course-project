import { AccountCircle, Api, Dashboard, Login, Logout, Person, Public } from '@mui/icons-material'
import { AppBar, Box, Button, Toolbar, useMediaQuery } from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useGetUserByIdQuery } from '../../redux/services/users'
import i18n from '../../utils/i18n'
import DropdownMenu from '../ui/Menu'
import ThemeSwitcher from './ThemeSwitcher'

const Header: FC<{ isDarkMode: boolean; setIsDarkMode: (i: boolean) => void }> = ({ isDarkMode, setIsDarkMode }) => {
  const isMobile = useMediaQuery('(max-width: 450px)')
  const navigate = useNavigate()
  const { t } = useTranslation(['button'])

  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userID')
  const { data: user } = useGetUserByIdQuery(userId || '')

  const actions = [
    { label: t('button.profile'), icon: <Person fontSize="small" />, function: () => navigate('/profile') },
    ...(user && user.role === 'admin' ? [{ label: t('button.dashboard'), icon: <Dashboard fontSize="small" />, function: () => navigate('/dashboard') }] : []),
    {
      label: t('button.logout'),
      icon: <Logout fontSize="small" />,
      function: () => {
        localStorage.clear()
        navigate('/auth')
      }
    }
  ]

  const languageActions = [
    { label: 'EN - English', function: () => i18n.changeLanguage('en') },
    { label: 'RU - Русский', function: () => i18n.changeLanguage('ru') },
    { label: 'ES - Español', function: () => i18n.changeLanguage('es') }
  ]

  return (
    <Box>
      <AppBar position="fixed">
        <Toolbar>
          <Box className="custom-container flex items-center py-0 md1:p-0">
            <Link to="/" className="flex flex-1 items-center gap-3 text-2xl">
              <Api fontSize="large" /> {!isMobile && 'ReactApp'}
            </Link>

            <Box className="flex items-center gap-3">
              <ThemeSwitcher isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
              <DropdownMenu actions={languageActions} icon={<Public sx={{ color: '#fff' }} />} selected />

              {token ? (
                <DropdownMenu actions={actions} icon={<AccountCircle fontSize="large" sx={{ color: '#fff' }} />} isHeader />
              ) : (
                <Button onClick={() => navigate('/auth')} variant="contained" disableElevation startIcon={<Login />} sx={{ textTransform: 'none' }}>
                  {t('button.signIn')}
                </Button>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header
