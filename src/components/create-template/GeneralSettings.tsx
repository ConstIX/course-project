import { Box } from '@mui/material'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import RHFSelect from '../ui/RHFSelect'
import RHFTextField from '../ui/RHFTextField'

const GeneralSettings: FC = () => {
  const { control, watch } = useFormContext()
  const { t } = useTranslation(['field', 'error'])
  const themeType = watch('theme')

  return (
    <Box className="mb-10 space-y-3">
      <RHFTextField name="title" label={t('field.title')} control={control} rules={{ required: t('error.titleRequired', { ns: 'error' }) }} required />
      <RHFTextField name="description" label={t('field.description')} control={control} multiline rows={3} />

      <RHFSelect name="theme" label={t('field.theme')} control={control} options={['quiz', 'exam', 'test', 'other']} defaultValue="quiz" />

      {themeType === 'other' && <RHFTextField name="customTheme" label={t('field.customTheme')} control={control} rules={{ required: t('error.themeRequired', { ns: 'error' }) }} required />}
    </Box>
  )
}

export default GeneralSettings
