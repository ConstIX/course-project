// src/pages/FillForm.tsx

import { Box, CircularProgress, Typography } from '@mui/material'
import React from 'react'
import { useParams } from 'react-router-dom'
import FormFiller from '../components/FormFiller'
import { useGetTemplateByIdQuery } from '../redux/services/api'

const FillForm: React.FC = () => {
  const { id } = useParams()
  const { data: template, error, isLoading } = useGetTemplateByIdQuery(id!)

  if (isLoading) {
    return (
      <Box className="flex justify-center p-4">
        <CircularProgress />
      </Box>
    )
  }

  if (error || !template) {
    return (
      <Box className="p-4">
        <Typography variant="h5">Шаблон не найден или произошла ошибка</Typography>
      </Box>
    )
  }

  return <FormFiller template={template} />
}

export default FillForm
