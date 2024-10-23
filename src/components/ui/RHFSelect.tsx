import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import { FC } from 'react'
import { Controller } from 'react-hook-form'

interface ISelect {
  name: string
  label?: string
  control: any
  options: string | string[]
  defaultValue?: string
  rules?: { required: string }
  disabled?: boolean
}

const RHFSelect: FC<ISelect> = ({ name, label = '', control, options, defaultValue = '', rules = {}, disabled = false }) => {
  const optionsArray = typeof options === 'string' ? options.split(',') : options

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth disabled={disabled} error={error ? true : false}>
          <InputLabel>{label}</InputLabel>
          <Select {...field} label={label}>
            {optionsArray.map((item, idx) => (
              <MenuItem key={idx} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  )
}

export default RHFSelect
