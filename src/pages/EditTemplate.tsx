import { Box, CircularProgress } from '@mui/material'
import { FC } from 'react'
import { useParams } from 'react-router-dom'
import NotFound from '../components/NotFound'
import { useGetTemplateByIdQuery } from '../redux/services/templates'
import CreateTemplate from './CreateTemplate'

const EditTemplate: FC = () => {
  const { id } = useParams()
  const { data: template, error, isLoading } = useGetTemplateByIdQuery(id!)

  if (isLoading) {
    return (
      <Box className="py-32 text-center">
        <CircularProgress />
      </Box>
    )
  }

  if (error || !template) {
    return (
      <Box className="py-32 text-center">
        <NotFound />
      </Box>
    )
  }

  return <CreateTemplate templateData={template} />
}

export default EditTemplate
