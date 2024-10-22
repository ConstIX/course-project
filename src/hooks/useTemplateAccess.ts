import { useGetUserByIdQuery } from '../redux/services/users'

export const useTemplateAccess = (access: string, selectedUsers: string[] | undefined, isAdminOrAuthor: boolean) => {
  const userId = localStorage.getItem('userID')
  const { data: user } = useGetUserByIdQuery(userId || '')

  const hasAccess = access === 'public' || (access === 'private' && selectedUsers?.includes(user?.email || '')) || isAdminOrAuthor
  return [hasAccess]
}
