import { AddCircle, Delete } from '@mui/icons-material'
import { Box, Button, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material'
import { FC, useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetTemplateByIdQuery, useUpdateTemplateMutation } from '../redux/services/templates'
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

const EditTemplate: FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Получение существующего шаблона по ID
  const { data: template, isLoading } = useGetTemplateByIdQuery(id!)
  const [updateTemplate, { isLoading: isUpdating }] = useUpdateTemplateMutation()

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors }
  } = useForm<FormValues>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions'
  })

  // Заполнение формы данными шаблона после их получения
  useEffect(() => {
    if (template) {
      reset({
        title: template.title,
        description: template.description || '',
        questions: template.questions.map((q) => ({
          type: q.type,
          label: q.label,
          description: q.description || '',
          options: q.options
        }))
      })
    }
  }, [template, reset])

  const addQuestion = () => {
    append({ type: 'text', label: '', description: '', options: '' })
  }

  const onSubmit = async (data: FormValues) => {
    const processedQuestions = data.questions.map((obj, index) => ({
      id: template?.questions[index]?.id,
      type: obj.type,
      label: obj.label,
      description: obj.description,
      options: obj.options.split(',').map((opt) => opt.trim())
    }))

    const updatedTemplate: Partial<Template> = {
      title: data.title,
      description: data.description,
      questions: processedQuestions
    }

    try {
      await updateTemplate({ id: id!, ...updatedTemplate }).unwrap()
      navigate('/')
    } catch (err) {
      console.error('Failed to update template:', err)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Box className="space-y-10 py-5">
      <Typography variant="h4" color="primary">
        Editing the form template
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        {fields.map((field, idx) => {
          const questionType = watch(`questions.${idx}.type`)

          return (
            <Box key={field.id} className="mb-4 space-y-4 rounded border p-4">
              <Box className="flex items-center justify-between">
                <Typography variant="h6">Question {idx + 1}</Typography>
                <IconButton color="error" onClick={() => remove(idx)}>
                  <Delete />
                </IconButton>
              </Box>

              <Select defaultValue={field.type} fullWidth {...register(`questions.${idx}.type` as const)}>
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
                  {...register(`questions.${idx}.options`, { required: 'Options are required!' })}
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
            disabled={isUpdating}
            disableElevation
            sx={{ margin: '0 0 0 auto' }}>
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button onClick={() => navigate('/')} variant="contained" color="error" disableElevation>
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default EditTemplate
