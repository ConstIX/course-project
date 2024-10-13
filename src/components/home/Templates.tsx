import { Add } from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  Button,
  debounce,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { FC, useState } from 'react'
import { useGetTemplatesQuery } from '../../redux/services/templates'
import TemplateCard from './TemplateCard'

const Templates: FC = () => {
  const { data: templates } = useGetTemplatesQuery()
  const token = localStorage.getItem('token')

  const [searchValue, setSearchValue] = useState<string>('')
  const [selectedTag, setSelectedTag] = useState<string>('None')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const templatesPerPage = 5

  const tags = ['None', 'Technology', 'Science', 'Education', 'Health', 'Art', 'Business', 'Sports']

  const handleSearch = debounce((event: string) => {
    setSearchValue(event)
    setCurrentPage(1)
  }, 300)

  const handleTagChange = (event: any) => {
    setSelectedTag(event.target.value)
    setCurrentPage(1)
  }

  const filteredTemplates = templates?.filter((template) => {
    const matchesSearch = template.title.toLowerCase().includes(searchValue.toLowerCase())
    const matchesTag = selectedTag === 'None' || template.tags.includes(selectedTag) // фильтруем по тегу
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
          id="template-search"
          disableClearable
          options={templates?.map((obj) => obj.title) || []}
          value={searchValue}
          onInputChange={(_, newInputValue) => {
            handleSearch(newInputValue)
          }}
          sx={{ width: 350 }}
          renderInput={(params) => <TextField {...params} type="search" label="Search templates" />}
        />

        <FormControl sx={{ width: 150 }}>
          <InputLabel id="tag-select-label">Tag</InputLabel>
          <Select labelId="tag-select-label" value={selectedTag} onChange={handleTagChange} fullWidth label="Tag">
            {tags.map((tag) => (
              <MenuItem key={tag} value={tag}>
                {tag}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {token && (
          <Button href="/create-template" variant="contained" color="primary" disableElevation startIcon={<Add />}>
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
