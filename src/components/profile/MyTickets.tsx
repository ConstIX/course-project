import { Box } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetTicketsByUserIdQuery } from '../../redux/services/jira'

const MyTickets: FC = () => {
  const userJiraId = localStorage.getItem('userJiraId')
  const { t } = useTranslation(['table', 'button'])

  const { data: tickets, isLoading } = useGetTicketsByUserIdQuery(userJiraId || '')

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'summary', headerName: t('table.summary'), width: 200, sortable: false },
    { field: 'status', headerName: t('table.status'), width: 130 },
    { field: 'priority', headerName: t('table.priority'), width: 130 },
    { field: 'duedate', headerName: t('table.date'), width: 130 },
    { field: 'customfield_10041', headerName: t('table.templateTitle'), width: 200, sortable: false },
    { field: 'customfield_10048', headerName: t('table.link'), width: 200, sortable: false }
  ]

  const rows = tickets?.issues.map((issue) => ({
    id: issue.id,
    summary: issue.fields.summary,
    duedate: issue.fields.duedate,
    priority: issue.fields.priority.name,
    status: issue.fields.status.name,
    customfield_10048: issue.fields.customfield_10048,
    customfield_10041: issue.fields.customfield_10041 || '-'
  }))

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

export default MyTickets
