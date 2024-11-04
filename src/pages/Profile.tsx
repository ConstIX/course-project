import { ArrowBack, CloudSync, Grading, LocalActivity, Newspaper } from '@mui/icons-material'
import { Alert, Box, Button, Snackbar, Tab, Tabs, Typography, useMediaQuery } from '@mui/material'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import MyResults from '../components/profile/MyResults'
import MyTemplates from '../components/profile/MyTemplates'
import MyTickets from '../components/profile/MyTickets'
import IntegrationForm from '../components/ui/IntegrationForm'
import { useGetSalesforceUsersQuery, useRegisterSalesforceAccountMutation, useRegisterSalesforceContactMutation } from '../redux/services/salesforce'
import { useGetUserByIdQuery } from '../redux/services/users'
import { ISalesforceUser } from '../types/salesforce.types'

const tabs = [
  { label: 'templates', icon: <Newspaper /> },
  { label: 'results', icon: <Grading /> },
  { label: 'tickets', icon: <LocalActivity /> }
]

const Profile: FC = () => {
  const [tab, setTab] = useState<number>(0)
  const [open, setOpen] = useState<boolean>(false)
  const [snackbarState, setSnackbarState] = useState<{ message: string; open: boolean; severity: 'success' | 'error' }>({
    message: '',
    open: false,
    severity: 'success' as 'success' | 'error'
  })

  const userId = localStorage.getItem('userID')
  const isMobile = useMediaQuery('(max-width: 450px)')
  const navigate = useNavigate()
  const { t } = useTranslation(['title', 'button'])

  const { data: user } = useGetUserByIdQuery(userId!)
  const { data: salesforceUsers } = useGetSalesforceUsersQuery() as { data?: ISalesforceUser }
  const [registerSalesforceAccount, { isLoading }] = useRegisterSalesforceAccountMutation()
  const [registerSalesforceContact] = useRegisterSalesforceContactMutation()
  const isConnected = salesforceUsers?.recentItems?.some((obj) => obj.Name === user?.username) ?? false

  const fields = [
    { type: 'text', name: 'phone' },
    { type: 'text', name: 'fax' }
  ]

  const onSubmit = async (userData: Record<string, string>) => {
    const { id: accountId } = await registerSalesforceAccount({ Name: user?.username || '-' }).unwrap()
    await registerSalesforceContact({
      LastName: user?.username || '',
      Email: user?.email || '',
      Phone: userData.phone,
      Fax: userData.fax,
      AccountId: accountId
    }).unwrap()
  }

  return (
    <Box className="custom-container p-[100px_10px_60px_10px]">
      <Button onClick={() => setOpen(true)} variant="outlined" color="primary" fullWidth={isMobile} disableElevation startIcon={<CloudSync />} sx={{ marginBottom: '150px' }} disabled={isConnected}>
        {t(`button.${isConnected ? 'connected' : 'connect'}`, { ns: 'button' })}
      </Button>

      <IntegrationForm open={open} setOpen={setOpen} setSnackbarState={setSnackbarState} fields={fields} onSubmit={onSubmit} title="optionalSettings" isLoading={isLoading} />

      <Box className="mb-5 flex items-center justify-between gap-5">
        <Typography variant="h4" color="primary">
          {t('title.profile')}
        </Typography>
        <Button onClick={() => navigate('/')} variant="text" color="primary" startIcon={<ArrowBack />}>
          {t('button.back', { ns: 'button' })}
        </Button>
      </Box>

      <Box className="space-y-10">
        <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} variant={isMobile ? 'fullWidth' : 'standard'}>
          {tabs.map((obj) => (
            <Tab key={obj.label} label={t(`title.${obj.label}`)} icon={obj.icon} iconPosition="start" sx={{ textTransform: 'none' }} />
          ))}
        </Tabs>

        {tab === 0 && <MyTemplates isMobile={isMobile} />}
        {tab === 1 && <MyResults />}
        {tab === 2 && <MyTickets />}
      </Box>

      <Snackbar open={snackbarState.open} autoHideDuration={3000} onClose={() => setSnackbarState((prev) => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbarState((prev) => ({ ...prev, open: false }))} severity={snackbarState.severity}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Profile
