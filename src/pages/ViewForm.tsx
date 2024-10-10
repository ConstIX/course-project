import { Box, CircularProgress } from '@mui/material'
import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { useGetTemplateByIdQuery } from '../redux/services/templates'
import FillForm from './FillForm'

const ViewTemplate: FC = () => {
  const { id } = useParams()
  const { data: template, isLoading, error } = useGetTemplateByIdQuery(id as string)

  if (isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !template) {
    return <Box>Error loading template</Box>
  }

  return <FillForm readOnly />
}

export default ViewTemplate
