import { Box, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import RHFSelect from './RHFSelect'

interface IIntegrationForm {
  open: boolean
  setOpen: (i: boolean) => void
  setSnackbarState: (state: { message: string; open: boolean; severity: 'success' | 'error' }) => void
  fields: { type: string; name: string; label?: string }[]
  onSubmit: (data: Record<string, string>) => Promise<void>
  title: string
  isLoading: boolean
}

const IntegrationForm: FC<IIntegrationForm> = ({ open, setOpen, setSnackbarState, fields, onSubmit, title, isLoading }) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()
  const { t } = useTranslation(['field', 'button', 'toaster', 'title', 'error'])

  const handleFormSubmit = async (userData: Record<string, string>) => {
    try {
      await onSubmit(userData)
      reset()
      setOpen(false)
      setSnackbarState({ message: t('toaster.actionCompleted', { ns: 'toaster' }), open: true, severity: 'success' })
    } catch (err) {
      setSnackbarState({ message: t('toaster.error', { ns: 'toaster' }), open: true, severity: 'error' })
      console.error('Failed:', err)
    }
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle color="primary">{t(`title.${title}`, { ns: 'title' })}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
          <Box className="space-y-3 pt-2">
            {fields.map((field) =>
              field.type === 'select' ? (
                <RHFSelect key={field.name} name={field.name} label={t(`field.${field.name}`)} control={control} options={['High', 'Medium', 'Low']} defaultValue="Low" />
              ) : (
                <TextField
                  key={field.name}
                  type={field.type}
                  label={t(`field.${field.name}`)}
                  variant="outlined"
                  fullWidth
                  {...register(field.name, field.label ? { required: t(`error.${field.label}`, { ns: 'error' }) } : {})}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]?.message as string}
                />
              )
            )}
          </Box>

          <Box className="mt-5 flex gap-3">
            <Button type="submit" variant="contained" fullWidth disableElevation disabled={isLoading}>
              {t('button.submit', { ns: 'button' })}
            </Button>
            <Button onClick={() => setOpen(false)} variant="outlined" color="error" fullWidth disableElevation>
              {t('button.cancel', { ns: 'button' })}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default IntegrationForm
