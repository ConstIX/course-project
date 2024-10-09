import { Box, MenuItem, Select, TextField } from '@mui/material'
import { FC } from 'react'

import { useFormContext } from 'react-hook-form'

const GeneralSettings: FC<any> = () => {
  const {
    register,
    watch,
    formState: { errors }
  } = useFormContext()
  const themeType = watch(`theme`)

  return (
    <Box>
      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        error={!!errors.title}
        helperText={errors.title?.message as string}
        {...register('title', { required: 'Title is required!' })}
      />

      <TextField
        label="Description (Markdown)"
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        error={!!errors.description}
        helperText={errors.description?.message as string}
        {...register('description')}
      />

      <Select {...register('theme')} fullWidth defaultValue={'quiz'}>
        <MenuItem value="quiz">Quiz</MenuItem>
        <MenuItem value="exam">Exam</MenuItem>
        <MenuItem value="test">Test</MenuItem>
        <MenuItem value="other">Other</MenuItem>
      </Select>

      {themeType === 'other' && (
        <TextField
          label="Theme"
          variant="outlined"
          fullWidth
          error={!!errors.customTheme}
          helperText={errors.customTheme?.message as string}
          {...register('customTheme', { required: 'Theme is required!' })}
        />
      )}
    </Box>
  )
}

export default GeneralSettings
