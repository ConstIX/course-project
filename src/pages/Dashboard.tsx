import { Alert, Box, Snackbar } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { FC, useState } from 'react'
import UserActions from '../components/dashboard/UserActions'
import { useGetUsersQuery } from '../redux/services/users'

const Dashboard: FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [snackbarState, setSnackbarState] = useState<{ message: string; open: boolean; severity: 'success' | 'error' }>({
    message: '',
    open: false,
    severity: 'success' as 'success' | 'error'
  })

  const { data: users, isLoading } = useGetUsersQuery()

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'username', headerName: 'Name', width: 250 },
    { field: 'email', headerName: 'E-Mail', width: 250, sortable: false },
    { field: 'registrationDate', headerName: 'Registration date', width: 200 },
    { field: 'loginDate', headerName: 'Last login', width: 200 },
    { field: 'status', headerName: 'Status', width: 100, sortable: false },
    { field: 'role', headerName: 'Role', width: 100, sortable: false }
  ]

  return (
    <Box className="custom-container">
      <UserActions selectedUsers={selectedUsers} users={users || []} setSnackbarState={setSnackbarState} onUserDeleted={() => setSelectedUsers([])} />

      <Box className="h-96">
        <DataGrid
          rows={users || []}
          columns={columns}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
          pageSizeOptions={[10]}
          loading={isLoading}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(newSelection) => setSelectedUsers(newSelection as number[])}
          rowSelectionModel={selectedUsers}
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
