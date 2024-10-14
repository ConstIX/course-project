import { Dialog, DialogContent } from '@mui/material'
import { FC } from 'react'
import FillForm from '../../pages/FillForm'

const ResultsEditModal: FC<any> = ({ open, handleClose, currentResponse }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogContent>
        <FillForm currentResponse={currentResponse} handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  )
}

export default ResultsEditModal
