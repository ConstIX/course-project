import { TextField } from '@mui/material'
import { FC } from 'react'
import { Controller } from 'react-hook-form'

interface ITextField {
  type?: string
  name: string
  label: string
  control: any
  multiline?: boolean
  rows?: number
  rules?: { required: string }
}

const RHFTextField: FC<ITextField> = ({ type = 'text', name, label, control, multiline = false, rows = 1, rules = {} }) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field, fieldState: { error } }) => (
      <TextField type={type} label={label} variant="outlined" fullWidth multiline={multiline} rows={rows} error={!!error} helperText={error ? error.message : ''} {...field} />
    )}
  />
)

export default RHFTextField
