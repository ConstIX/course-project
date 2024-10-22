import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const themes = ['quiz', 'exam', 'test', 'other']

const GeneralSettings: FC = () => {
  const {
    control,
    watch,
    formState: { errors }
  } = useFormContext()
  const themeType = watch('theme')

  const renderTextField = (name: string, label: string, multiline = false, rows = 1, rules = {}) => (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => <TextField label={label} variant="outlined" fullWidth multiline={multiline} rows={rows} {...field} error={!!errors[name]} helperText={errors[name]?.message as string} />}
    />
  )

  return (
    <Box className="mb-10 space-y-3">
      {renderTextField('title', 'Title', false, 1, { required: 'Title is required!' })}
      {renderTextField('description', 'Description', true, 3)}

      <Controller
        name="theme"
        control={control}
        defaultValue="quiz"
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel>Theme</InputLabel>
            <Select {...field} label="Theme">
              {themes.map((item) => (
                <MenuItem key={item} value={item}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      {themeType === 'other' && renderTextField('customTheme', 'Custom Theme', false, 1, { required: 'Theme is required!' })}
    </Box>
  )
}

export default GeneralSettings
