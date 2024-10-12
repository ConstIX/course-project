import { Box } from '@mui/material'
import { FC } from 'react'
import PopularTemplates from '../components/home/PopularTemplates'
import Templates from '../components/home/Templates'

const Home: FC = () => {
  return (
    <Box className="mx-auto w-full max-w-7xl px-3 py-32 md3:mt-24">
      <PopularTemplates />
      <Templates />
    </Box>
  )
}

export default Home
