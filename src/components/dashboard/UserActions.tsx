import { AdminPanelSettings, Delete, Lock, LockOpen } from '@mui/icons-material'
import { Button, IconButton } from '@mui/material'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeleteUser } from '../../hooks/useDeleteUser'
import { useUpdateUserMutation } from '../../redux/services/users'
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

  const [updateUser] = useUpdateUserMutation()
  const [deleteUserWithResults] = useDeleteUser()

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
      await deleteUserWithResults(selectedUsers)
      onUserDeleted()
      setSnackbarState({ message: 'Action completed successfuly.', open: true, severity: 'success' })
    } catch (error) {
      setSnackbarState({ message: 'Something went wrong.', open: true, severity: 'error' })
      console.error('Error deleting users, templates, and results:', error)
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
