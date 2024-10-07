import { AddCircle, Delete } from '@mui/icons-material'
import { Box, Button, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material'
import { FC } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { useCreateTemplateMutation } from '../redux/services/templates'
import { useGetUserByIdQuery } from '../redux/services/users'
import { Question, Template } from '../types'

interface FormValues {
  title: string
  description?: string
  questions: {
    type: Question['type']
    label: string
    description?: string
    options: string
  }[]
}

const CreateTemplate: FC = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      questions: []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions'
  })

  const userId = localStorage.getItem('userID')
  const { data: user } = useGetUserByIdQuery(userId as string)
  const [createTemplate, { isLoading }] = useCreateTemplateMutation()
  const navigate = useNavigate()

  const addQuestion = () => {
    append({ type: 'text', label: '', description: '', options: '' })
  }

  const submitHandler = async (data: FormValues) => {
    const template: Partial<Template> = {
      authorId: user.id,
      title: data.title,
      description: data.description,
      questions: data.questions.map((obj) => ({
        id: uuidv4(),
        type: obj.type,
        label: obj.label,
        description: obj.description,
        options: obj.options.split(',').map((opt) => opt.trim())
      }))
    }

    try {
      await createTemplate(template).unwrap()
      navigate('/')
    } catch (error) {
      console.error('Failed to create template:', error)
    }
  }

  return (
    <Box className="mx-auto mt-32 w-full max-w-7xl px-3 md3:mt-24">
      <Typography variant="h4" color="primary">
        Creating a form template
      </Typography>

      <Box component="form" onSubmit={handleSubmit(submitHandler)} className="mt-10 space-y-4">
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          error={!!errors.title}
          helperText={errors.title?.message}
          {...register('title', { required: 'Title is required!' })}
        />

        <TextField label="Description" variant="outlined" fullWidth multiline rows={3} {...register('description')} />

        <Typography variant="h5" color="primary">
          Questions
        </Typography>

        {fields.map((i, idx) => {
          const questionType = watch(`questions.${idx}.type`)

          return (
            <Box key={i.id} className="mb-4 space-y-4 rounded border p-4">
              <Box className="flex items-center justify-between">
                <Typography variant="h6">Question {idx + 1}</Typography>
                <IconButton color="error" onClick={() => remove(idx)}>
                  <Delete />
                </IconButton>
              </Box>

              <Select defaultValue={i.type} fullWidth {...register(`questions.${idx}.type`)}>
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="select">Select</MenuItem>
                <MenuItem value="checkbox">Checkbox</MenuItem>
              </Select>

              <TextField
                label="Question title"
                variant="outlined"
                fullWidth
                error={!!errors?.questions?.[idx]?.label}
                helperText={errors?.questions?.[idx]?.label?.message}
                {...register(`questions.${idx}.label`, { required: 'Title is required!' })}
              />

              <TextField
                label="Question description"
                variant="outlined"
                fullWidth
                {...register(`questions.${idx}.description`)}
              />

              {(questionType === 'select' || questionType === 'checkbox') && (
                <TextField
                  label="Options (comma-separated)"
                  variant="outlined"
                  fullWidth
                  placeholder="Option1, Option2, Option3"
                  error={!!errors?.questions?.[idx]?.options}
                  helperText={errors?.questions?.[idx]?.options?.message}
                  {...register(`questions.${idx}.options`, { required: 'Options is required!' })}
                />
              )}
            </Box>
          )
        })}

        <Box className="flex gap-3">
          <Button variant="outlined" color="primary" onClick={addQuestion} disableElevation startIcon={<AddCircle />}>
            Add Question
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            disableElevation
            sx={{ margin: '0 0 0 auto' }}>
            {isLoading ? 'Save...' : 'Save'}
          </Button>
          <Button onClick={() => navigate('/')} variant="contained" color="error" disableElevation>
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default CreateTemplate
