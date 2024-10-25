import styled from '@emotion/styled'
import { InputBase, MenuItem, Select } from '@mui/material'
import { FC } from 'react'
import i18n from '../../utils/i18n'

const CustomInput = styled(InputBase)(() => ({
  '& .MuiInputBase-input': {
    color: '#fff',
    border: 'none'
  }
}))

const LanguageSelect: FC = () => {
  return (
    <Select value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)} input={<CustomInput />} sx={{ '& .MuiSelect-icon': { color: '#fff' } }}>
      <MenuItem value="en">US English</MenuItem>
      <MenuItem value="ru">RU Русский</MenuItem>
    </Select>
  )
}

export default LanguageSelect
