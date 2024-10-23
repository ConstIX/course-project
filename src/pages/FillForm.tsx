import { ArrowBack, Send } from '@mui/icons-material'
import { Box, Button, Typography, useMediaQuery } from '@mui/material'
import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import RHFAutocomplete from '../components/ui/RHFAutocomplete'
import RHFCheckboxGroup from '../components/ui/RHFCheckboxGroup'
import RHFRadioGroup from '../components/ui/RHFRadioGroup'
import RHFSelect from '../components/ui/RHFSelect'
import RHFTextField from '../components/ui/RHFTextField'
import { useCreateResultsMutation, useUpdateResultsMutation } from '../redux/services/results'
import { useFillMutation, useGetTemplateByIdQuery } from '../redux/services/templates'
import { useGetUserByIdQuery } from '../redux/services/users'

interface ICurrentResponse {
  id: number
  userData: { name: string; email: string }
  [key: string]: string | number | { name: string; email: string }
}

interface IFillForm {
  readOnly?: boolean
  currentResponse: ICurrentResponse | null
  handleClose: () => void
}

const FillForm: FC<IFillForm> = ({ readOnly = false, currentResponse, handleClose }) => {
  const { control, handleSubmit, reset } = useForm<ICurrentResponse>()
  const { id } = useParams()

  const userId = localStorage.getItem('userID')
  const isMobile = useMediaQuery('(max-width: 450px)')
  const navigate = useNavigate()

  const { data: template } = useGetTemplateByIdQuery(id!)
  const { data: user } = useGetUserByIdQuery(userId!)

  const [createResults, { isLoading: createLoading }] = useCreateResultsMutation()
  const [updateResults, { isLoading: updateLoading }] = useUpdateResultsMutation()
  const [fill] = useFillMutation()

  const submitHandler = async (data: ICurrentResponse) => {
    const response = {
      authorId: template!.authorId,
      templateId: template!.id,
      userId,
      userData: { name: user!.username, email: user!.email },
      templateTitle: template!.title,
      answers: data
    }

    const newData = { answers: { ...data, id: undefined, userData: undefined } } // Remove unnecessary fields

    try {
      if (currentResponse) {
        await updateResults({ id: currentResponse.id, body: newData }).unwrap()
        handleClose()
      } else {
        await createResults(response).unwrap()
        await fill({ id: id!, filledBy: [...template!.filledBy, userId!] }).unwrap()
        navigate('/')
      }
    } catch (error) {
      console.error('Failed to submit response:', error)
    }
  }

  useEffect(() => {
    if (currentResponse) reset(currentResponse)
  }, [currentResponse, reset])

  return (
    <Box className="custom-container">
      <Typography variant="h4" color="primary">
        {template?.title}
      </Typography>
      {template?.description && <Typography color="textSecondary">{template.description}</Typography>}

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
              <Button onClick={() => navigate('/')} variant="outlined" color="error" fullWidth={isMobile}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={createLoading || updateLoading} disableElevation fullWidth={isMobile} endIcon={<Send />}>
                {createLoading || updateLoading ? 'Send...' : 'Send'}
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default FillForm
