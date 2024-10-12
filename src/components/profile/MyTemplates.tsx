import { Box, Button } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeleteTemplateMutation, useGetTemplatesByUserIdQuery } from '../../redux/services/templates'

const MyTemplates: FC = () => {
  const userId = localStorage.getItem('userID')
  const [deleteTemplate] = useDeleteTemplateMutation()
  const { data: templates } = useGetTemplatesByUserIdQuery(userId!)
  const navigate = useNavigate()

  const handleDeleteTemplate = async (templateId: string) => {
    await deleteTemplate(templateId)
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Template ID', width: 200 },
    { field: 'title', headerName: 'Title', width: 300 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 350,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/edit-template/${params.row.id}`)
            }}>
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteTemplate(params.row.id)
            }}>
            Delete
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/view-results/${params.row.id}`)
            }}>
            View Results
          </Button>
        </>
      )
    }
  ]

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/create-template')}
        style={{ marginBottom: '10px' }}>
        Create New Template
      </Button>

      <DataGrid
        rows={templates || []}
        columns={columns}
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
        disableColumnMenu
        onRowClick={(params) => navigate(`/view-form/${params.id}`)}
      />
    </Box>
  )
}

export default MyTemplates
