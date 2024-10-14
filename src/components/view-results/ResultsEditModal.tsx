import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useUpdateResponseMutation } from '../../redux/services/results'

const ResultsEditModal: FC<any> = ({ open, handleClose, template, currentResponse }) => {
  const { register, handleSubmit, reset } = useForm()
  const [updateResponse] = useUpdateResponseMutation()

  const onSubmit = async (data: any) => {
    const { id, user, ...answers } = data
    const newData = {
      answers: { ...answers }
    }

    try {
      await updateResponse({ id: currentResponse.id, body: newData }).unwrap()
      handleClose()
    } catch (error) {
      console.error('Failed to update response:', error)
    }
  }

  useEffect(() => {
    if (currentResponse) {
      reset(currentResponse)
    }
  }, [currentResponse, reset])

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Response</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {template?.questions.map((q) => (
            <TextField key={q.id} margin="dense" label={q.label} fullWidth {...register(q.id)} />
          ))}
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Save
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ResultsEditModal
