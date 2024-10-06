import { Delete, Lock, LockOpen } from '@mui/icons-material'
import { Alert, Box, Button, IconButton, Snackbar, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation } from '../redux/services/users'

const Dashboard: FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)

  const { data: users } = useGetUsersQuery({})
  const [deleteUser] = useDeleteUserMutation()
  const [updateUser] = useUpdateUserMutation()

  const userId = localStorage.getItem('userID')
  const navigate = useNavigate()

  const handleAction = async (status: 'block' | 'active') => {
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

  const handleDelete = async () => {
    try {
      for (const id of selectedUsers) {
        await deleteUser(id).unwrap()
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
      if (userId && selectedUsers.includes(+userId)) {
        localStorage.removeItem('token')
        localStorage.removeItem('userID')
        navigate('/auth')
      }
      setOpenSnackbar(true)
    } catch (error) {
      console.error('Error deleting users:', error)
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'username',
      headerName: 'Name',
      width: 250,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row.username}</Typography>
          <Typography variant="body2" color="textSecondary">
            {params.row.specialization || '-'}
          </Typography>
        </Box>
      )
    },
    { field: 'email', headerName: 'E-Mail', width: 250, sortable: false },
    { field: 'registrationDate', headerName: 'Registration date', width: 200, sortable: false },
    { field: 'loginDate', headerName: 'Last login', width: 200, sortable: false },
    { field: 'status', headerName: 'Status', width: 100, sortable: false }
  ]

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
      </Box>

      <DataGrid
        rows={users}
        columns={columns}
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
        pageSizeOptions={[10]}
        checkboxSelection
        disableColumnMenu
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
