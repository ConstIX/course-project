import { Box, Typography } from '@mui/material'
import { FC, useState } from 'react'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'

const Auth: FC = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <Box className="flex flex-1 items-center justify-center px-3">
      <Box className="mx-auto w-full max-w-sm rounded-lg px-8 py-6 shadow-md">
        <Typography align="center" variant="h4" gutterBottom>
          {isLogin ? 'Log-in' : 'Register'}
        </Typography>

        {isLogin ? <Login /> : <Register />}

        <Typography
          onClick={() => setIsLogin(!isLogin)}
          align="center"
          color="primary"
          sx={{ marginTop: 1, cursor: 'pointer' }}>
          {isLogin ? 'Don`t have an account?' : 'Already have an account?'}
        </Typography>
      </Box>
    </Box>
  )
}

export default Auth
