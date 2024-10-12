import { Add } from '@mui/icons-material'
import { Autocomplete, Box, Button, debounce, Pagination, TextField } from '@mui/material'
import { FC, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import TemplateCard from '../components/template/TemplateCard'
import { useGetTemplatesQuery } from '../redux/services/templates'

const Home: FC = () => {
  const { data: templates } = useGetTemplatesQuery()
  const token = localStorage.getItem('token')

  const { control } = useForm()
  const [searchValue, setSearchValue] = useState<string>('') // Состояние для поиска
  const [currentPage, setCurrentPage] = useState<number>(1)
  const templatesPerPage = 5

  const handleSearch = debounce((event: string) => {
    setSearchValue(event)
    setCurrentPage(1) // Обновляем страницу при изменении поиска
  }, 300)

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
        <Controller
          name="search"
          defaultValue=""
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <Autocomplete
              {...field}
              freeSolo
              id="template-search"
              disableClearable
              options={templates?.map((obj) => obj.title) || []}
              value={value || ''}
              onInputChange={(_, newInputValue) => {
                onChange(newInputValue)
                handleSearch(newInputValue)
              }}
              sx={{ width: 350 }}
              renderInput={(params) => <TextField {...params} type="search" label="Search templates" />}
            />
          )}
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
