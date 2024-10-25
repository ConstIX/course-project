import { ArrowBack, Grading, Newspaper } from '@mui/icons-material'
import { Box, Button, Tab, Tabs, Typography, useMediaQuery } from '@mui/material'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import MyResults from '../components/profile/MyResults'
import MyTemplates from '../components/profile/MyTemplates'

const tabs = [
  { label: 'Templates', icon: <Newspaper /> },
  { label: 'Results', icon: <Grading /> }
]

const Profile: FC = () => {
  const [tab, setTab] = useState<number>(0)

  const isMobile = useMediaQuery('(max-width: 450px)')
  const navigate = useNavigate()
  const { t } = useTranslation(['title', 'button'])

  return (
    <Box className="custom-container">
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
            <Tab key={obj.label} label={t(`title.${obj.label.toLowerCase()}`)} icon={obj.icon} iconPosition="start" sx={{ textTransform: 'none' }} />
          ))}
        </Tabs>

        {tab === 0 ? <MyTemplates isMobile={isMobile} /> : <MyResults />}
      </Box>
    </Box>
  )
}

export default Profile
