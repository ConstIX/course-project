import { AddCircle, Delete } from '@mui/icons-material'
import { Box, Button, Checkbox, FormControlLabel, IconButton, Typography, useMediaQuery } from '@mui/material'
import { FC } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import RHFSelect from '../ui/RHFSelect'
import RHFTextField from '../ui/RHFTextField'

const QuestionSettings: FC = () => {
  const { control, watch, setValue } = useFormContext()
  const { fields, append, remove } = useFieldArray({ control, name: 'questions' })
  const isMobile = useMediaQuery('(max-width: 600px)')

  const addQuestion = () => append({ type: 'text', label: '', description: '', options: '' })

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

            <RHFSelect name={`questions.${idx}.type`} label="Question type" control={control} options={['text', 'number', 'select', 'checkbox', 'radio', 'tags']} defaultValue="text" />

            <RHFTextField name={`questions.${idx}.label`} label="Question title" control={control} rules={{ required: 'Title is required!' }} />
            <RHFTextField name={`questions.${idx}.description`} label="Question description" control={control} />

            {(questionType === 'select' || questionType === 'checkbox' || questionType === 'radio') && (
              <RHFTextField name={`questions.${idx}.options`} label="Options" control={control} rules={{ required: 'Options are required!' }} />
            )}
            <FormControlLabel
              control={<Checkbox checked={watch(`questions.${idx}.required`) || false} onChange={(e) => setValue(`questions.${idx}.required`, e.target.checked)} />}
              label="Question required"
            />
          </Box>
        )
      })}

      <Button variant="outlined" color="primary" onClick={addQuestion} disableElevation fullWidth={isMobile} startIcon={<AddCircle />}>
        Add Question
      </Button>
    </Box>
  )
}

export default QuestionSettings
