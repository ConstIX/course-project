import { Box, Checkbox, FormControlLabel, FormHelperText } from '@mui/material'
import { FC } from 'react'
import { Controller } from 'react-hook-form'

interface ICheckboxGroup {
  name: string
  control: any
  options: string | string[]
  rules?: { required: string }
  disabled?: boolean
}

const RHFCheckboxGroup: FC<ICheckboxGroup> = ({ name, control, options, rules, disabled = false }) => {
  const optionsArray = typeof options === 'string' ? options.split(',') : options

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Box>
          {optionsArray.map((option, idx) => (
            <FormControlLabel
              key={idx}
              label={option.trim()}
              disabled={disabled}
              control={
                <Checkbox
                  value={option.trim()}
                  checked={value.includes(option.trim())}
                  onChange={(e) => {
                    const newValue = e.target.checked ? [...value, option.trim()] : value.filter((val: string) => val !== option.trim())
                    onChange(newValue)
                  }}
                />
              }
            />
          ))}
          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </Box>
      )}
    />
  )
}

export default RHFCheckboxGroup
