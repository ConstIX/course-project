import { AccountCircle, Dashboard, Logout, Person } from '@mui/icons-material'
import { Box, IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetUserByIdQuery } from '../../redux/services/users'

const HeaderMenu: FC = () => {
  const userId = localStorage.getItem('userID')
  const navigate = useNavigate()

  const { data: user } = useGetUserByIdQuery(userId!)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const navigation = [
    {
      label: 'Profile',
      icon: <Person fontSize="small" />,
      function: () => {
        navigate('/profile')
        setAnchorEl(null)
      }
    },
    ...(user && user.role === 'admin'
      ? [
          {
            label: 'Dashboard',
            icon: <Dashboard fontSize="small" />,
            function: () => {
              navigate('/dashboard')
              setAnchorEl(null)
            }
          }
        ]
      : []),
    {
      label: 'Logout',
      icon: <Logout fontSize="small" />,
      function: () => {
        localStorage.clear()
        navigate('/auth')
      }
    }
  ]

  return (
    <Box>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ padding: 0 }}>
        <AccountCircle fontSize="large" sx={{ color: '#fff' }} />
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
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0
              }
            }
          }
        }}>
        {navigation.map((obj) => (
          <MenuItem key={obj.label} onClick={obj.function}>
            <ListItemIcon>{obj.icon}</ListItemIcon>
            {obj.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default HeaderMenu
