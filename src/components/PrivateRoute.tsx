import { FC, ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useGetUserByIdQuery } from '../redux/services/users'

const PrivateRoute: FC<{ element: ReactElement }> = ({ element }) => {
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userID')
  const { pathname } = useLocation()

  const { data: user } = useGetUserByIdQuery(userId || '')

  if (!token) return <Navigate to="/auth" />
  if (pathname === '/dashboard' && user?.role === 'guest') return <Navigate to="/" />
  return element
}

export default PrivateRoute
