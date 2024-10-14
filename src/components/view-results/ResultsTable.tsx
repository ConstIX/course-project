import { Box, Button, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { FC } from 'react'
import { useDeleteResponseMutation, useGetResponsesByTemplateIdQuery } from '../../redux/services/results'
import { useGetTemplateByIdQuery } from '../../redux/services/templates'
import { useGetUserByIdQuery } from '../../redux/services/users'

const ResultsTable: FC<any> = ({ id, handleOpen }) => {
  const userId = localStorage.getItem('userID')
  const { data: template } = useGetTemplateByIdQuery(id!)
  const { data: responses } = useGetResponsesByTemplateIdQuery(id!)
  const { data: user } = useGetUserByIdQuery(userId as string)
  const [deleteResponse] = useDeleteResponseMutation()

  const isAuthor = userId === String(template?.authorId)
  const isAdmin = user && user.status === 'admin'

  const filteredResponses =
    !isAuthor && !isAdmin ? responses?.filter((response) => String(response.userId) === userId) : responses

  const handleDelete = async (responseId: string) => {
    try {
      await deleteResponse(responseId).unwrap()
    } catch (error) {
      console.error('Failed to delete response:', error)
    }
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 150 },
    {
      field: 'userData',
      headerName: 'Author',
      width: 200,
      sortable: false,
      renderCell: (params: any) => (
        <Box>
          <Typography>{params.row.userData.name}</Typography>
          <Typography variant="body2" color="textSecondary">
            {params.row.userData.email}
          </Typography>
        </Box>
      )
    },
    ...(template?.questions.map((q) => ({
      field: q.id,
      headerName: q.label,
      width: `${q.type === 'text' ? 300 : 200}`,
      sortable: false,
      renderCell: (params: any) => (
        <Typography variant="body2">
          {Array.isArray(params.value) ? params.value.join(', ') : params.value || '-'}
        </Typography>
      )
    })) || []),
    (isAuthor || isAdmin) && {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params: any) => (
        <>
          <Button variant="contained" color="primary" onClick={() => handleOpen(params.row)} className="mr-2">
            Edit
          </Button>
          <Button variant="contained" color="secondary" onClick={() => handleDelete(params.row.id)}>
            Delete
          </Button>
        </>
      )
    }
  ].filter(Boolean)

  const rows =
    filteredResponses &&
    [...filteredResponses].map((response) => ({
      id: response.id,
      userData: { name: response.userData.name, email: response.userData.email },
      ...response.answers
    }))

  return (
    <DataGrid
      rows={rows || []}
      columns={columns}
      getRowHeight={() => 'auto'}
      initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
      pageSizeOptions={[10]}
      disableRowSelectionOnClick
    />
  )
}

export default ResultsTable
