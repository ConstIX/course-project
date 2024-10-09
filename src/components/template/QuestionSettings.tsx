import { AddCircle, Delete } from '@mui/icons-material'
import { Box, Button, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material'
import { FC } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

const QuestionSettings: FC = () => {
  const {
    control,
    register,
    watch,
    formState: { errors }
  } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions'
  })

  const addQuestion = () => {
    append({ type: 'text', label: '', description: '', options: '' })
  }

  return (
    <Box>
      <Typography variant="h5" color="primary">
        Questions
      </Typography>

      {fields.map((item, idx) => {
        const questionType = watch(`questions.${idx}.type`)

        return (
          <Box key={item.id} className="mb-4 space-y-4 rounded border p-4">
            <Box className="flex items-center justify-between">
              <Typography variant="h6">Question {idx + 1}</Typography>
              <IconButton color="error" onClick={() => remove(idx)}>
                <Delete />
              </IconButton>
            </Box>

            <Select defaultValue={item.type} fullWidth {...register(`questions.${idx}.type`)}>
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
      </Box>
    </Box>
  )
}

export default QuestionSettings
