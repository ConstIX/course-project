import { Send } from '@mui/icons-material'
import { Autocomplete, Box, Button, Checkbox, FormControlLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material'
import { FC, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useCreateResultsMutation, useUpdateResultsMutation } from '../redux/services/results'
import { useGetTemplateByIdQuery, useIncrementFillsMutation } from '../redux/services/templates'
import { useGetUserByIdQuery } from '../redux/services/users'

const FillForm: FC<any> = ({ readOnly = false, currentResponse, handleClose }) => {
  const { id } = useParams()
  const userId = localStorage.getItem('userID')
  const { data: template } = useGetTemplateByIdQuery(id!)
  const { data: user } = useGetUserByIdQuery(userId!)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()
  const [createResults, { isLoading }] = useCreateResultsMutation()
  const [incrementFills] = useIncrementFillsMutation()
  const [updateResults] = useUpdateResultsMutation()
  const navigate = useNavigate()

  const submitHandler = async (data: any) => {
    const response = {
      authorId: template?.authorId,
      templateId: template?.id,
      userId,
      userData: { name: user!.username, email: user!.email },
      templateTitle: template?.title,
      answers: data
    }

    const { id, userData, ...newAnswers } = response.answers
    const newData = {
      answers: { ...newAnswers }
    }

    try {
      if (currentResponse) {
        await updateResults({ id: currentResponse.id, body: newData }).unwrap()
        handleClose()
      } else {
        await createResults(response as any).unwrap()
        await incrementFills({ id: template?.id, filledBy: [...template!.filledBy, userId] }).unwrap()
        navigate('/')
      }
    } catch (error) {
      console.error('Failed to submit response:', error)
    }
  }

  useEffect(() => {
    if (currentResponse) {
      reset(currentResponse)
    }
  }, [currentResponse, reset])

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

            {question.type === 'text' && (
              <Controller
                name={question.id}
                control={control}
                defaultValue=""
                rules={{ required: 'This field is required' }}
                render={({ field }) => <TextField fullWidth variant="outlined" {...field} error={!!errors[question.id]} disabled={readOnly} />}
              />
            )}

            {question.type === 'number' && (
              <Controller
                name={question.id}
                control={control}
                defaultValue=""
                rules={{ required: 'This field is required' }}
                render={({ field }) => <TextField fullWidth type="number" variant="outlined" {...field} error={!!errors[question.id]} disabled={readOnly} />}
              />
            )}

            {question.type === 'tags' && (
              <Controller
                name={question.id}
                control={control}
                defaultValue={[]}
                rules={{ required: 'This field is required' }}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={value}
                    onChange={(_, newValue) => onChange(newValue)}
                    disabled={readOnly}
                    renderInput={(params) => <TextField {...params} label="Tags" variant="outlined" placeholder="Start typing..." />}
                  />
                )}
              />
            )}

            {question.type === 'select' && (
              <Controller
                name={question.id}
                control={control}
                defaultValue=""
                rules={{ required: 'This field is required' }}
                render={({ field }) => (
                  <Select fullWidth {...field} error={!!errors[question.id]} disabled={readOnly}>
                    {question.options &&
                      question.options.map((option: string, idx: number) => (
                        <MenuItem key={`${question.id}-${idx}`} value={option.trim()}>
                          {option.trim()}
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
            )}

            {question.type === 'radio' && (
              <Controller
                name={question.id}
                control={control}
                defaultValue=""
                rules={{ required: 'This field is required' }}
                render={({ field }) => (
                  <RadioGroup row>
                    {question.options &&
                      question.options.map((option: string, idx: number) => (
                        <FormControlLabel
                          key={`${question.id}-${idx}`}
                          label={option.trim()}
                          disabled={readOnly}
                          control={<Radio value={option.trim()} checked={field.value === option.trim()} onChange={field.onChange} />}
                        />
                      ))}
                  </RadioGroup>
                )}
              />
            )}

            {question.type === 'checkbox' && (
              <Controller
                name={question.id}
                control={control}
                defaultValue={[]}
                rules={{ required: 'This field is required' }}
                render={({ field }) => (
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
                              checked={field.value.includes(option.trim())}
                              onChange={(e) => {
                                const newValue = e.target.checked ? [...field.value, option.trim()] : field.value.filter((val: string) => val !== option.trim())
                                field.onChange(newValue)
                              }}
                            />
                          }
                        />
                      ))}
                  </Box>
                )}
              />
            )}
          </Box>
        ))}

        {readOnly ? (
          <Button onClick={() => navigate('/')} variant="contained" color="error" disableElevation>
            Back
          </Button>
        ) : (
          <Box className="flex justify-between">
            <Button type="submit" variant="contained" color="primary" disabled={isLoading} disableElevation endIcon={<Send />}>
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
