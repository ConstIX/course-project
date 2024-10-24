import { useEffect, useState } from 'react'
import { usersApi } from '../redux/services/users'

export const useIsAdminOrAuthor = (authorId: number) => {
  const userId = localStorage.getItem('userID')
  const [isAdminOrAuthor, setIsAdminOrAuthor] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [getUserById] = usersApi.useLazyGetUserByIdQuery()

  useEffect(() => {
    const checkAccess = async () => {
      if (!userId) {
        setIsAdminOrAuthor(false)
        return
      }

      const user = await getUserById(userId).unwrap()
      if (user) {
        setIsAdminOrAuthor(user.role === 'admin' || user.id === authorId)
        setIsAdmin(user.role === 'admin')
      } else setIsAdminOrAuthor(false)
    }

    checkAccess()
  }, [authorId, userId, getUserById])

  return [isAdminOrAuthor, isAdmin]
}
