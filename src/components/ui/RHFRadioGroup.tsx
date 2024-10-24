import { Box, FormControlLabel, FormHelperText, Radio, RadioGroup } from '@mui/material'
import { FC } from 'react'
import { Controller } from 'react-hook-form'

interface IRadioGroup {
  name: string
  control: any
  options: string | string[]
  rules?: { required: string }
  disabled?: boolean
  required?: boolean
}

const RHFRadioGroup: FC<IRadioGroup> = ({ name, control, options, rules, disabled = false, required = false }) => {
  const optionsArray = typeof options === 'string' ? options.split(',') : options

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={required ? rules : {}}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Box>
          <RadioGroup row>
            {optionsArray.map((option, idx) => (
              <FormControlLabel key={idx} label={option.trim()} disabled={disabled} control={<Radio value={option.trim()} checked={value === option.trim()} onChange={onChange} />} />
            ))}
          </RadioGroup>
          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </Box>
      )}
    />
  )
}

export default RHFRadioGroup
