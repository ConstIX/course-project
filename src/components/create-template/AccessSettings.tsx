import { Autocomplete, Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useGetUsersQuery } from '../../redux/services/users'

const tags = ['Technology', 'Science', 'Education', 'Health', 'Art', 'Business', 'Sports']

const AccessSettings: FC = () => {
  const {
    control,
    watch,
    formState: { errors }
  } = useFormContext()
  const accessType = watch('access')

  const { data: users } = useGetUsersQuery()
  const usersData = users?.map((i) => i.email)

  const renderAutocomplete = (name: string, label: string, options: string[], rules = {}, placeholder: string) => (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <Autocomplete
          multiple
          options={options}
          value={value}
          onChange={(_, newValue) => onChange(newValue)}
          renderInput={(params) => <TextField {...params} label={label} variant="outlined" placeholder={placeholder} error={!!errors[name]} helperText={errors[name]?.message as string} />}
        />
      )}
    />
  )

  return (
    <Box className="mb-10 space-y-3">
      <Typography variant="h5" color="primary">
        Access
      </Typography>

      {renderAutocomplete('tags', 'Tags', tags, { required: 'At least one tag is required!' }, 'Start typing...')}

      <Controller
        name="access"
        control={control}
        defaultValue="public"
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel>Access</InputLabel>
            <Select {...field} label="Access">
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="private">Private</MenuItem>
            </Select>
          </FormControl>
        )}
      />

      {accessType === 'private' && renderAutocomplete('selectedUsers', 'Select Users', usersData || [], { required: 'At least one user is required!' }, 'Select users...')}
    </Box>
  )
}

export default AccessSettings
