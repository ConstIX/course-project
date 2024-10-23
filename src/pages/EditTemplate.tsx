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
      <Box className="flex flex-1 items-center justify-center py-32 text-center">
        <CircularProgress />
      </Box>
    )
  }

  if (error || !template) return <NotFound />

  return <CreateTemplate templateData={template} />
}

export default EditTemplate
