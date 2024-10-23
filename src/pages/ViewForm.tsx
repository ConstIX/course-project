import { Box, CircularProgress } from '@mui/material'
import { FC } from 'react'
import { useParams } from 'react-router-dom'
import NotFound from '../components/NotFound'
import { useGetTemplateByIdQuery } from '../redux/services/templates'
import FillForm from './FillForm'

const ViewTemplate: FC = () => {
  const { id } = useParams()
  const { data: template, isLoading, error } = useGetTemplateByIdQuery(id!)

  if (isLoading) {
    return (
      <Box className="flex flex-1 items-center justify-center py-32 text-center">
        <CircularProgress />
      </Box>
    )
  }

  if (error || !template) return <NotFound />

  return <FillForm readOnly />
}

export default ViewTemplate
