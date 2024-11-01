import { Box, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useRegisterSalesforceAccountMutation, useRegisterSalesforceContactMutation } from '../../redux/services/salesforce'
import { IUser } from '../../types/user.types'

interface SalesforceFormProps {
  open: boolean
  setOpen: (i: boolean) => void
  setSnackbarState: (state: { message: string; open: boolean; severity: 'success' | 'error' }) => void
  user: IUser | undefined
}

const fields = [
  { type: 'text', name: 'phone' },
  { type: 'text', name: 'fax' }
]

const SalesforceForm: FC<SalesforceFormProps> = ({ open, setOpen, user, setSnackbarState }) => {
  const { register, handleSubmit, reset } = useForm()

  const { t } = useTranslation(['field', 'button', 'toaster', 'title'])
  const [registerSalesforceAccount, { isLoading }] = useRegisterSalesforceAccountMutation()
  const [registerSalesforceContact] = useRegisterSalesforceContactMutation()

  const onSubmit = async (userData: Record<string, string>) => {
    try {
      const { id: accountId } = await registerSalesforceAccount({ Name: user?.username || '-' }).unwrap()

      const salesforceContact = {
        LastName: user?.username || '',
        Email: user?.email || '',
        Phone: userData.phone,
        Fax: userData.fax,
        AccountId: accountId
      }
      await registerSalesforceContact(salesforceContact).unwrap()

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
      <DialogTitle color="primary">{t('title.optionalSettings', { ns: 'title' })}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field) => (
            <TextField
              key={field.name}
              type={field.type}
              label={t(`field.${field.name}`)}
              placeholder=""
              variant="standard"
              fullWidth
              {...register(field.name)}
              sx={{ marginBottom: field.name === 'address' ? 5 : 2 }}
            />
          ))}
          <Box className="flex gap-3">
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

export default SalesforceForm
