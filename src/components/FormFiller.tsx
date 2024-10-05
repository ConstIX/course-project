// src/components/FormFiller.tsx

import { Box, Button, MenuItem, Select, TextField, Typography } from '@mui/material'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useCreateResponseMutation } from '../redux/services/api'
import { Template } from '../types'

interface FormFillerProps {
  template: Template
}

const FormFiller: React.FC<FormFillerProps> = ({ template }) => {
  const { control, handleSubmit } = useForm()
  const [createResponse, { isLoading }] = useCreateResponseMutation()
  const navigate = useNavigate()

  const submitHandler = async (data: any) => {
    const response = {
      templateId: template.id,
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
    <Box className="p-4">
      <Typography variant="h4" gutterBottom>
        {template.title}
      </Typography>
      {template.description && (
        <Typography variant="subtitle1" gutterBottom>
          {template.description}
        </Typography>
      )}
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        {template.questions.map((question) => (
          <Box key={question.id} className="mb-4">
            <Typography variant="h6">{question.label}</Typography>
            {question.description && (
              <Typography variant="body2" color="textSecondary">
                {question.description}
              </Typography>
            )}
            <Controller
              name={question.id}
              control={control}
              rules={{ required: true }}
              render={({ field }) => {
                switch (question.type) {
                  case 'text':
                    return <TextField {...field} variant="outlined" fullWidth />
                  case 'number':
                    return <TextField {...field} type="number" variant="outlined" fullWidth />
                  case 'select':
                    return (
                      <Select {...field} variant="outlined" fullWidth>
                        {question.options?.map((option, idx) => (
                          <MenuItem key={idx} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    )
                  default:
                    return null
                }
              }}
            />
          </Box>
        ))}
        <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
          {isLoading ? 'Отправка...' : 'Отправить'}
        </Button>
      </form>
    </Box>
  )
}

export default FormFiller
