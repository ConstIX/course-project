import { Alert, Box, Snackbar } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserActions from '../components/dashboard/UserActions'
import { useGetUserByIdQuery, useGetUsersQuery } from '../redux/services/users'

const Dashboard: FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [snackbarState, setSnackbarState] = useState<{ message: string; open: boolean; severity: 'success' | 'error' }>({
    message: '',
    open: false,
    severity: 'success' as 'success' | 'error'
  })

  const userId = localStorage.getItem('userID')
  const navigate = useNavigate()

  const { data: users } = useGetUsersQuery()
  const { data: user } = useGetUserByIdQuery(userId!)

  const columns: GridColDef[] = [
    { field: 'username', headerName: 'Name', width: 250 },
    { field: 'email', headerName: 'E-Mail', width: 250, sortable: false },
    { field: 'registrationDate', headerName: 'Registration date', width: 200 },
    { field: 'loginDate', headerName: 'Last login', width: 200 },
    { field: 'status', headerName: 'Status', width: 100, sortable: false },
    { field: 'role', headerName: 'Role', width: 100, sortable: false }
  ]

  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/')
  }, [user, navigate])

  return (
    <Box className="mx-auto mt-32 w-full max-w-7xl px-3 md3:mt-24">
      <UserActions selectedUsers={selectedUsers} users={users || []} setSnackbarState={setSnackbarState} onUserDeleted={() => setSelectedUsers([])} />

      <Box className="h-96">
        <DataGrid
          rows={users}
          columns={columns}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
          pageSizeOptions={[10]}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(newSelection) => setSelectedUsers(newSelection as number[])}
          sx={{ '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' } }}
        />
      </Box>

      <Snackbar open={snackbarState.open} autoHideDuration={3000} onClose={() => setSnackbarState((prev) => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbarState((prev) => ({ ...prev, open: false }))} severity={snackbarState.severity}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Dashboard
