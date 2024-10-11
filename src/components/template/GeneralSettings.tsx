import { Box, MenuItem, Select, TextField } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const GeneralSettings: FC<any> = () => {
  const {
    control,
    watch,
    formState: { errors }
  } = useFormContext()

  const themeType = watch('theme')

  return (
    <Box>
      <Controller
        name="title"
        control={control}
        defaultValue=""
        rules={{ required: 'Title is required!' }}
        render={({ field }) => (
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            {...field}
            error={!!errors.title}
            helperText={errors.title?.message as string}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            label="Description (Markdown)"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            {...field}
            error={!!errors.description}
            helperText={errors.description?.message as string}
          />
        )}
      />

      <Controller
        name="theme"
        control={control}
        defaultValue="quiz"
        render={({ field }) => (
          <Select {...field} fullWidth>
            <MenuItem value="quiz">Quiz</MenuItem>
            <MenuItem value="exam">Exam</MenuItem>
            <MenuItem value="test">Test</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        )}
      />

      {themeType === 'other' && (
        <Controller
          name="customTheme"
          control={control}
          defaultValue=""
          rules={{ required: 'Theme is required!' }}
          render={({ field }) => (
            <TextField
              label="Custom Theme"
              variant="outlined"
              fullWidth
              {...field}
              error={!!errors.customTheme}
              helperText={errors.customTheme?.message as string}
            />
          )}
        />
      )}
    </Box>
  )
}

export default GeneralSettings
