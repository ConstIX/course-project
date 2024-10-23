import { Box, Typography } from '@mui/material'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useGetUsersQuery } from '../../redux/services/users'
import RHFAutocomplete from '../ui/RHFAutocomplete'
import RHFSelect from '../ui/RHFSelect'

const tags = ['Technology', 'Science', 'Education', 'Health', 'Art', 'Business', 'Sports']

const AccessSettings: FC = () => {
  const { control, watch } = useFormContext()
  const accessType = watch('access')

  const { data: users } = useGetUsersQuery()
  const usersData = users?.map((i) => i.email)

  return (
    <Box className="mb-10 space-y-3">
      <Typography variant="h5" color="primary">
        Access
      </Typography>

      <RHFAutocomplete name="tags" label="Tags" control={control} options={tags} placeholder="Start typing..." rules={{ required: 'At least one tag is required!' }} />
      <RHFSelect name="access" label="Access" control={control} options={['public', 'private']} defaultValue="public" />

      {accessType === 'private' && (
        <RHFAutocomplete name="selectedUsers" label="Select users" control={control} options={usersData || []} placeholder="Select users..." rules={{ required: 'At least one user is required!' }} />
      )}
    </Box>
  )
}

export default AccessSettings
