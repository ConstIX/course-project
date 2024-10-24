import { ArrowBack } from '@mui/icons-material'
import { Alert, Box, Button, CircularProgress, Snackbar, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import NotFound from '../components/NotFound'
import ResultsEditModal from '../components/view-results/ResultsEditModal'
import ResultsTable from '../components/view-results/ResultsTable'
import { useGetTemplateByIdQuery } from '../redux/services/templates'
import { ICurrentResults } from '../types/results.types'

const ViewResults: FC = () => {
  const [snackbarState, setSnackbarState] = useState<{ message: string; open: boolean; severity: 'success' | 'error' }>({
    message: '',
    open: false,
    severity: 'success' as 'success' | 'error'
  })
  const [open, setOpen] = useState(false)
  const [currentResults, setCurrentResults] = useState<ICurrentResults | null>(null)

  const { id } = useParams()
  const navigate = useNavigate()
  const { data: template, error, isLoading } = useGetTemplateByIdQuery(id!)

  const handleOpen = (response: ICurrentResults) => {
    setCurrentResults(response)
    setOpen(true)
  }

  const handleClose = () => {
    setCurrentResults(null)
    setOpen(false)
  }

  if (isLoading) {
    return (
      <Box className="flex flex-1 items-center justify-center py-32 text-center">
        <CircularProgress />
      </Box>
    )
  }

  if (error || !template) return <NotFound />

  return (
    <Box className="custom-container">
      <Box className="mb-10 flex items-center justify-between gap-5">
        <Typography variant="h4" color="primary">
          Results
        </Typography>
        <Button onClick={() => navigate('/')} variant="text" color="primary" startIcon={<ArrowBack />}>
          Back
        </Button>
      </Box>

      <ResultsTable template={template} handleOpen={handleOpen} setSnackbarState={setSnackbarState} />
      <ResultsEditModal open={open} handleClose={handleClose} currentResults={currentResults} setSnackbarState={setSnackbarState} />

      <Snackbar open={snackbarState.open} autoHideDuration={3000} onClose={() => setSnackbarState((prev) => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbarState.severity} onClose={() => setSnackbarState((prev) => ({ ...prev, open: false }))}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ViewResults
