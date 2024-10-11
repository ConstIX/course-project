import { Box, Button, TextField } from '@mui/material'
import moment from 'moment'
import { FC, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useRegisterUserMutation } from '../../redux/services/auth'

const fields = [
  { name: 'username', label: 'Username', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' }
]

const Register: FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm()
  const [registerUser, { isLoading }] = useRegisterUserMutation()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (token) navigate('/')
  }, [navigate, token])

  const onSubmit = async (data: Record<string, string>) => {
    try {
      const {
        token,
        data: { id }
      } = await registerUser({
        ...data,
        registrationDate: moment().format('DD/MM/YYYY HH:mm'),
        loginDate: moment().format('DD/MM/YYYY HH:mm'),
        status: 'active'
      }).unwrap()
      localStorage.setItem('token', token)
      localStorage.setItem('userID', String(id))
    } catch (err) {
      console.error('Failed to register:', err)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field) => (
        <Controller
          key={field.name}
          name={field.name}
          control={control}
          defaultValue=""
          rules={{ required: `${field.label} is required!` }}
          render={({ field: controllerField }) => (
            <TextField
              type={field.type}
              label={field.label}
              fullWidth
              variant="standard"
              error={!!errors[field.name]}
              helperText={errors[field.name]?.message as string}
              {...controllerField}
              sx={field.type === 'password' ? { marginBottom: 5 } : { marginBottom: 2 }}
            />
          )}
        />
      ))}
      <Button type="submit" variant="contained" fullWidth disabled={isLoading} disableElevation>
        Submit
      </Button>
    </Box>
  )
}

export default Register
