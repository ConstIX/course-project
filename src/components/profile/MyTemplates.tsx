import { Add, Delete, Edit, EditNote, Visibility } from '@mui/icons-material'
import { Alert, Box, Button, Snackbar, Typography } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useDeleteTemplate } from '../../hooks/useDeleteTemplate'
import { useGetTemplatesByUserIdQuery } from '../../redux/services/templates'

const MyTemplates: FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const [snackbarState, setSnackbarState] = useState<{ message: string; open: boolean; severity: 'success' | 'error' }>({
    message: '',
    open: false,
    severity: 'success' as 'success' | 'error'
  })

  const navigate = useNavigate()
  const userId = localStorage.getItem('userID')
  const { t } = useTranslation(['table', 'button', 'toaster'])

  const { data: templates, isLoading } = useGetTemplatesByUserIdQuery(userId!)
  const [deleteTemplateWithResults] = useDeleteTemplate()

  const handleDeleteTemplate = async (templateId: number) => {
    try {
      await deleteTemplateWithResults(templateId)
      setSnackbarState({ message: t('toaster.deleteTemplate', { ns: 'toaster' }), open: true, severity: 'success' })
    } catch (error) {
      setSnackbarState({ message: t('toaster.error', { ns: 'toaster' }), open: true, severity: 'error' })
      console.error('Error deleting template and results:', error)
    }
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'title', headerName: t('table.templateTitle'), width: 250 },
    {
      field: 'filledBy',
      headerName: t('table.numberOfFillings'),
      width: 200,
      renderCell: (params: GridRenderCellParams) => <Typography sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>{params.row.filledBy.length || 0}</Typography>
    },
    {
      field: 'actions',
      type: 'actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem icon={<Edit color="primary" />} label="" onClick={() => navigate(`/edit-template/${params.row.id}`)} />,
        <GridActionsCellItem icon={<Delete color="error" />} label="" onClick={() => handleDeleteTemplate(params.row.id)} />,
        <GridActionsCellItem icon={<EditNote />} label={t('button.fillForm', { ns: 'button' })} onClick={() => navigate(`/fill-form/${params.row.id}`)} showInMenu />,
        <GridActionsCellItem icon={<Visibility />} label={t('button.viewResults', { ns: 'button' })} onClick={() => navigate(`/view-results/${params.row.id}`)} showInMenu />
      ]
    }
  ]

  return (
    <Box>
      <Button onClick={() => navigate('/create-template')} variant="contained" color="primary" disableElevation startIcon={<Add />} sx={{ marginBottom: 2, width: `${isMobile ? '100%' : 'auto'}` }}>
        {t('button.newTemplate', { ns: 'button' })}
      </Button>

      <Box className="h-96">
        <DataGrid
          rows={templates || []}
          columns={columns}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
          pageSizeOptions={[10]}
          loading={isLoading}
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
