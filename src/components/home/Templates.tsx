import { Add } from '@mui/icons-material'
import { Autocomplete, Box, Button, debounce, Pagination, TextField, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetTemplatesQuery } from '../../redux/services/templates'
import TemplateCard from './TemplateCard'

const Templates: FC = () => {
  const { data: templates } = useGetTemplatesQuery()
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const [searchValue, setSearchValue] = useState<string>('')
  const [selectedTag, setSelectedTag] = useState<string>('All')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const templatesPerPage = 5

  const tags = ['All', 'Technology', 'Science', 'Education', 'Health', 'Art', 'Business', 'Sports']

  const handleSearch = debounce((event: string) => {
    setSearchValue(event)
    setCurrentPage(1)
  }, 300)

  const handleTagChange = debounce((event: any) => {
    setSelectedTag(event)
    setCurrentPage(1)
  }, 300)

  const filteredTemplates = templates?.filter((template) => {
    const matchesSearch = template.title.toLowerCase().includes(searchValue.toLowerCase())
    const matchesTag = selectedTag === 'All' || selectedTag === '' || template.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const currentTemplates = filteredTemplates?.slice(
    (currentPage - 1) * templatesPerPage,
    currentPage * templatesPerPage
  )

  const totalPages = Math.ceil((filteredTemplates?.length || 0) / templatesPerPage)

  return (
    <Box>
      <Typography color="primary" variant="h4">
        Templates
      </Typography>

      <Box className="mb-10 flex items-center justify-between">
        <Autocomplete
          freeSolo
          disableClearable
          options={templates?.map((obj) => obj.title) || []}
          value={searchValue}
          onInputChange={(_, newInputValue) => handleSearch(newInputValue)}
          sx={{ width: 350 }}
          renderInput={(params) => <TextField {...params} type="search" label="Search templates" />}
        />

        <Autocomplete
          options={tags}
          value={selectedTag}
          onInputChange={(_, newInputValue) => handleTagChange(newInputValue)}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Tag" />}
        />

        {token && (
          <Button
            onClick={() => navigate('/create-template')}
            variant="contained"
            color="primary"
            disableElevation
            startIcon={<Add />}>
            New template
          </Button>
        )}
      </Box>

      <Box className="space-y-5">
        {currentTemplates && currentTemplates.map((obj) => <TemplateCard key={obj.id} {...obj} />)}
      </Box>

      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, value) => setCurrentPage(value)}
          color="primary"
          shape="rounded"
        />
      </Box>
    </Box>
  )
}

export default Templates
