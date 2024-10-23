import { Dialog, DialogContent } from '@mui/material'
import { FC } from 'react'
import FillForm from '../../pages/FillForm'
import { ICurrentResults } from '../../types/results.types'

interface IResultsEditModal {
  open: boolean
  currentResults: ICurrentResults | null
  handleClose: () => void
  setSnackbarState: (state: { message: string; open: boolean; severity: 'success' | 'error' }) => void
}

const ResultsEditModal: FC<IResultsEditModal> = ({ open, handleClose, currentResults, setSnackbarState }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogContent>
        <FillForm currentResults={currentResults} handleClose={handleClose} setSnackbarState={setSnackbarState} />
      </DialogContent>
    </Dialog>
  )
}

export default ResultsEditModal
