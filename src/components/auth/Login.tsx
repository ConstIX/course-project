import { Alert, Box, Button, Snackbar, TextField } from '@mui/material'
import moment from 'moment'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useLoginUserMutation } from '../../redux/services/auth'
import { useUpdateUserMutation } from '../../redux/services/users'

const fields = [
  { name: 'email', label: 'emailRequired' },
  { name: 'password', label: 'passwordRequired' }
]

const Login: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()
  const [loginUser, { isLoading }] = useLoginUserMutation()
  const [updateUser] = useUpdateUserMutation()
  const [snackbarState, setSnackbarState] = useState<{ message: string; open: boolean }>({ message: '', open: false })

  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const { t } = useTranslation(['field', 'button', 'error', 'toaster'])

  const onSubmit = async (userData: Record<string, string>) => {
    try {
      const { token, data } = await loginUser(userData).unwrap()
      await updateUser({ id: data.id, loginDate: moment().format('DD/MM/YYYY HH:mm') })

      if (data.status !== 'block') {
        localStorage.setItem('token', token)
        localStorage.setItem('userID', `${data.id}`)
      } else {
        setSnackbarState({ message: t('toaster.blocked', { ns: 'toaster' }), open: true })
      }
    } catch (err) {
      setSnackbarState({ message: t('toaster.loginFailed', { ns: 'toaster' }), open: true })
      console.error('Login failed:', err)
    }
  }

  useEffect(() => {
    if (token) navigate('/')
  }, [navigate, token])

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field) => (
          <TextField
            key={field.name}
            type={field.name}
            label={t(`field.${field.name}`)}
            variant="standard"
            fullWidth
            {...register(field.name, { required: t(`error.${field.label}`, { ns: 'error' }) })}
            error={!!errors[field.name]}
            helperText={errors[field.name]?.message as string}
            sx={{ marginBottom: field.name === 'password' ? 5 : 2 }}
          />
        ))}
        <Button type="submit" variant="contained" fullWidth disabled={isLoading} disableElevation>
          {t('button.submit', { ns: 'button' })}
        </Button>
      </Box>

      <Snackbar open={snackbarState.open} autoHideDuration={3000} onClose={() => setSnackbarState((prev) => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbarState((prev) => ({ ...prev, open: false }))} severity="error">
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Login
