import { Box, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { useParams } from 'react-router-dom'
import ResultsEditModal from '../components/view-results/ResultsEditModal'
import ResultsTable from '../components/view-results/ResultsTable'
import { useGetTemplateByIdQuery } from '../redux/services/templates'

const ViewResults: FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data: template } = useGetTemplateByIdQuery(id!)

  const [open, setOpen] = useState(false)
  const [currentResponse, setCurrentResponse] = useState<any>(null)

  const handleOpen = (response: any) => {
    setCurrentResponse(response)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setCurrentResponse(null)
  }

  return (
    <Box className="mx-auto mt-32 w-full max-w-7xl px-3 md3:mt-24">
      <Typography variant="h4" color="primary">
        Analysis of responses for <br /> "{template?.title}"
      </Typography>

      <ResultsTable id={id} handleOpen={handleOpen} />

      <ResultsEditModal open={open} handleClose={handleClose} template={template} currentResponse={currentResponse} />
    </Box>
  )
}

export default ViewResults
