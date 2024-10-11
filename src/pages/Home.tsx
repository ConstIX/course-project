import { Add } from '@mui/icons-material'
import { Autocomplete, Box, Button, debounce, TextField } from '@mui/material'
import { FC, useState } from 'react'
import TemplateCard from '../components/template/TemplateCard'
import { useGetTemplatesQuery } from '../redux/services/templates'

const Home: FC = () => {
  const { data: templates } = useGetTemplatesQuery()
  const token = localStorage.getItem('token')

  const [searchValue, setSearchValue] = useState<string>('')
  const onChangeInput = debounce((event: string) => setSearchValue(event), 300)

  const filteredTemplates = searchValue
    ? templates?.filter((template) => template.title.toLowerCase().includes(searchValue.toLowerCase()))
    : templates

  return (
    <Box className="mx-auto w-full max-w-7xl px-3 py-32 md3:mt-24">
      <Box className="mb-10 flex items-center justify-between">
        <Autocomplete
          freeSolo
          id="template-search"
          disableClearable
          options={templates?.map((obj) => obj.title) || []}
          sx={{ width: 350 }}
          onInputChange={(_, newInputValue) => onChangeInput(newInputValue)}
          renderInput={(params) => <TextField {...params} type="search" label="Search templates" />}
        />

        {token && (
          <Button href="/create-template" variant="contained" color="primary" disableElevation startIcon={<Add />}>
            New template
          </Button>
        )}
      </Box>

      <Box className="space-y-5">
        {filteredTemplates && filteredTemplates.map((obj) => <TemplateCard key={obj.id} {...obj} />)}
      </Box>
    </Box>
  )
}

export default Home
