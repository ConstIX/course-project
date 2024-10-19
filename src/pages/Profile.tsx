import { Grading, Newspaper } from '@mui/icons-material'
import { Box, Tab, Tabs, useMediaQuery } from '@mui/material'
import { FC, useState } from 'react'
import MyResults from '../components/profile/MyResults'
import MyTemplates from '../components/profile/MyTemplates'

const tabs = [
  { label: 'Templates', icon: <Newspaper /> },
  { label: 'Results', icon: <Grading /> }
]

const Profile: FC = () => {
  const [tab, setTab] = useState<number>(0)
  const isMobile = useMediaQuery('(max-width: 450px)')

  return (
    <Box className="mx-auto mt-32 w-full max-w-7xl space-y-10 px-3 md3:mt-24">
      <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} variant={isMobile ? 'fullWidth' : 'standard'}>
        {tabs.map((obj) => (
          <Tab key={obj.label} label={obj.label} icon={obj.icon} iconPosition="start" sx={{ textTransform: 'none' }} />
        ))}
      </Tabs>

      {tab === 0 ? <MyTemplates isMobile={isMobile} /> : <MyResults />}
    </Box>
  )
}

export default Profile
