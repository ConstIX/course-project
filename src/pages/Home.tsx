import { Add, Search } from '@mui/icons-material'
import { Box, Button, InputAdornment, TextField } from '@mui/material'
import { FC } from 'react'
import TemplateCard from '../components/template/TemplateCard'
import { useGetTemplatesQuery } from '../redux/services/templates'

const Home: FC = () => {
  const { data: templates } = useGetTemplatesQuery()
  const token = localStorage.getItem('token')

  return (
    <Box className="mx-auto w-full max-w-7xl px-3 py-32 md3:mt-24">
      <Box className="mb-10 flex items-center justify-between">
        <TextField
          id="input-with-icon-textfield"
          placeholder="Search..."
          type="search"
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }
          }}
        />

        {token && (
          <Button href="/create-template" variant="contained" color="primary" disableElevation startIcon={<Add />}>
            New template
          </Button>
        )}
      </Box>

      <Box className="space-y-5">{templates && templates.map((obj) => <TemplateCard key={obj.id} {...obj} />)}</Box>
    </Box>
  )
}

export default Home
