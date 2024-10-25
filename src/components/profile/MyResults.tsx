import { Visibility } from '@mui/icons-material'
import { Box, Button } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useGetResultsByUserIdQuery } from '../../redux/services/results'

const MyResults: FC = () => {
  const userId = localStorage.getItem('userID')
  const navigate = useNavigate()
  const { t } = useTranslation(['table', 'button'])

  const { data: results, isLoading } = useGetResultsByUserIdQuery(userId!)

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'templateTitle', headerName: t('table.templateTitle'), width: 250 },
    { field: 'date', headerName: t('table.date'), width: 200 },
    {
      field: 'actions',
      type: 'actions',
      width: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="contained"
          color="primary"
          disableElevation
          startIcon={<Visibility />}
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/view-results/${params.row.templateId}`)
          }}>
          {t('button.viewResults', { ns: 'button' })}
        </Button>
      )
    }
  ]

  return (
    <Box className="h-96">
      <DataGrid
        rows={results || []}
        columns={columns}
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
        pageSizeOptions={[10]}
        loading={isLoading}
        disableRowSelectionOnClick
        onRowClick={(params) => navigate(`/view-form/${params.id}`)}
        sx={{ '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' } }}
      />
    </Box>
  )
}

export default MyResults
