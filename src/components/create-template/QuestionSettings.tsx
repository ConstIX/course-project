import { AddCircle, Delete } from '@mui/icons-material'
import { Box, Button, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material'
import { FC } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'

const QuestionSettings: FC = () => {
  const {
    control,
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

            <Controller
              name={`questions.${idx}.type`}
              control={control}
              defaultValue={item.type}
              render={({ field }) => (
                <Select {...field} fullWidth>
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="number">Number</MenuItem>
                  <MenuItem value="select">Select</MenuItem>
                  <MenuItem value="checkbox">Checkbox</MenuItem>
                  <MenuItem value="radio">Radio</MenuItem>
                  <MenuItem value="tags">Tags</MenuItem>
                </Select>
              )}
            />

            <Controller
              name={`questions.${idx}.label`}
              control={control}
              defaultValue=""
              rules={{ required: 'Title is required!' }}
              render={({ field }) => (
                <TextField
                  label="Question title"
                  variant="outlined"
                  fullWidth
                  error={!!errors?.questions?.[idx]?.label}
                  helperText={errors?.questions?.[idx]?.label?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name={`questions.${idx}.description`}
              control={control}
              defaultValue=""
              render={({ field }) => <TextField label="Question description" variant="outlined" fullWidth {...field} />}
            />

            {(questionType === 'select' || questionType === 'checkbox' || questionType === 'radio') && (
              <Controller
                name={`questions.${idx}.options`}
                control={control}
                defaultValue=""
                rules={{ required: 'Options are required!' }}
                render={({ field }) => (
                  <TextField
                    label="Options (comma-separated)"
                    variant="outlined"
                    fullWidth
                    placeholder="Option1, Option2, Option3"
                    error={!!errors?.questions?.[idx]?.options}
                    helperText={errors?.questions?.[idx]?.options?.message}
                    {...field}
                  />
                )}
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
