import { Alert, Box, CircularProgress, debounce, Pagination, Snackbar, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { useGetFilteredTemplatesQuery } from '../../redux/services/templates'
import TemplateCard from './TemplateCard'
import TemplateFilters from './TemplateFilters'

const Templates: FC = () => {
  const [filters, setFilters] = useState<{ searchValue: string; selectedTag: string; currentPage: number }>({
    searchValue: '',
    selectedTag: 'All',
    currentPage: 1
  })
  const [snackbarState, setSnackbarState] = useState<{ message: string; open: boolean; severity: 'success' | 'error' }>({
    message: '',
    open: false,
    severity: 'success' as 'success' | 'error'
  })

  const { data: templates, isLoading } = useGetFilteredTemplatesQuery({
    search: filters.searchValue ? `&title=*${filters.searchValue}*` : '',
    tag: filters.selectedTag === 'All' ? '' : `&tags[]=${filters.selectedTag}`,
    page: `?page=${filters.currentPage}&limit=10`
  })

  const handleInputChange = debounce((value: string, isTag: boolean) => {
    if (isTag) setFilters((prev) => ({ ...prev, selectedTag: value, currentPage: 1 }))
    else setFilters((prev) => ({ ...prev, searchValue: value, currentPage: 1 }))
  }, 300)

  if (isLoading) {
    return (
      <Box className="p-10 text-center">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography color="primary" variant="h4" sx={{ marginBottom: '20px' }}>
        Templates
      </Typography>

      <TemplateFilters templates={templates?.items || []} filters={filters} handleInputChange={handleInputChange} />

      <Box className="space-y-5">
        {templates?.items.length ? (
          <Box className="grid grid-cols-3 gap-4 md2:grid-cols-2 md3:grid-cols-1">{templates?.items.map((obj) => <TemplateCard key={obj.id} {...obj} setSnackbarState={setSnackbarState} />)}</Box>
        ) : (
          <Typography color="textDisabled" variant="h6" sx={{ padding: 5, textAlign: 'center' }}>
            No Templates...
          </Typography>
        )}

        <Pagination
          count={templates?.meta.total_pages}
          page={filters.currentPage}
          onChange={(_, value) => setFilters((prev) => ({ ...prev, currentPage: value }))}
          color="primary"
          shape="rounded"
          sx={{ display: 'flex', justifyContent: 'center' }}
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

export default Templates
