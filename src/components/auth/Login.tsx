import { Box, Button, TextField } from '@mui/material'
import moment from 'moment'
import { FC, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useLoginUserMutation } from '../../redux/services/auth'
import { useUpdateUserMutation } from '../../redux/services/users'

const Login: FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm()
  const [loginUser, { isLoading }] = useLoginUserMutation()
  const [updateUser] = useUpdateUserMutation()

  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const onSubmit = async (data: Record<string, string>) => {
    try {
      const {
        token,
        data: { id, status }
      } = await loginUser(data).unwrap()
      await updateUser({ id, loginDate: moment().format('DD/MM/YYYY HH:mm') })
      if (status !== 'block') {
        localStorage.setItem('token', token)
        localStorage.setItem('userID', String(id))
      }
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  useEffect(() => {
    if (token) navigate('/')
  }, [navigate, token])

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {['email', 'password'].map((field, idx) => (
        <Controller
          key={field}
          name={field}
          control={control}
          defaultValue=""
          rules={{ required: `${field.charAt(0).toUpperCase() + field.slice(1)} is required!` }}
          render={({ field }) => (
            <TextField
              type={field.name}
              label={field.name.charAt(0).toUpperCase() + field.name.slice(1)}
              variant="standard"
              fullWidth
              error={!!errors[field.name]}
              helperText={errors[field.name]?.message as string}
              {...field}
              sx={idx === 0 ? { marginBottom: 2 } : { marginBottom: 5 }}
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

export default Login
