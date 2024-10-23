import { Box, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { useParams } from 'react-router-dom'
import ResultsEditModal from '../components/view-results/ResultsEditModal'
import ResultsTable from '../components/view-results/ResultsTable'
import { useGetTemplateByIdQuery } from '../redux/services/templates'

interface ICurrentResponse {
  id: number
  userData: { name: string; email: string }
  [key: string]: string | number | { name: string; email: string }
}

const ViewResults: FC = () => {
  const { id } = useParams()
  const { data: template } = useGetTemplateByIdQuery(id!)

  const [open, setOpen] = useState(false)
  const [currentResponse, setCurrentResponse] = useState<ICurrentResponse | null>(null)

  const handleOpen = (response: ICurrentResponse) => {
    setCurrentResponse(response)
    setOpen(true)
  }

  const handleClose = () => {
    setCurrentResponse(null)
    setOpen(false)
  }

  return (
    <Box className="custom-container">
      <Typography variant="h4" color="primary">
        Analysis of responses for <br /> "{template?.title}"
      </Typography>

      <ResultsTable id={id} handleOpen={handleOpen} />

      <ResultsEditModal open={open} handleClose={handleClose} currentResponse={currentResponse} />
    </Box>
  )
}

export default ViewResults
