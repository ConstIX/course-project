import { Logout } from '@mui/icons-material'
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetUserByIdQuery } from '../redux/services/users'

const Header: FC = () => {
  const userId = localStorage.getItem('userID')
  const { data: user } = useGetUserByIdQuery(userId as string)

  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userID')
    navigate('/auth')
  }

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Box className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 md1:p-0">
          <Typography>{userId ? `Hello, ${user?.username}!` : 'Hello!'}</Typography>
          <Button onClick={handleLogout} color="inherit" startIcon={<Logout />} sx={{ textTransform: 'none' }}>
            {userId ? 'Logout' : 'Log-in'}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
