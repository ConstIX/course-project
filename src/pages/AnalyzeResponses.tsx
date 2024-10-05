// src/pages/AnalyzeResponses.tsx

import { Box, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetResponsesByTemplateIdQuery, useGetTemplateByIdQuery } from '../redux/services/api'

const AnalyzeResponses: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  const { data: template, error: templateError, isLoading: isTemplateLoading } = useGetTemplateByIdQuery(id!)
  const {
    data: responses,
    error: responsesError,
    isLoading: isResponsesLoading
  } = useGetResponsesByTemplateIdQuery(id!)

  if (isTemplateLoading || isResponsesLoading) {
    return (
      <Box className="flex justify-center p-4">
        <CircularProgress />
      </Box>
    )
  }

  if (templateError || !template) {
    return (
      <Box className="p-4">
        <Typography variant="h5">Шаблон не найден или произошла ошибка</Typography>
      </Box>
    )
  }

  if (responsesError) {
    return (
      <Box className="p-4">
        <Typography variant="h5">Произошла ошибка при загрузке ответов</Typography>
      </Box>
    )
  }

  if (responses && responses.length === 0) {
    return (
      <Box className="p-4">
        <Typography variant="h5">Нет ответов для анализа</Typography>
      </Box>
    )
  }

  return (
    <Box className="p-4">
      <Typography variant="h4" gutterBottom>
        Анализ ответов для "{template.title}"
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ответ ID</TableCell>
            {template.questions.map((q) => (
              <TableCell key={q.id}>{q.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {responses &&
            responses.map((response) => (
              <TableRow key={response.id}>
                <TableCell>{response.id}</TableCell>
                {template.questions.map((q) => (
                  <TableCell key={q.id}>{JSON.stringify(response.answers[q.id])}</TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Box>
  )
}

export default AnalyzeResponses
