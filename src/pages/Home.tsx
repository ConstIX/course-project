import { Add } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import { FC } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useGetTemplatesQuery } from '../redux/services/api'

const Home: FC = () => {
  const { data: templates } = useGetTemplatesQuery()
  const isMobile = useMediaQuery({ maxWidth: 450 })

  return (
    <Box className="space-y-10 py-5">
      <Box className="flex items-center justify-between">
        <Typography variant="h4" color="primary">
          Templates
        </Typography>

        <Button href="/create-template" variant="contained" color="primary" disableElevation startIcon={<Add />}>
          New template
        </Button>
      </Box>

      <Box>
        {templates &&
          templates.map((obj) => (
            <Box key={obj.id} className="border-b py-5">
              <Typography variant="h6">{obj.title}</Typography>
              <Typography color="textSecondary">{obj.description}</Typography>

              <Box className="mt-5 flex gap-3">
                <Button href={`/fill-form/${obj.id}`} variant="outlined" color="secondary" fullWidth={isMobile}>
                  Fill Form
                </Button>
                <Button href={`/analyze-responses/${obj.id}`} variant="outlined" color="success" fullWidth={isMobile}>
                  View Results
                </Button>
              </Box>
            </Box>
          ))}
      </Box>
    </Box>
  )
}

export default Home
