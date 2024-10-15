import { Dashboard } from '@mui/icons-material'
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

const HeaderDrawer: FC<any> = ({ drawerOpen, setDrawerOpen, navigation, status }) => {
  const navigate = useNavigate()

  return (
    <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
      <Box sx={{ width: '250px' }}>
        <List>
          {navigation.map((obj) => (
            <ListItem key={obj.label} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(`${obj.link}`)
                  setDrawerOpen(false)
                }}>
                <ListItemIcon>{obj.icon}</ListItemIcon>
                <ListItemText primary={obj.label} />
              </ListItemButton>
            </ListItem>
          ))}
          {status === 'admin' && (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(`/dashboard`)
                  setDrawerOpen(false)
                }}>
                <ListItemIcon>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  )
}

export default HeaderDrawer
