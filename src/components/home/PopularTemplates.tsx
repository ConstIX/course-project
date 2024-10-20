import { EditNote, Visibility } from '@mui/icons-material'
import { Alert, Box, Snackbar, Typography } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetTemplatesQuery } from '../../redux/services/templates'

const PopularTemplates: FC = () => {
  const [snackbarState, setSnackbarState] = useState<{ message: string; open: boolean; severity: 'success' | 'error' }>({
    message: '',
    open: false,
    severity: 'success' as 'success' | 'error'
  })
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const { data: templates, isLoading } = useGetTemplatesQuery()
  const popularTemplates = templates && [...templates].sort((a, b) => b.filledBy?.length - a.filledBy?.length).slice(0, 5)

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100, sortable: false },
    {
      field: 'author',
      headerName: 'Author',
      width: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Typography>{params.row.author.name}</Typography>
          <Typography color="textSecondary">{params.row.author.email}</Typography>
        </Box>
      )
    },
    { field: 'title', headerName: 'Template title', width: 250, sortable: false },
    {
      field: 'filledBy',
      headerName: 'Number of fillings',
      width: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => <Typography sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>{params.row.filledBy.length || 0}</Typography>
    },
    {
      field: 'actions',
      type: 'actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditNote />}
          label="Fill Form"
          onClick={() => (token ? navigate(`/fill-form/${params.row.id}`) : setSnackbarState({ message: 'You are not authorized!', open: true, severity: 'error' }))}
          showInMenu
        />,
        <GridActionsCellItem icon={<Visibility />} label="View Results" onClick={() => navigate(`/view-results/${params.row.id}`)} showInMenu />
      ]
    }
  ]

  return (
    <Box className="space-y-5 pb-20">
      <Typography color="primary" variant="h4">
        Popular Templates
      </Typography>

      <Box className="h-[370px]">
        <DataGrid
          rows={popularTemplates || []}
          columns={columns}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
          pageSizeOptions={[5]}
          loading={isLoading}
          slotProps={{ loadingOverlay: { variant: 'skeleton', noRowsVariant: 'skeleton' } }}
          disableRowSelectionOnClick
          disableColumnMenu
          onRowClick={(params) => navigate(`/view-form/${params.id}`)}
          sx={{ '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' } }}
        />
      </Box>

      <Snackbar open={snackbarState.open} autoHideDuration={3000} onClose={() => setSnackbarState((prev) => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbarState.severity} onClose={() => setSnackbarState((prev) => ({ ...prev, open: false }))}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default PopularTemplates
