import { AccountCircle, MoreVert } from '@mui/icons-material'
import { Box, IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material'
import { FC, useState } from 'react'

interface IDropdownMenu {
  actions: { label: string; icon: JSX.Element; function: () => void }[]
  isHeader: boolean
}

const DropdownMenu: FC<IDropdownMenu> = ({ actions, isHeader = false }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  return (
    <Box onClick={(e) => e.stopPropagation()}>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ padding: 0 }}>
        {isHeader ? <AccountCircle fontSize="large" sx={{ color: '#fff' }} /> : <MoreVert />}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.12))',
              mt: 1.5,
              ...(isHeader && {
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 12,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0
                }
              })
            }
          }
        }}>
        {actions.map((obj) => (
          <MenuItem
            key={obj.label}
            onClick={() => {
              obj.function()
              setAnchorEl(null)
            }}>
            <ListItemIcon>{obj.icon}</ListItemIcon>
            {obj.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default DropdownMenu
