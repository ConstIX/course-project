import { Send } from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useCreateResponseMutation } from '../redux/services/answers'
import { useGetTemplateByIdQuery } from '../redux/services/templates'
import { useGetUserByIdQuery } from '../redux/services/users'

const FillForm: FC<{ readOnly: boolean }> = ({ readOnly = false }) => {
  const { id } = useParams()
  const { data: template } = useGetTemplateByIdQuery(id as string)
  const { data: user } = useGetUserByIdQuery(localStorage.getItem('userID') as string)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
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
            {errors[question.id] && <Typography color="error">{errors[question.id].message}</Typography>}

            {question.type === 'text' && (
              <TextField
                fullWidth
                variant="outlined"
                {...register(question.id, { required: 'This field is required' })}
                error={!!errors[question.id]}
                helperText={errors[question.id] && 'This field is required'}
                disabled={readOnly}
              />
            )}

            {question.type === 'number' && (
              <TextField
                fullWidth
                type="number"
                variant="outlined"
                {...register(question.id, { required: 'This field is required' })}
                error={!!errors[question.id]}
                helperText={errors[question.id] && 'This field is required'}
                disabled={readOnly}
              />
            )}

            {question.type === 'tags' && (
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                onChange={(_, newValue) => setValue(question.id, newValue)}
                disabled={readOnly}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    variant="outlined"
                    placeholder="Start typing..."
                    {...register(question.id, { required: 'This field is required' })}
                    error={!!errors[question.id]}
                    helperText={errors[question.id] && 'This field is required'}
                  />
                )}
              />
            )}

            {question.type === 'select' && (
              <Select
                fullWidth
                defaultValue=""
                {...register(question.id, { required: 'This field is required' })}
                error={!!errors[question.id]}
                disabled={readOnly}>
                {question.options &&
                  question.options.map((option: string, idx: number) => (
                    <MenuItem key={`${question.id}-${idx}`} value={option.trim()}>
                      {option.trim()}
                    </MenuItem>
                  ))}
              </Select>
            )}

            {question.type === 'radio' && (
              <RadioGroup row defaultValue="">
                {question.options &&
                  question.options.map((option: string, idx: number) => (
                    <FormControlLabel
                      key={`${question.id}-${idx}`}
                      label={option.trim()}
                      disabled={readOnly}
                      control={
                        <Radio
                          value={option.trim()}
                          {...register(question.id, { required: 'This field is required' })}
                        />
                      }
                    />
                  ))}
              </RadioGroup>
            )}

            {question.type === 'checkbox' && (
              <Box>
                {question.options &&
                  question.options.map((option: string, idx: number) => (
                    <FormControlLabel
                      key={`${question.id}-${idx}`}
                      label={option.trim()}
                      disabled={readOnly}
                      control={
                        <Checkbox
                          value={option.trim()}
                          {...register(question.id, { required: 'This field is required' })}
                        />
                      }
                    />
                  ))}
              </Box>
            )}
          </Box>
        ))}

        {readOnly ? (
          <Button onClick={() => navigate('/')} variant="contained" color="error" disableElevation>
            Back
          </Button>
        ) : (
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
        )}
      </Box>
    </Box>
  )
}

export default FillForm
