import { AdminPanelSettings, Delete, Lock, LockOpen } from '@mui/icons-material'
import { Button, IconButton } from '@mui/material'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { resultsApi, useDeleteResponseMutation } from '../../redux/services/results'
import { templatesApi, useDeleteTemplateMutation } from '../../redux/services/templates'
import { useDeleteUserMutation, useUpdateUserMutation } from '../../redux/services/users'
import { IUser } from '../../types/user.types'

interface IUserActions {
  selectedUsers: number[]
  users: IUser[]
  setSnackbarState: (state: { message: string; open: boolean; severity: 'success' | 'error' }) => void
  onUserDeleted: () => void
}

const UserActions: FC<IUserActions> = ({ selectedUsers, users, setSnackbarState, onUserDeleted }) => {
  const userId = localStorage.getItem('userID')
  const navigate = useNavigate()

  const [getTemplatesByUserId] = templatesApi.useLazyGetTemplatesByUserIdQuery()
  const [getResponsesByTemplateId] = resultsApi.useLazyGetResponsesByTemplateIdQuery()
  const [getResponsesByUserId] = resultsApi.useLazyGetResponsesByUserIdQuery()

  const [deleteUser] = useDeleteUserMutation()
  const [updateUser] = useUpdateUserMutation()
  const [deleteTemplate] = useDeleteTemplateMutation()
  const [deleteResponse] = useDeleteResponseMutation()

  const handleAction = async (status: 'block' | 'active') => {
    try {
      for (const id of selectedUsers) {
        await updateUser({ id, status }).unwrap()
      }

      if (status === 'block' && selectedUsers.includes(+userId!)) {
        localStorage.clear()
        navigate('/auth')
      }

      setSnackbarState({ message: 'Action completed successfuly.', open: true, severity: 'success' })
    } catch (error) {
      setSnackbarState({ message: 'Something went wrong.', open: true, severity: 'error' })
      console.error(`Error updating users:`, error)
    }
  }

  const handleToggleAdmin = async () => {
    try {
      for (const id of selectedUsers) {
        const user = users?.find((user) => user.id === id)
        const role = user?.role === 'admin' ? 'guest' : 'admin'
        await updateUser({ id, role }).unwrap()

        if (role === 'guest' && selectedUsers.includes(+userId!)) {
          localStorage.clear()
          navigate('/auth')
        }
      }
      setSnackbarState({ message: 'Action completed successfuly.', open: true, severity: 'success' })
    } catch (error) {
      setSnackbarState({ message: 'Something went wrong.', open: true, severity: 'error' })
      console.error('Error toggling admin role:', error)
    }
  }

  const handleDelete = async () => {
    try {
      for (const id of selectedUsers) {
        await deleteUser(id).unwrap()

        const userTemplates = await getTemplatesByUserId(id).unwrap()
        for (const template of userTemplates) {
          const templateResponses = await getResponsesByTemplateId(template.id).unwrap()
          for (const response of templateResponses) {
            await deleteResponse(response.id).unwrap()
          }

          await deleteTemplate(template.id).unwrap()
        }

        const userResponses = await getResponsesByUserId(id).unwrap()
        for (const response of userResponses) {
          await deleteResponse(response.id).unwrap()
        }
      }
      onUserDeleted()

      if (selectedUsers.includes(+userId!)) {
        localStorage.clear()
        navigate('/auth')
      }
      setSnackbarState({ message: 'Action completed successfuly.', open: true, severity: 'success' })
    } catch (error) {
      setSnackbarState({ message: 'Something went wrong.', open: true, severity: 'error' })
      console.error('Error deleting users, templates, and responses:', error)
    }
  }

  return (
    <div className="mb-5 flex gap-3">
      <Button onClick={() => handleAction('block')} variant="contained" disableElevation disabled={!selectedUsers.length} startIcon={<Lock />} sx={{ textTransform: 'none' }}>
        Block
      </Button>
      <IconButton onClick={() => handleAction('active')} color="primary" disabled={!selectedUsers.length}>
        <LockOpen />
      </IconButton>
      <IconButton onClick={handleToggleAdmin} color="secondary" disabled={!selectedUsers.length}>
        <AdminPanelSettings />
      </IconButton>
      <IconButton onClick={handleDelete} color="error" disabled={!selectedUsers.length}>
        <Delete />
      </IconButton>
    </div>
  )
}

export default UserActions
