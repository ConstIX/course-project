import { Button } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetResponsesByUserIdQuery } from '../../redux/services/results'

const MyResults: FC = () => {
  const { data: responses } = useGetResponsesByUserIdQuery(localStorage.getItem('userID')!)
  const navigate = useNavigate()

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Response ID', width: 200 },
    {
      field: 'templateTitle',
      headerName: 'Template Title',
      width: 300
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="contained"
          color="secondary"
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
    <DataGrid
      rows={responses || []}
      columns={columns}
      initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
      pageSizeOptions={[10]}
      disableRowSelectionOnClick
      disableColumnMenu
      onRowClick={(params) => navigate(`/view-form/${params.id}`)}
    />
  )
}

export default MyResults
