import { Box, Tab, Tabs } from '@mui/material'
import { FC, useState } from 'react'

import MyResults from '../components/profile/MyResults'
import MyTemplates from '../components/profile/MyTemplates'

const Profile: FC = () => {
  const [tab, setTab] = useState<number>(0)

  return (
    <Box className="mx-auto w-full max-w-7xl space-y-10 px-3 py-32">
      <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
        <Tab label="Templates" sx={{ textTransform: 'none' }} />
        <Tab label="Results" sx={{ textTransform: 'none' }} />
      </Tabs>

      {tab === 0 ? <MyTemplates /> : <MyResults />}
    </Box>
  )
}

export default Profile
