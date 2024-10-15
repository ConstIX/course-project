import { Box, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

const HeaderDrawer: FC<any> = ({ drawerOpen, setDrawerOpen, navigation }) => {
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
                <ListItemText primary={obj.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

export default HeaderDrawer
