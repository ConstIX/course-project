import { Box } from '@mui/material'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import RHFSelect from '../ui/RHFSelect'
import RHFTextField from '../ui/RHFTextField'

const GeneralSettings: FC = () => {
  const { control, watch } = useFormContext()
  const themeType = watch('theme')

  return (
    <Box className="mb-10 space-y-3">
      <RHFTextField name="title" label="Title" control={control} rules={{ required: 'Title is required!' }} required />
      <RHFTextField name="description" label="Description" control={control} multiline rows={3} />

      <RHFSelect name="theme" label="Theme" control={control} options={['quiz', 'exam', 'test', 'other']} defaultValue="quiz" />

      {themeType === 'other' && <RHFTextField name="customTheme" label="Custom theme" control={control} rules={{ required: 'Theme is required!' }} required />}
    </Box>
  )
}

export default GeneralSettings
