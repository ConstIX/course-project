import { Add } from '@mui/icons-material'
import { Autocomplete, Box, Button, Pagination, TextField } from '@mui/material'
import { FC, useState } from 'react'
import TemplateCard from '../components/template/TemplateCard'
import { useGetTemplatesQuery } from '../redux/services/templates'

const Home: FC = () => {
  const { data: templates } = useGetTemplatesQuery()
  const token = localStorage.getItem('token')

  const [searchValue, setSearchValue] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const templatesPerPage = 5

  const handleSearchInputChange = (event: string) => {
    setSearchValue(event)
    setCurrentPage(1)
  }

  const filteredTemplates = searchValue
    ? templates?.filter((template) => template.title.toLowerCase().includes(searchValue.toLowerCase()))
    : templates

  const currentTemplates = filteredTemplates?.slice(
    (currentPage - 1) * templatesPerPage,
    currentPage * templatesPerPage
  )

  const totalPages = Math.ceil((filteredTemplates?.length || 0) / templatesPerPage)

  return (
    <Box className="mx-auto w-full max-w-7xl px-3 py-32 md3:mt-24">
      <Box className="mb-10 flex items-center justify-between">
        <Autocomplete
          freeSolo
          id="template-search"
          disableClearable
          options={templates?.map((obj) => obj.title) || []}
          sx={{ width: 350 }}
          onInputChange={(_, newInputValue) => handleSearchInputChange(newInputValue)}
          renderInput={(params) => <TextField {...params} type="search" label="Search templates" />}
        />

        {token && (
          <Button href="/create-template" variant="contained" color="primary" disableElevation startIcon={<Add />}>
            New template
          </Button>
        )}
      </Box>

      <Box className="space-y-5">
        {currentTemplates && currentTemplates.map((obj) => <TemplateCard key={obj.id} {...obj} />)}
      </Box>

      {/* Компонент Pagination */}
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

export default Home
