import { Alert, Box, Button, Snackbar, TextField } from '@mui/material'
import moment from 'moment'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useLoginUserMutation } from '../../redux/services/auth'
import { useUpdateUserMutation } from '../../redux/services/users'

const fields = [
  { name: 'email', label: 'Email' },
  { name: 'password', label: 'Password' }
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

  const onSubmit = async (userData: Record<string, string>) => {
    try {
      const { token, data } = await loginUser(userData).unwrap()
      await updateUser({ id: data.id, loginDate: moment().format('DD/MM/YYYY HH:mm') })

      if (data.status !== 'block') {
        localStorage.setItem('token', token)
        localStorage.setItem('userID', `${data.id}`)
      } else {
        setSnackbarState({ message: 'Your account is blocked.', open: true })
      }
    } catch (err) {
      setSnackbarState({ message: 'Login failed. Please try again.', open: true })
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
            label={field.label}
            variant="standard"
            fullWidth
            {...register(field.name, { required: `${field.label} is required!` })}
            error={!!errors[field.name]}
            helperText={errors[field.name]?.message as string}
            sx={{ marginBottom: field.name === 'password' ? 5 : 2 }}
          />
        ))}
        <Button type="submit" variant="contained" fullWidth disabled={isLoading} disableElevation>
          Submit
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
