import { Box } from '@mui/material'
import { FC } from 'react'
import PopularTemplates from '../components/home/PopularTemplates'
import Templates from '../components/home/Templates'

const Home: FC = () => {
  return (
    <Box className="custom-container">
      <PopularTemplates />
      <Templates />
    </Box>
  )
}

export default Home
