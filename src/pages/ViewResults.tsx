import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import {
  useDeleteResponseMutation,
  useGetResponsesByTemplateIdQuery,
  useUpdateResponseMutation
} from '../redux/services/results'
import { useGetTemplateByIdQuery } from '../redux/services/templates'
import { useGetUserByIdQuery } from '../redux/services/users'

const ViewResults: FC = () => {
  const { id } = useParams<{ id: string }>()

  const { data: template } = useGetTemplateByIdQuery(id!)
  const { data: responses } = useGetResponsesByTemplateIdQuery(id!)
  const [deleteResponse] = useDeleteResponseMutation()
  const [updateResponse] = useUpdateResponseMutation()
  const { data: user } = useGetUserByIdQuery(localStorage.getItem('userID') as string)

  const [open, setOpen] = useState(false)
  const [currentResponse, setCurrentResponse] = useState<any>(null)

  const { register, handleSubmit, reset } = useForm()

  const author = localStorage.getItem('userID') === String(template?.authorId)
  const admin = user && user.status === 'admin'

  const filteredResponses =
    !author && !admin
      ? responses?.filter((response) => String(response.userId) === localStorage.getItem('userID'))
      : responses

  const handleDelete = async (responseId: string) => {
    try {
      await deleteResponse(responseId).unwrap()
    } catch (error) {
      console.error('Failed to delete response:', error)
    }
  }

  const handleOpen = (response: any) => {
    setCurrentResponse(response)
    reset(response.answers)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setCurrentResponse(null)
  }

  const onSubmit = async (data: any) => {
    const updatedResponse = {
      ...currentResponse,
      answers: data
    }
    try {
      await updateResponse({ id: currentResponse.id, body: updatedResponse }).unwrap()
      handleClose()
    } catch (error) {
      console.error('Failed to update response:', error)
    }
  }

  return (
    <Box className="mx-auto mt-32 w-full max-w-7xl px-3 md3:mt-24">
      <Typography variant="h4" color="primary">
        Analysis of responses for <br /> "{template?.title}"
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Response ID</TableCell>
            {template?.questions.map((q) => <TableCell key={q.id}>{q.label}</TableCell>)}
            {(author || admin) && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredResponses &&
            filteredResponses.map((response) => (
              <TableRow key={response.id}>
                <TableCell>{response.id}</TableCell>
                {template?.questions.map((q) => (
                  <TableCell key={q.id}>{JSON.stringify(response.answers[q.id])}</TableCell>
                ))}
                {(author || admin) && (
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleOpen(response)} className="mr-2">
                      Edit
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => handleDelete(response.id)}>
                      Delete
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Response</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
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
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default ViewResults
