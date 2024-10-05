import { Add, Comment, ThumbUp } from '@mui/icons-material'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { FC } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useGetTemplatesQuery } from '../redux/services/templates'

const Home: FC = () => {
  const { data: templates } = useGetTemplatesQuery()
  const isMobile = useMediaQuery({ maxWidth: 450 })
  const token = localStorage.getItem('token')

  return (
    <Box className="mx-auto mt-32 w-full max-w-7xl px-3 md3:mt-24">
      <Box className="mb-10 flex items-center justify-between">
        <Typography variant="h4" color="primary">
          Templates
        </Typography>

        {token && (
          <Button href="/create-template" variant="contained" color="primary" disableElevation startIcon={<Add />}>
            New template
          </Button>
        )}
      </Box>

      <Box>
        {templates &&
          templates.map((obj) => (
            <Box key={obj.id} className="border-b py-5">
              <Typography variant="h6">{obj.title}</Typography>
              <Typography color="textSecondary">{obj.description}</Typography>

              <Box className="mt-5 flex gap-3">
                <Button href={`/view-form/${obj.id}`} variant="outlined" color="secondary" fullWidth={isMobile}>
                  View Form
                </Button>
                {token && (
                  <>
                    <Button href={`/fill-form/${obj.id}`} variant="outlined" color="primary" fullWidth={isMobile}>
                      Fill Form
                    </Button>
                    <Button
                      href={`/analyze-responses/${obj.id}`}
                      variant="outlined"
                      color="success"
                      fullWidth={isMobile}>
                      View Results
                    </Button>
                  </>
                )}
              </Box>

              {token && (
                <Box className="mt-5 flex gap-3">
                  <IconButton color="primary" size="small">
                    <Comment fontSize="small" />
                  </IconButton>
                  <IconButton color="primary" size="small">
                    <ThumbUp fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          ))}
      </Box>
    </Box>
  )
}

export default Home
