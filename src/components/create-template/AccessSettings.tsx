import { Autocomplete, Box, MenuItem, Select, TextField, Typography } from '@mui/material'
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

  const { data: users } = useGetUsersQuery({})
  const usersData = users ? users.map((i) => i.email) : []

  return (
    <Box>
      <Typography variant="h5" color="primary">
        Access
      </Typography>

      <Controller
        name="tags"
        control={control}
        defaultValue={[]}
        rules={{ required: 'At least one tag is required!' }}
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            multiple
            options={tags}
            value={value}
            onChange={(_, newValue) => onChange(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                variant="outlined"
                placeholder="Start typing..."
                error={!!errors.tags}
                helperText={errors.tags?.message as string}
              />
            )}
          />
        )}
      />

      <Controller
        name="access"
        control={control}
        defaultValue="public"
        render={({ field }) => (
          <Select {...field} fullWidth>
            <MenuItem value="public">Public</MenuItem>
            <MenuItem value="private">Private</MenuItem>
          </Select>
        )}
      />

      {accessType === 'private' && (
        <Controller
          name="selectedUsers"
          control={control}
          defaultValue={[]}
          rules={{ required: 'At least one user is required!' }}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              multiple
              options={usersData}
              value={value}
              onChange={(_, newValue) => onChange(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Users"
                  variant="outlined"
                  placeholder="Select users..."
                  error={!!errors.selectedUsers}
                  helperText={errors.selectedUsers?.message as string}
                />
              )}
            />
          )}
        />
      )}
    </Box>
  )
}

export default AccessSettings
