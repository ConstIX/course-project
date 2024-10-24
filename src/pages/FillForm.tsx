import { Box, CircularProgress, Typography } from '@mui/material'
import { FC, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation, useParams } from 'react-router-dom'
import QuestionForm from '../components/fill-form/QuestionForm'
import { useGetTemplateByIdQuery } from '../redux/services/templates'
import { ICurrentResults } from '../types/results.types'

interface IFillForm {
  readOnly?: boolean
  currentResults?: ICurrentResults | null
  handleClose?: () => void
  setSnackbarState?: (state: { message: string; open: boolean; severity: 'success' | 'error' }) => void
}

const FillForm: FC<IFillForm> = ({ readOnly = false, currentResults, handleClose, setSnackbarState }) => {
  const methods = useForm()

  const { id } = useParams()
  const { pathname } = useLocation()
  const { data: template, isLoading } = useGetTemplateByIdQuery(id!)

  useEffect(() => {
    if (currentResults) methods.reset(currentResults)
  }, [currentResults, methods])

  if (isLoading) {
    return (
      <Box className="flex flex-1 items-center justify-center py-32 text-center">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <FormProvider {...methods}>
      <Box className={`${pathname.startsWith('/view-results') ? '' : 'custom-container'}`}>
        <Box className="mb-10">
          <Typography variant="h4" color="primary">
            {template?.title}
          </Typography>
          {template?.description && <Typography color="textSecondary">{template.description}</Typography>}
        </Box>

        <QuestionForm template={template} currentResults={currentResults} readOnly={readOnly} handleClose={handleClose} setSnackbarState={setSnackbarState} />
      </Box>
    </FormProvider>
  )
}

export default FillForm
