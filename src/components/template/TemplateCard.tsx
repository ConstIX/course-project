import { Comment, ThumbUp } from '@mui/icons-material'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useDeleteTemplateMutation, useIncrementLikesMutation } from '../../redux/services/templates'
import { useGetUserByIdQuery } from '../../redux/services/users'
import CommentsModal from './CommentsModal'

interface ITemplateCard {
  id: string
  authorId: number
  title: string
  description?: string
  likedBy: string[]
  comments: { userId: string; username: string; email: string; comment: string }[]
}

const TemplateCard: FC<ITemplateCard> = ({ id, authorId, title, description, likedBy, comments }) => {
  const userId = localStorage.getItem('userID')
  const [deleteTemplate] = useDeleteTemplateMutation()
  const { data: user } = useGetUserByIdQuery(userId as string)

  const [incrementLikes] = useIncrementLikesMutation()
  const hasLiked = likedBy && likedBy.includes(userId as string)

  const isMobile = useMediaQuery({ maxWidth: 450 })
  const token = localStorage.getItem('token')
  const author = userId === String(authorId)
  const admin = user && user.status === 'admin'

  const [modalOpen, setModalOpen] = useState(false)

  const handleDelete = async (id: string) => {
    try {
      await deleteTemplate(id).unwrap()
    } catch (err) {
      console.error('Failed to delete template:', err)
    }
  }

  const handleLike = async () => {
    if (hasLiked) return

    try {
      await incrementLikes({ id, userId, likedBy: [...likedBy, userId] }).unwrap()
    } catch (err) {
      console.error('Failed to like template:', err)
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

      <Box className="mt-5 flex gap-3">
        <Box className="flex items-center gap-1">
          <IconButton color="primary" size="small" onClick={() => setModalOpen(true)}>
            <Comment fontSize="small" />
          </IconButton>
          <Typography color="textSecondary">{comments.length}</Typography>
        </Box>
        <Box className="flex items-center gap-1">
          <IconButton onClick={handleLike} color="primary" size="small" disabled={!token}>
            <ThumbUp fontSize="small" />
          </IconButton>
          <Typography color="textSecondary">{likedBy.length}</Typography>
        </Box>
      </Box>

      <CommentsModal open={modalOpen} onClose={() => setModalOpen(false)} templateId={id} comments={comments} />
    </Box>
  )
}

export default TemplateCard
