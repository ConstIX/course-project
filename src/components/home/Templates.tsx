import { Add } from '@mui/icons-material'
import { Autocomplete, Box, Button, debounce, Pagination, TextField, Typography, useMediaQuery } from '@mui/material'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetTemplatesQuery } from '../../redux/services/templates'
import TemplateCard from './TemplateCard'

const tags = ['All', 'Technology', 'Science', 'Education', 'Health', 'Art', 'Business', 'Sports']

const Templates: FC = () => {
  const [filters, setFilters] = useState<{ searchValue: string; selectedTag: string; currentPage: number }>({
    searchValue: '',
    selectedTag: 'All',
    currentPage: 1
  })
  const token = localStorage.getItem('token')
  const isTablet = useMediaQuery('(max-width: 767.98px)')
  const navigate = useNavigate()

  const { data: templates } = useGetTemplatesQuery()
  const templatesPerPage = 10

  const filteredTemplates = templates?.filter((template) => {
    const matchesSearch = template.title.toLowerCase().includes(filters.searchValue.toLowerCase()) || String(template.id) === filters.searchValue
    const matchesTag = filters.selectedTag === 'All' || template.tags.includes(filters.selectedTag)
    return matchesSearch && matchesTag
  })

  const currentTemplates = filteredTemplates?.slice((filters.currentPage - 1) * templatesPerPage, filters.currentPage * templatesPerPage)

  const handleInputChange = debounce((value: string, isTag: boolean) => {
    if (isTag) setFilters((prev) => ({ ...prev, selectedTag: value, currentPage: 1 }))
    else setFilters((prev) => ({ ...prev, searchValue: value, currentPage: 1 }))
  }, 300)

  return (
    <Box className="space-y-5">
      <Typography color="primary" variant="h4">
        Templates
      </Typography>

      <Box className="flex items-center justify-between gap-5 md3:flex-col">
        <Box className="flex gap-5 md3:w-full md4:flex-col-reverse md4:gap-3">
          <Autocomplete
            freeSolo
            disableClearable
            options={currentTemplates?.map((obj) => obj.title) || []}
            value={filters.searchValue}
            onInputChange={(_, newValue) => handleInputChange(newValue, false)}
            size={isTablet ? 'small' : 'medium'}
            sx={{ width: isTablet ? '100%' : 300 }}
            renderInput={(params) => <TextField {...params} type="search" label="Search..." />}
          />

          <Autocomplete
            options={tags}
            value={filters.selectedTag}
            onInputChange={(_, newValue) => handleInputChange(newValue, true)}
            size={isTablet ? 'small' : 'medium'}
            sx={{ width: isTablet ? '100%' : 200 }}
            renderInput={(params) => <TextField {...params} label="Tag" />}
          />
        </Box>

        <Button fullWidth={isTablet} onClick={() => navigate('/create-template')} variant="contained" color="primary" disableElevation startIcon={<Add />} disabled={!token}>
          New template
        </Button>
      </Box>

      <Box>{currentTemplates && currentTemplates.map((obj) => <TemplateCard key={obj.id} {...obj} />)}</Box>

      <Box className="mt-8 flex justify-center">
        <Pagination
          count={Math.ceil((filteredTemplates?.length || 0) / templatesPerPage)}
          page={filters.currentPage}
          onChange={(_, value) => setFilters((prev) => ({ ...prev, currentPage: value }))}
          color="primary"
          shape="rounded"
        />
      </Box>
    </Box>
  )
}

export default Templates
