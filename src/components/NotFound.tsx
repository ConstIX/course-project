import { Box, Typography } from '@mui/material'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound: FC = () => {
  const navigate = useNavigate()

  return (
    <Box className="flex flex-1 items-center justify-center p-[120px_10px_10px_10px]">
      <Box className="space-y-7 text-center">
        <Typography variant="h1" color="textSecondary">
          404
        </Typography>
        <Typography variant="h4" color="textDisabled">
          Page not found!
        </Typography>
        <Typography color="textSecondary">
          The page you are looking for doesnt't exist or an other error occurred. <br /> Go back, or head over to{' '}
          <Typography onClick={() => navigate('/')} color="primary" sx={{ display: 'inline', cursor: 'pointer' }}>
            ReactApp.com
          </Typography>{' '}
          to choose a new direction.
        </Typography>
      </Box>
    </Box>
  )
}

export default NotFound
