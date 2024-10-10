import { Autocomplete, Box, MenuItem, Select, TextField } from '@mui/material'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useGetUsersQuery } from '../../redux/services/users'

const tags = ['Technology', 'Science', 'Education', 'Health', 'Art', 'Business', 'Sports']

const AccessSettings: FC<any> = () => {
  const { register, watch, setValue } = useFormContext()
  const accessType = watch(`access`)

  const { data: users } = useGetUsersQuery({})
  const usersData = users ? users.map((i) => i.email) : []

  return (
    <Box>
      <Autocomplete
        multiple
        options={tags}
        onChange={(_, newValue) => setValue('tags', newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Tags" variant="outlined" placeholder="Start typing..." />
        )}
      />

      <Select defaultValue={'public'} {...register('access')} fullWidth>
        <MenuItem value="public">Public</MenuItem>
        <MenuItem value="private">Private</MenuItem>
      </Select>

      {accessType === 'private' && (
        <Autocomplete
          multiple
          options={usersData}
          onChange={(_, newValue) => setValue('selectedUsers', newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Select Users" variant="outlined" placeholder="Select users..." />
          )}
        />
      )}
    </Box>
  )
}

export default AccessSettings
