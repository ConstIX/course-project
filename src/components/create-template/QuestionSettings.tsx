import { AddCircle, Delete } from '@mui/icons-material'
import { Box, Button, Checkbox, FormControlLabel, IconButton, Paper, Typography, useMediaQuery } from '@mui/material'
import { FC } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import RHFSelect from '../ui/RHFSelect'
import RHFTextField from '../ui/RHFTextField'

const QuestionSettings: FC = () => {
  const { control, watch, setValue } = useFormContext()
  const { fields, append, remove, move } = useFieldArray({ control, name: 'questions' })
  const isMobile = useMediaQuery('(max-width: 600px)')
  const { t } = useTranslation(['field', 'title', 'button', 'error'])

  const addQuestion = () => append({ id: uuidv4(), type: 'text', label: '', description: '', options: '', required: false })
  const handleDragEnd = (result: any) => {
    const { destination, source } = result

    if (!destination) return
    if (destination.index !== source.index) move(source.index, destination.index)
  }

  return (
    <Box className="space-y-3">
      <Typography variant="h5" color="primary">
        {t('title.questions', { ns: 'title' })}
      </Typography>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              {fields.map((item, idx) => {
                const questionType = watch(`questions.${idx}.type`)

                return (
                  <Draggable key={item.id} draggableId={item.id} index={idx}>
                    {(provided) => (
                      <Paper ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="mb-3 space-y-3 rounded p-4">
                        <Box className="flex items-center justify-between">
                          <Typography variant="h6">
                            {t('title.question', { ns: 'title' })} {idx + 1}
                          </Typography>
                          {fields.length > 1 && (
                            <IconButton color="error" onClick={() => remove(idx)}>
                              <Delete />
                            </IconButton>
                          )}
                        </Box>

                        <RHFSelect
                          name={`questions.${idx}.type`}
                          label={t('field.questionType')}
                          control={control}
                          options={['text', 'number', 'select', 'checkbox', 'radio', 'tags']}
                          defaultValue="text"
                        />

                        <RHFTextField name={`questions.${idx}.label`} label={t('field.questionTitle')} control={control} rules={{ required: t('error.titleRequired', { ns: 'error' }) }} required />
                        <RHFTextField name={`questions.${idx}.description`} label={t('field.questionDescription')} control={control} />

                        {(questionType === 'select' || questionType === 'checkbox' || questionType === 'radio') && (
                          <RHFTextField
                            name={`questions.${idx}.options`}
                            label={t('field.questionOptions')}
                            control={control}
                            rules={{ required: t('error.optionRequired', { ns: 'error' }) }}
                            required
                          />
                        )}

                        <FormControlLabel
                          control={<Checkbox checked={watch(`questions.${idx}.required`) || false} onChange={(e) => setValue(`questions.${idx}.required`, e.target.checked)} />}
                          label={t('button.requiredQuestion', { ns: 'button' })}
                        />
                      </Paper>
                    )}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      <Button variant="outlined" color="primary" onClick={addQuestion} disableElevation fullWidth={isMobile} startIcon={<AddCircle />}>
        {t('button.addQuestion', { ns: 'button' })}
      </Button>
    </Box>
  )
}

export default QuestionSettings
