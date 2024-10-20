import { FC, ReactElement } from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute: FC<{ element: ReactElement }> = ({ element }) => {
  const token = localStorage.getItem('token')

  if (!token) return <Navigate to="/auth" />
  return element
}

export default PrivateRoute
