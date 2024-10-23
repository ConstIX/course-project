import { useNavigate } from 'react-router-dom'
import { resultsApi, useDeleteResultsMutation } from '../redux/services/results'
import { useDeleteUserMutation } from '../redux/services/users'

export const useDeleteUser = () => {
  const [getResultsByUserId] = resultsApi.useLazyGetResultsByUserIdQuery()
  const [deleteUser] = useDeleteUserMutation()
  const [deleteResults] = useDeleteResultsMutation()

  const userId = localStorage.getItem('userID')
  const navigate = useNavigate()

  const deleteUserWithResults = async (selectedUsers: number[]) => {
    try {
      for (const id of selectedUsers) {
        const userResults = await getResultsByUserId(id).unwrap()
        for (const results of userResults) {
          await deleteResults(results.id!).unwrap()
        }

        await deleteUser(id).unwrap()
      }

      if (selectedUsers.includes(+userId!)) {
        localStorage.clear()
        navigate('/auth')
      }
    } catch (err) {
      console.error('Failed to delete user and its results:', err)
    }
  }

  return [deleteUserWithResults]
}
