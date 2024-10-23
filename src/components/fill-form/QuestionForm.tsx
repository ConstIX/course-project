import { ArrowBack, Send } from '@mui/icons-material'
import { Box, Button, Typography, useMediaQuery } from '@mui/material'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCreateResultsMutation, useUpdateResultsMutation } from '../../redux/services/results'
import { useFillMutation } from '../../redux/services/templates'
import { useGetUserByIdQuery } from '../../redux/services/users'
import { ICurrentResults } from '../../types/results.types'
import { ITemplate } from '../../types/templates.types'
import RHFAutocomplete from '../ui/RHFAutocomplete'
import RHFCheckboxGroup from '../ui/RHFCheckboxGroup'
import RHFRadioGroup from '../ui/RHFRadioGroup'
import RHFSelect from '../ui/RHFSelect'
import RHFTextField from '../ui/RHFTextField'

interface IQuestionForm {
  template?: ITemplate
  currentResults?: ICurrentResults | null
  readOnly: boolean
  handleClose?: () => void
  setSnackbarState?: (state: { message: string; open: boolean; severity: 'success' | 'error' }) => void
}

const QuestionForm: FC<IQuestionForm> = ({ template, currentResults, readOnly, handleClose, setSnackbarState }) => {
  const { control, handleSubmit } = useFormContext<ICurrentResults>()

  const userId = localStorage.getItem('userID')
  const isMobile = useMediaQuery('(max-width: 450px)')
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const { data: user } = useGetUserByIdQuery(userId!)
  const [createResults, { isLoading: createLoading }] = useCreateResultsMutation()
  const [updateResults, { isLoading: updateLoading }] = useUpdateResultsMutation()
  const [fill] = useFillMutation()

  const submitHandler = async (data: ICurrentResults) => {
    const response = {
      authorId: template!.authorId,
      templateId: template!.id,
      userId,
      userData: { name: user!.username, email: user!.email },
      templateTitle: template!.title,
      answers: data
    }

    const newData = { answers: { ...data, id: undefined, userData: undefined } }

    try {
      if (currentResults) {
        await updateResults({ id: currentResults.id, body: newData }).unwrap()
        if (handleClose) handleClose()
        if (setSnackbarState) setSnackbarState({ message: 'Result edited successfuly.', open: true, severity: 'success' })
      } else {
        await createResults(response).unwrap()
        await fill({ id: template!.id!, filledBy: [...template!.filledBy, userId!] }).unwrap()
        navigate('/')
      }
    } catch (error) {
      if (setSnackbarState) setSnackbarState({ message: 'Something went wrong.', open: true, severity: 'error' })
      console.error('Failed to edit result:', error)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(submitHandler)} className="mt-10">
      <Box className="mb-10 space-y-4">
        {template?.questions.map(({ id, label, description, type, options }) => (
          <Box key={id}>
            <Typography color="textSecondary">{label}</Typography>
            {description && <Typography color="textSecondary">{description}</Typography>}
            {type === 'text' && <RHFTextField name={id} control={control} rules={{ required: 'This field is required!' }} disabled={readOnly} />}
            {type === 'number' && <RHFTextField type="number" name={id} control={control} rules={{ required: 'This field is required!' }} disabled={readOnly} />}
            {type === 'tags' && <RHFAutocomplete name={id} control={control} rules={{ required: 'This field is required!' }} freeSolo disabled={readOnly} />}
            {type === 'select' && <RHFSelect name={id} control={control} options={options} rules={{ required: 'This field is required!' }} disabled={readOnly} />}
            {type === 'radio' && <RHFRadioGroup name={id} control={control} options={options} rules={{ required: 'This field is required!' }} disabled={readOnly} />}
            {type === 'checkbox' && <RHFCheckboxGroup name={id} control={control} options={options} rules={{ required: 'This field is required!' }} disabled={readOnly} />}
          </Box>
        ))}
      </Box>

      <Box className="flex justify-end gap-3">
        {readOnly ? (
          <Button onClick={() => navigate('/')} variant="contained" color="primary" disableElevation fullWidth={isMobile} startIcon={<ArrowBack />}>
            Back
          </Button>
        ) : (
          <>
            <Button
              onClick={() => {
                if (pathname.startsWith('/view-results') && handleClose) handleClose()
                else navigate('/')
              }}
              variant="outlined"
              color="error"
              fullWidth={isMobile}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={createLoading || updateLoading} disableElevation fullWidth={isMobile} endIcon={<Send />}>
              {createLoading || updateLoading ? 'Send...' : 'Send'}
            </Button>
          </>
        )}
      </Box>
    </Box>
  )
}

export default QuestionForm
