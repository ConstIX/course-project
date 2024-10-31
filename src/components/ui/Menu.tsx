import { Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { IUser } from '../../types/user.types'

interface IDropdownMenu {
  actions: { label: string; icon?: JSX.Element; function: () => void }[]
  icon: JSX.Element
  isHeader?: boolean
  selected?: boolean
  user?: IUser
}

const DropdownMenu: FC<IDropdownMenu> = ({ actions, icon, isHeader = false, selected = false, user = {} }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  return (
    <Box onClick={(e) => e.stopPropagation()}>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ padding: 0 }}>
        {icon}
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
        {isHeader && (
          <Box className="px-5 pb-2">
            <Typography>{user.username}</Typography>
            <Typography color="textSecondary" variant="body2">
              {user.email}
            </Typography>
          </Box>
        )}
        {isHeader && <Divider />}
        {actions.map((obj, idx) => (
          <MenuItem
            key={obj.label}
            selected={selected && idx === selectedIndex}
            onClick={() => {
              obj.function()
              setSelectedIndex(idx)
              setAnchorEl(null)
            }}>
            {obj.icon && <ListItemIcon>{obj.icon}</ListItemIcon>}
            {obj.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default DropdownMenu
