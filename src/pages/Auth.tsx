import { Box, Paper, Typography } from '@mui/material'
import { FC, useState } from 'react'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'

const Auth: FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true)

  return (
    <Box className="flex flex-1 items-center justify-center p-3">
      <Paper className="max-w-sm p-[60px_32px_32px_32px]">
        <Typography align="center" variant="h4" gutterBottom>
          {isLogin ? 'Log-in' : 'Register'}
        </Typography>

        {isLogin ? <Login /> : <Register />}

        <Typography onClick={() => setIsLogin(!isLogin)} align="center" color="primary" sx={{ marginTop: 1, cursor: 'pointer' }}>
          {isLogin ? 'Don`t have an account?' : 'Already have an account?'}
        </Typography>
      </Paper>
    </Box>
  )
}

export default Auth
