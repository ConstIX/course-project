import { Send } from '@mui/icons-material'
import { Box, Button, Checkbox, FormControlLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useCreateResponseMutation } from '../redux/services/answers'
import { useGetTemplateByIdQuery } from '../redux/services/templates'
import { useGetUserByIdQuery } from '../redux/services/users'

const FillForm: FC = () => {
  const { id } = useParams()
  const { data: template } = useGetTemplateByIdQuery(id as string)
  const { data: user } = useGetUserByIdQuery(localStorage.getItem('userID') as string)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()
  const [createResponse, { isLoading }] = useCreateResponseMutation()
  const navigate = useNavigate()

  const submitHandler = async (data: any) => {
    const response = {
      authorId: template?.authorId,
      templateId: template?.id,
      userId: user.id,
      templateTitle: template?.title,
      answers: data
    }

    try {
      await createResponse(response).unwrap()
      navigate('/')
    } catch (error) {
      console.error('Failed to submit response:', error)
    }
  }

  return (
    <Box className="mx-auto mt-32 w-full max-w-7xl px-3 md3:mt-24">
      <Box>
        <Typography variant="h4" color="primary">
          {template?.title}
        </Typography>
        {template?.description && <Typography color="textSecondary">{template?.description}</Typography>}
      </Box>

      <Box component="form" onSubmit={handleSubmit(submitHandler)} className="mt-10 space-y-4">
        {template?.questions.map((question) => (
          <Box key={question.id}>
            <Typography variant="h6">{question.label}</Typography>
            {question.description && <Typography color="textSecondary">{question.description}</Typography>}

            {/* Text input */}
            {question.type === 'text' && (
              <TextField
                fullWidth
                variant="outlined"
                error={!!errors[question.id]}
                helperText={errors[question.id] && 'This field is required'}
                {...register(question.id, { required: 'This field is required' })}
              />
            )}

            {/* Number input */}
            {question.type === 'number' && (
              <TextField
                fullWidth
                type="number"
                variant="outlined"
                error={!!errors[question.id]}
                helperText={errors[question.id] && 'This field is required'}
                {...register(question.id, { required: 'This field is required' })}
              />
            )}

            {/* Select input */}
            {question.type === 'select' && (
              <Select
                fullWidth
                defaultValue=""
                error={!!errors[question.id]}
                {...register(question.id, { required: 'This field is required' })}>
                {question.options &&
                  question.options.map((option) => (
                    <MenuItem key={option} value={option.trim()}>
                      {option.trim()}
                    </MenuItem>
                  ))}
              </Select>
            )}

            {/* Checkbox input */}
            {question.type === 'checkbox' && (
              <Box>
                {question.options &&
                  question.options.map((option) => {
                    const value = option.trim() // Получаем значение чекбокса
                    return (
                      <FormControlLabel
                        key={value}
                        control={
                          <Checkbox
                            {...register(question.id)} // Регистрация чекбокса
                            value={value} // Устанавливаем значение для отправки
                          />
                        }
                        label={value}
                      />
                    )
                  })}
              </Box>
            )}
          </Box>
        ))}

        <Box className="flex justify-between">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            disableElevation
            endIcon={<Send />}>
            {isLoading ? 'Send...' : 'Send'}
          </Button>
          <Button onClick={() => navigate('/')} variant="contained" color="error" disableElevation>
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default FillForm
