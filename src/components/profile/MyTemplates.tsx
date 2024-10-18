import { Add, Delete, Edit, EditNote, Visibility } from '@mui/icons-material'
import { Alert, Box, Button, Snackbar, Typography } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { resultsApi, useDeleteResponseMutation } from '../../redux/services/results'
import { useDeleteTemplateMutation, useGetTemplatesByUserIdQuery } from '../../redux/services/templates'

const MyTemplates: FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const [snackbarState, setSnackbarState] = useState<{ message: string; open: boolean; severity: 'success' | 'error' }>({
    message: '',
    open: false,
    severity: 'success' as 'success' | 'error'
  })
  const navigate = useNavigate()
  const userId = localStorage.getItem('userID')

  const { data: templates } = useGetTemplatesByUserIdQuery(userId!)
  const [getResponsesByTemplateId] = resultsApi.useLazyGetResponsesByTemplateIdQuery()
  const [deleteTemplate] = useDeleteTemplateMutation()
  const [deleteResponse] = useDeleteResponseMutation()

  const handleDeleteTemplate = async (templateId: number) => {
    try {
      deleteTemplate(templateId)
      setSnackbarState({ message: 'Template deleted successfuly.', open: true, severity: 'success' })

      const templateResponses = await getResponsesByTemplateId(templateId!).unwrap()
      for (const response of templateResponses) {
        await deleteResponse(response.id).unwrap()
      }
    } catch (error) {
      setSnackbarState({ message: 'Something went wrong.', open: true, severity: 'error' })
      console.error('Error deleting template and responses:', error)
    }
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'title', headerName: 'Template title', width: 300 },
    {
      field: 'filledBy',
      headerName: 'Number of fillings',
      width: 200,
      renderCell: (params: GridRenderCellParams) => <Typography sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>{params.row.filledBy.length || 0}</Typography>
    },
    {
      field: 'actions',
      type: 'actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem icon={<Edit color="primary" />} label="Edit" onClick={() => navigate(`/edit-template/${params.row.id}`)} />,
        <GridActionsCellItem icon={<Delete color="error" />} label="Delete" onClick={() => handleDeleteTemplate(params.row.id)} />,
        <GridActionsCellItem icon={<EditNote />} label="Fill Form" onClick={() => navigate(`/fill-form/${params.row.id}`)} showInMenu />,
        <GridActionsCellItem icon={<Visibility />} label="View Results" onClick={() => navigate(`/view-results/${params.row.id}`)} showInMenu />
      ]
    }
  ]

  return (
    <Box>
      <Button onClick={() => navigate('/create-template')} variant="contained" color="primary" disableElevation startIcon={<Add />} sx={{ marginBottom: 2, width: `${isMobile ? '100%' : 'auto'}` }}>
        New template
      </Button>

      <Box className="h-96">
        <DataGrid
          rows={templates || []}
          columns={columns}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
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

export default MyTemplates
