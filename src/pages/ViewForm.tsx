import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { useGetTemplateByIdQuery } from '../redux/services/templates'

const ViewForm: FC = () => {
  const { id } = useParams()
  const { data: template } = useGetTemplateByIdQuery(id as string)
  console.log(template)

  return <div>ViewForm</div>
}

export default ViewForm
