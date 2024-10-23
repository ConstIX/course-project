import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { FC } from 'react'
import { Controller } from 'react-hook-form'

interface ISelect {
  name: string
  label: string
  control: any
  options: string[]
}

const RHFSelect: FC<ISelect> = ({ name, label, control, options }) => (
  <Controller
    name={name}
    control={control}
    defaultValue={options[0]}
    render={({ field }) => (
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select {...field} label={label}>
          {options.map((item) => (
            <MenuItem key={item} value={item}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )}
  />
)

export default RHFSelect
