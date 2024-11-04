import { AccountCircle, Api, Dashboard, HelpOutlined, Login, Logout, Person, Public, ReportProblem } from '@mui/icons-material'
import { Alert, AppBar, Box, Button, Snackbar, Toolbar, useMediaQuery } from '@mui/material'
import moment from 'moment'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useCreateTicketMutation, useCreateUserMutation } from '../../redux/services/jira'
import { useGetUserByIdQuery } from '../../redux/services/users'
import i18n from '../../utils/i18n'
import IntegrationForm from '../ui/IntegrationForm'
import DropdownMenu from '../ui/Menu'
import ThemeSwitcher from './ThemeSwitcher'

const Header: FC<{ isDarkMode: boolean; setIsDarkMode: (i: boolean) => void }> = ({ isDarkMode, setIsDarkMode }) => {
  const [open, setOpen] = useState<boolean>(false)
  const [snackbarState, setSnackbarState] = useState<{ message: string; open: boolean; severity: 'success' | 'error' }>({
    message: '',
    open: false,
    severity: 'success' as 'success' | 'error'
  })

  const isMobile = useMediaQuery('(max-width: 450px)')
  const navigate = useNavigate()
  const { t } = useTranslation(['button'])

  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userID')

  const { data: user } = useGetUserByIdQuery(userId || '')
  const [createUser, { isLoading }] = useCreateUserMutation()
  const [createTicket] = useCreateTicketMutation()

  const profileActions = [
    { label: t('button.profile'), icon: <Person fontSize="small" />, function: () => navigate('/profile') },
    ...(user && user.role === 'admin' ? [{ label: t('button.dashboard'), icon: <Dashboard fontSize="small" />, function: () => navigate('/dashboard') }] : []),
    {
      label: t('button.logout'),
      icon: <Logout fontSize="small" />,
      function: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userID')
        navigate('/auth')
      }
    }
  ]
  const languageActions = [
    { label: 'EN - English', function: () => i18n.changeLanguage('en') },
    { label: 'RU - Русский', function: () => i18n.changeLanguage('ru') },
    { label: 'ES - Español', function: () => i18n.changeLanguage('es') }
  ]
  const supportActions = [{ label: t('button.contactSupport'), icon: <ReportProblem fontSize="small" />, function: () => setOpen(true) }]

  const fields = [
    { type: 'text', name: 'summary', label: 'fieldRequired' },
    { type: 'text', name: 'description' },
    { type: 'select', name: 'priority', label: 'fieldRequired' },
    { type: 'text', name: 'templateTitle' },
    { type: 'text', name: 'link', label: 'fieldRequired' }
  ]

  const onSubmit = async (userData: Record<string, string>) => {
    const { accountId, emailAddress } = await createUser({
      emailAddress: user?.email || '',
      displayName: user?.username || '',
      products: [],
      active: true,
      notification: true
    }).unwrap()
    await createTicket({
      fields: {
        project: { key: 'STNB' },
        summary: userData.summary,
        description: userData.description || '',
        issuetype: { name: 'Task' },
        priority: { name: userData.priority },
        duedate: moment().format('YYYY-MM-DD'),
        customfield_10041: userData.templateTitle,
        customfield_10048: userData.link,
        reporter: { accountId, emailAddress }
      }
    }).unwrap()

    localStorage.setItem('userJiraId', accountId)
  }

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

              {token && <DropdownMenu actions={supportActions} icon={<HelpOutlined sx={{ color: '#fff' }} />} />}
              <DropdownMenu actions={languageActions} icon={<Public sx={{ color: '#fff' }} />} selected />

              {token ? (
                <DropdownMenu actions={profileActions} icon={<AccountCircle fontSize="large" sx={{ color: '#fff' }} />} isHeader user={user} />
              ) : (
                <Button onClick={() => navigate('/auth')} variant="contained" disableElevation startIcon={<Login />} sx={{ textTransform: 'none' }}>
                  {t('button.signIn')}
                </Button>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {token && <IntegrationForm open={open} setOpen={setOpen} setSnackbarState={setSnackbarState} fields={fields} onSubmit={onSubmit} title="sendTicket" isLoading={isLoading} />}

      <Snackbar open={snackbarState.open} autoHideDuration={3000} onClose={() => setSnackbarState((prev) => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbarState((prev) => ({ ...prev, open: false }))} severity={snackbarState.severity}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Header
