import { Autocomplete, TextField } from '@mui/material'
import { FC } from 'react'
import { Controller } from 'react-hook-form'

interface IAutocomplete {
  name: string
  label?: string
  control: any
  options?: string[]
  placeholder?: string
  rules?: { required: string }
  freeSolo?: boolean
  disabled?: boolean
}

const RHFAutocomplete: FC<IAutocomplete> = ({ name, label = '', control, options = [], placeholder, rules, freeSolo = false, disabled = false }) => (
  <Controller
    name={name}
    control={control}
    defaultValue={[]}
    rules={rules}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <Autocomplete
        disabled={disabled}
        multiple
        freeSolo={freeSolo}
        options={options}
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        renderInput={(params) => <TextField {...params} label={label} variant="outlined" placeholder={placeholder} error={!!error} helperText={error ? error.message : ''} />}
      />
    )}
  />
)

export default RHFAutocomplete
