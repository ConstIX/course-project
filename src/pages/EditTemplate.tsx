import { Box, CircularProgress } from '@mui/material'
import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { useGetTemplateByIdQuery } from '../redux/services/templates'
import CreateTemplate from './CreateTemplate'

const EditTemplate: FC = () => {
  const { id } = useParams()
  const { data: template, error, isLoading } = useGetTemplateByIdQuery(id as string)

  if (isLoading) {
    return (
      <Box className="mx-auto mt-32 w-full max-w-7xl px-3 md3:mt-24">
        <CircularProgress />
      </Box>
    )
  }

  if (error || !template) {
    return <Box className="mx-auto mt-32 w-full max-w-7xl px-3 md3:mt-24">Error!</Box>
  }

  return <CreateTemplate templateData={template} />
}

export default EditTemplate
