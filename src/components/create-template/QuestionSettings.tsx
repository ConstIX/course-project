import { AddCircle, Delete } from '@mui/icons-material'
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { FC } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'

const QuestionSettings: FC = () => {
  const {
    control,
    watch,
    formState: { errors }
  } = useFormContext()

  const { fields, append, remove } = useFieldArray({ control, name: 'questions' })
  const addQuestion = () => append({ type: 'text', label: '', description: '', options: '' })

  const renderTextField = (name: string, label: string, rules = {}) => (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => <TextField {...field} label={label} variant="outlined" fullWidth error={!!errors[name]} helperText={errors[name]?.message as string} />}
    />
  )

  return (
    <Box className="space-y-3">
      <Typography variant="h5" color="primary">
        Questions
      </Typography>

      {fields.map((item, idx) => {
        const questionType = watch(`questions.${idx}.type`)

        return (
          <Box key={item.id} className="mb-3 space-y-3 rounded border p-4">
            <Box className="flex items-center justify-between">
              <Typography variant="h6">Question {idx + 1}</Typography>
              {fields.length > 1 && (
                <IconButton color="error" onClick={() => remove(idx)}>
                  <Delete />
                </IconButton>
              )}
            </Box>

            <Controller
              name={`questions.${idx}.type`}
              control={control}
              defaultValue="text"
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Question type</InputLabel>
                  <Select {...field} label="Question type">
                    {['text', 'number', 'select', 'checkbox', 'radio', 'tags'].map((item) => (
                      <MenuItem key={item} value={item}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            {renderTextField(`questions.${idx}.label`, 'Question title', { required: 'Title is required!' })}
            {renderTextField(`questions.${idx}.description`, 'Question description')}

            {(questionType === 'select' || questionType === 'checkbox' || questionType === 'radio') &&
              renderTextField(`questions.${idx}.options`, 'Options (comma-separated)', { required: 'Options are required!' })}
          </Box>
        )
      })}

      <Button variant="outlined" color="primary" onClick={addQuestion} disableElevation startIcon={<AddCircle />}>
        Add Question
      </Button>
    </Box>
  )
}

export default QuestionSettings
