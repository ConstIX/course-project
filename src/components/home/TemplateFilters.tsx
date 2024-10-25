import { Autocomplete, Box, TextField, useMediaQuery } from '@mui/material'
import { FC } from 'react'
import { ITemplate } from '../../types/templates.types'

interface ITemplateFilters {
  templates: ITemplate[]
  filters: { searchValue: string; searchBy: string; selectedTag: string; currentPage: number }
  handleInputChange: (value: string, isTag: boolean, isSearchBy: boolean) => void
}

const TemplateFilters: FC<ITemplateFilters> = ({ templates, filters, handleInputChange }) => {
  const isTablet = useMediaQuery('(max-width: 767.98px)')

  const tagOptions = ['All', 'Technology', 'Science', 'Education', 'Health', 'Art', 'Business', 'Sports']
  const searchByOptions = ['Title', 'Description', 'Theme', 'Access', 'Id']
  const searchOptions = [...templates].map((obj) => obj.title)

  const renderAutocomplete = (options: string[], label: string, value: string, isTag: boolean, isSearchBy: boolean, freeSolo?: boolean) => (
    <Autocomplete
      freeSolo={freeSolo}
      options={options}
      value={value}
      onInputChange={(_, newValue) => handleInputChange(newValue, isTag, isSearchBy)}
      size={isTablet ? 'small' : 'medium'}
      sx={{ width: isTablet ? '100%' : freeSolo ? 400 : 200, marginRight: freeSolo ? 'auto' : 0 }}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  )

  return (
    <Box className="mb-10 flex gap-5 md3:w-full md3:flex-col-reverse md3:gap-3">
      {renderAutocomplete(searchOptions, 'Search...', filters.searchValue, false, false, true)}
      {renderAutocomplete(searchByOptions, 'Search by', filters.searchBy, false, true)}
      {renderAutocomplete(tagOptions, 'Tag', filters.selectedTag, true, false)}
    </Box>
  )
}

export default TemplateFilters
