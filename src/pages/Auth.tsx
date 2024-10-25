import { Box, Paper, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'

const Auth: FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true)
  const { t } = useTranslation(['title'])

  return (
    <Box className="flex flex-1 items-center justify-center p-3">
      <Paper className="max-w-sm p-[60px_32px_32px_32px]">
        <Typography align="center" variant="h4" color="primary" sx={{ marginBottom: 5 }}>
          {isLogin ? t('title.login') : t('title.register')}
        </Typography>

        {isLogin ? <Login /> : <Register />}

        <Typography onClick={() => setIsLogin(!isLogin)} align="center" color="primary" sx={{ marginTop: 1, cursor: 'pointer' }}>
          {isLogin ? t('title.noAccount') : t('title.haveAccount')}
        </Typography>
      </Paper>
    </Box>
  )
}

export default Auth
