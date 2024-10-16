import { AdminPanelSettings, Delete, Lock, LockOpen } from '@mui/icons-material'
import { Alert, Box, Button, IconButton, Snackbar } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { resultsApi, useDeleteResponseMutation } from '../redux/services/results'
import { templatesApi, useDeleteTemplateMutation } from '../redux/services/templates'
import {
  useDeleteUserMutation,
  useGetUserByIdQuery,
  useGetUsersQuery,
  useUpdateUserMutation
} from '../redux/services/users'

const Dashboard: FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)

  const userId = localStorage.getItem('userID')
  const { data: users } = useGetUsersQuery({})
  const { data: user } = useGetUserByIdQuery(userId as string)
  const [deleteUser] = useDeleteUserMutation()
  const [updateUser] = useUpdateUserMutation()

  const [getTemplatesByUserId] = templatesApi.useLazyGetTemplatesByUserIdQuery()
  const [getResponsesByTemplateId] = resultsApi.useLazyGetResponsesByTemplateIdQuery()
  const [getResponsesByUserId] = resultsApi.useLazyGetResponsesByUserIdQuery()

  const [deleteTemplate] = useDeleteTemplateMutation()
  const [deleteResponse] = useDeleteResponseMutation()

  const navigate = useNavigate()

  const handleAction = async (status: 'block' | 'active' | 'admin') => {
    try {
      for (const id of selectedUsers) {
        await updateUser({ id, status }).unwrap()
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
      if (userId && status === 'block' && selectedUsers.includes(+userId)) {
        localStorage.removeItem('token')
        localStorage.removeItem('userID')
        navigate('/auth')
      }
      setOpenSnackbar(true)
    } catch (error) {
      console.error(`Error updating users:`, error)
    }
  }

  const handleToggleAdmin = async () => {
    try {
      for (const id of selectedUsers) {
        const user = users.find((user: any) => user.id === id)
        const newStatus = user.status === 'admin' ? 'active' : 'admin'
        await updateUser({ id, status: newStatus }).unwrap()
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
      setOpenSnackbar(true)
    } catch (error) {
      console.error('Error toggling admin status:', error)
    }
  }

  const handleDelete = async () => {
    try {
      for (const id of selectedUsers) {
        await deleteUser(id).unwrap()
        await new Promise((resolve) => setTimeout(resolve, 10))

        const userTemplates = await getTemplatesByUserId(id).unwrap()
        for (const template of userTemplates) {
          const templateResponses = await getResponsesByTemplateId(template.id).unwrap()
          for (const response of templateResponses) {
            await deleteResponse(response.id).unwrap()
            await new Promise((resolve) => setTimeout(resolve, 10))
          }

          await deleteTemplate(template.id).unwrap()
          await new Promise((resolve) => setTimeout(resolve, 10))
        }

        const userResponses = await getResponsesByUserId(id).unwrap()
        for (const response of userResponses) {
          await deleteResponse(response.id).unwrap()
          await new Promise((resolve) => setTimeout(resolve, 10))
        }
      }

      if (userId && selectedUsers.includes(+userId)) {
        localStorage.removeItem('token')
        localStorage.removeItem('userID')
        navigate('/auth')
      }
      setOpenSnackbar(true)
    } catch (error) {
      console.error('Error deleting users, templates, and responses:', error)
    }
  }

  const columns: GridColDef[] = [
    { field: 'username', headerName: 'Name', width: 250 },
    { field: 'email', headerName: 'E-Mail', width: 250, sortable: false },
    { field: 'registrationDate', headerName: 'Registration date', width: 200, sortable: false },
    { field: 'loginDate', headerName: 'Last login', width: 200, sortable: false },
    { field: 'status', headerName: 'Status', width: 100, sortable: false }
  ]

  useEffect(() => {
    if (user && user.status !== 'admin') {
      navigate('/auth')
    }
  }, [user, navigate])

  return (
    <Box className="mx-auto mt-32 w-full max-w-7xl px-3 md3:mt-24">
      <Box className="mb-5 flex gap-3">
        <Button
          onClick={() => handleAction('block')}
          variant="contained"
          disableElevation
          disabled={!selectedUsers.length}
          startIcon={<Lock />}
          sx={{ textTransform: 'none' }}>
          Block
        </Button>
        <IconButton onClick={() => handleAction('active')} color="primary" disabled={!selectedUsers.length}>
          <LockOpen />
        </IconButton>
        <IconButton onClick={handleDelete} color="error" disabled={!selectedUsers.length}>
          <Delete />
        </IconButton>
        <IconButton onClick={handleToggleAdmin} color="secondary" disabled={!selectedUsers.length}>
          <AdminPanelSettings />
        </IconButton>
      </Box>

      <DataGrid
        rows={users}
        columns={columns}
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
        pageSizeOptions={[10]}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={(newSelection) => setSelectedUsers(newSelection as number[])}
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold'
          }
        }}
      />

      <Snackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={3000}>
        <Alert severity="success" variant="filled">
          Action completed successfully!
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Dashboard
