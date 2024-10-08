import { Comment, ThumbUp } from '@mui/icons-material'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { FC } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useDeleteTemplateMutation } from '../../redux/services/templates'
import { useGetUserByIdQuery } from '../../redux/services/users'

interface ITemplateCard {
  id: string
  authorId: number
  title: string
  description?: string
}

const TemplateCard: FC<ITemplateCard> = ({ id, authorId, title, description }) => {
  const [deleteTemplate] = useDeleteTemplateMutation()
  const { data: user } = useGetUserByIdQuery(localStorage.getItem('userID') as string)
  const isMobile = useMediaQuery({ maxWidth: 450 })
  const token = localStorage.getItem('token')
  const author = localStorage.getItem('userID') === String(authorId)
  const admin = user && user.status === 'admin'

  const handleDelete = async (id: string) => {
    try {
      await deleteTemplate(id).unwrap()
    } catch (err) {
      console.error('Failed to delete template:', err)
    }
  }

  return (
    <Box className="rounded p-4 shadow-md">
      <Typography variant="h6">{title}</Typography>
      <Typography color="textSecondary">{description}</Typography>

      <Box className="mt-5 flex gap-3">
        <Button href={`/view-form/${id}`} variant="outlined" color="secondary" fullWidth={isMobile}>
          View Form
        </Button>
        {token && (
          <>
            <Button href={`/fill-form/${id}`} variant="outlined" color="primary" fullWidth={isMobile}>
              Fill Form
            </Button>
            <Button href={`/view-results/${id}`} variant="outlined" color="success" fullWidth={isMobile}>
              View Results
            </Button>
            {(admin || author) && (
              <>
                <Button href={`/edit-template/${id}`}>Edit</Button>
                <Button onClick={() => handleDelete(id)}>Delete</Button>
              </>
            )}
          </>
        )}
      </Box>

      {token && (
        <Box className="mt-5 flex gap-3">
          <IconButton color="primary" size="small">
            <Comment fontSize="small" />
          </IconButton>
          <IconButton color="primary" size="small">
            <ThumbUp fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  )
}

export default TemplateCard
