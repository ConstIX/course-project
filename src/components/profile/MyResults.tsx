import { Visibility } from '@mui/icons-material'
import { Box, Button } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetResponsesByUserIdQuery } from '../../redux/services/results'

const MyResults: FC = () => {
  const userId = localStorage.getItem('userID')
  const navigate = useNavigate()
  const { data: responses } = useGetResponsesByUserIdQuery(userId!)

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'templateTitle', headerName: 'Template title', width: 300 },
    {
      field: 'actions',
      type: 'actions',
      width: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="contained"
          color="primary"
          startIcon={<Visibility />}
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/view-results/${params.row.templateId}`)
          }}>
          View Results
        </Button>
      )
    }
  ]

  return (
    <Box className="h-96">
      <DataGrid
        rows={responses || []}
        columns={columns}
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
        onRowClick={(params) => navigate(`/view-form/${params.id}`)}
        sx={{ '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' } }}
      />
    </Box>
  )
}

export default MyResults
