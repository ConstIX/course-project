import { Delete, Edit } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { FC } from 'react'
import { useIsAdminOrAuthor } from '../../hooks/useIsAdminOrAuthor'
import { useDeleteResultsMutation, useGetResultsByTemplateIdQuery } from '../../redux/services/results'
import { ICurrentResults } from '../../types/results.types'
import { ITemplate } from '../../types/templates.types'

interface IResultsTable {
  template: ITemplate
  setSnackbarState: (state: { message: string; open: boolean; severity: 'success' | 'error' }) => void
  handleOpen: (obj: ICurrentResults) => void
}

const ResultsTable: FC<IResultsTable> = ({ template, handleOpen, setSnackbarState }) => {
  const { data: results, isLoading } = useGetResultsByTemplateIdQuery(template.id)
  const [deleteResults] = useDeleteResultsMutation()
  const [isAdminOrAuthor, isAdmin] = useIsAdminOrAuthor(template.authorId)

  const userId = localStorage.getItem('userID')
  const filteredResults = !isAdminOrAuthor ? results?.filter((result) => result.userId === userId) : results
  const rows = filteredResults && [...filteredResults].map((result) => ({ id: result.id, userData: result.userData, date: result.date, ...result.answers }))

  const handleDelete = async (responseId: number) => {
    try {
      await deleteResults(responseId).unwrap()
      setSnackbarState({ message: 'Result deleted successfuly.', open: true, severity: 'success' })
    } catch (error) {
      setSnackbarState({ message: 'Something went wrong.', open: true, severity: 'error' })
      console.error('Failed to delete result:', error)
    }
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'userData',
      headerName: 'Author',
      width: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Typography>{params.row.userData.name}</Typography>
          <Typography variant="body2" color="textSecondary">
            {params.row.userData.email}
          </Typography>
        </Box>
      )
    },
    { field: 'date', headerName: 'Date', width: 200 },
    ...template.questions.map((q) => ({
      field: q.id,
      headerName: q.label,
      width: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          {params.value.length === 0 ? '-' : Array.isArray(params.value) ? params.value.join(', ') : params.value}
        </Typography>
      )
    }))
  ]

  if (isAdmin) {
    columns.push({
      field: 'actions',
      type: 'actions',
      width: 120,
      getActions: (params: { row: ICurrentResults }) => [
        <GridActionsCellItem icon={<Edit fontSize="small" color="primary" />} label="Edit" onClick={() => handleOpen(params.row)} showInMenu />,
        <GridActionsCellItem icon={<Delete fontSize="small" color="error" />} label="Delete" onClick={() => handleDelete(params.row.id)} showInMenu />
      ]
    })
  }

  return (
    <Box className="h-96">
      <DataGrid
        rows={rows || []}
        columns={columns}
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
        pageSizeOptions={[10]}
        loading={isLoading}
        disableRowSelectionOnClick
        sx={{ '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' } }}
      />
    </Box>
  )
}

export default ResultsTable
