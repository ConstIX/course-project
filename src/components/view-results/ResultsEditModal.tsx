import { Dialog, DialogContent } from '@mui/material'
import { FC } from 'react'
import FillForm from '../../pages/FillForm'

interface IResultsEditModal {
  open: boolean
  currentResponse: {
    id: number
    userData: { name: string; email: string }
    [key: string]: string | number | { name: string; email: string }
  } | null
  handleClose: () => void
}

const ResultsEditModal: FC<IResultsEditModal> = ({ open, handleClose, currentResponse }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogContent>
        <FillForm currentResponse={currentResponse} handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  )
}

export default ResultsEditModal
