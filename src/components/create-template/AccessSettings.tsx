import { Box, Typography } from '@mui/material'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useGetUsersQuery } from '../../redux/services/users'
import RHFAutocomplete from '../ui/RHFAutocomplete'
import RHFSelect from '../ui/RHFSelect'

const tags = ['Technology', 'Science', 'Education', 'Health', 'Art', 'Business', 'Sports']

const AccessSettings: FC = () => {
  const { control, watch } = useFormContext()
  const { t } = useTranslation(['field', 'title', 'error'])
  const accessType = watch('access')

  const { data: users } = useGetUsersQuery()
  const usersData = users?.map((i) => i.email)

  return (
    <Box className="mb-10 space-y-3">
      <Typography variant="h5" color="primary">
        {t('title.access', { ns: 'title' })}
      </Typography>

      <RHFAutocomplete name="tags" label={t('field.chooseTag')} control={control} options={tags} rules={{ required: t('error.tagRequired', { ns: 'error' }) }} required />
      <RHFSelect name="access" label={t('field.access')} control={control} options={['public', 'private']} defaultValue="public" />

      {accessType === 'private' && (
        <RHFAutocomplete name="selectedUsers" label={t('field.selectUsers')} control={control} options={usersData || []} rules={{ required: t('error.userRequired', { ns: 'error' }) }} required />
      )}
    </Box>
  )
}

export default AccessSettings
