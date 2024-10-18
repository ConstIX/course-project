import { Alert, Box, Button, Snackbar, TextField } from '@mui/material'
import moment from 'moment'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useRegisterUserMutation } from '../../redux/services/auth'

const fields = [
  { name: 'username', label: 'Username', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' }
]

const Register: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()
  const [registerUser, { isLoading }] = useRegisterUserMutation()
  const [snackbarState, setSnackbarState] = useState<{ message: string; open: boolean }>({ message: '', open: false })

  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const onSubmit = async (userData: Record<string, string>) => {
    try {
      const { token, data } = await registerUser({
        ...userData,
        registrationDate: moment().format('DD/MM/YYYY HH:mm'),
        loginDate: moment().format('DD/MM/YYYY HH:mm'),
        status: 'active'
      }).unwrap()

      localStorage.setItem('token', token)
      localStorage.setItem('userID', `${data.id}`)
    } catch (err) {
      setSnackbarState({ message: 'Register failed. Please try again.', open: true })
      console.error('Failed to register:', err)
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
            type={field.type}
            label={field.label}
            variant="standard"
            fullWidth
            {...register(field.name, { required: `${field.label} is required!` })}
            error={!!errors[field.name]}
            helperText={errors[field.name]?.message as string}
            sx={{ marginBottom: field.type === 'password' ? 5 : 2 }}
          />
        ))}
        <Button type="submit" variant="contained" fullWidth disabled={isLoading} disableElevation>
          Submit
        </Button>
      </Box>

      <Snackbar
        open={snackbarState.open}
        autoHideDuration={3000}
        onClose={() => setSnackbarState((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbarState((prev) => ({ ...prev, open: false }))} severity="error">
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Register
