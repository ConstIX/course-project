import { Add } from '@mui/icons-material'
import { Autocomplete, Box, Button, TextField, useMediaQuery } from '@mui/material'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { ITemplate } from '../../types/templates.types'

const tags = ['All', 'Technology', 'Science', 'Education', 'Health', 'Art', 'Business', 'Sports']

interface ITemplateFilters {
  templates: ITemplate[]
  filters: { searchValue: string; selectedTag: string; currentPage: number }
  handleInputChange: (value: string, isTag: boolean) => void
}

const TemplateFilters: FC<ITemplateFilters> = ({ templates, filters, handleInputChange }) => {
  const token = localStorage.getItem('token')
  const isTablet = useMediaQuery('(max-width: 767.98px)')
  const navigate = useNavigate()

  return (
    <Box className="mb-14 flex items-center justify-between gap-5 md3:flex-col">
      <Box className="flex gap-5 md3:w-full md4:flex-col-reverse md4:gap-3">
        <Autocomplete
          freeSolo
          disableClearable
          options={templates.map((obj) => obj.title) || []}
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
  )
}

export default TemplateFilters
