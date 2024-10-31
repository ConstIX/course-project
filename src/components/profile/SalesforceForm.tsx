import { Box, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useRegisterSalesforceUserMutation } from '../../redux/services/salesforce'
import { IUser } from '../../types/user.types'

interface SalesforceFormProps {
  open: boolean
  setOpen: (i: boolean) => void
  setSnackbarState: (state: { message: string; open: boolean; severity: 'success' | 'error' }) => void
  user: IUser | undefined
}

const fields = [
  { type: 'text', name: 'phone', label: 'phoneRequired' },
  { type: 'text', name: 'fax', label: 'faxRequired' },
  { type: 'text', name: 'address', label: 'addressRequired' }
]

const SalesforceForm: FC<SalesforceFormProps> = ({ open, setOpen, user, setSnackbarState }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const { t } = useTranslation(['field', 'button', 'error', 'toaster'])
  const [registerSalesforceUser] = useRegisterSalesforceUserMutation()

  const onSubmit = async (userData: Record<string, string>) => {
    try {
      const salesforceUser = {
        Name: user?.username || '',
        Phone: userData.phone,
        Fax: userData.fax,
        BillingState: userData.address
      }
      await registerSalesforceUser(salesforceUser).unwrap()

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
      <DialogTitle color="primary">{t('button.connect', { ns: 'button' })}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field) => (
            <TextField
              key={field.name}
              type={field.type}
              label={t(`field.${field.name}`)}
              variant="standard"
              fullWidth
              {...register(field.name, { required: t(`error.${field.label}`, { ns: 'error' }) })}
              error={!!errors[field.name]}
              helperText={errors[field.name]?.message as string}
              sx={{ marginBottom: field.name === 'address' ? 5 : 2 }}
            />
          ))}
          <Box className="flex gap-3">
            <Button type="submit" variant="contained" fullWidth disableElevation>
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

export default SalesforceForm
