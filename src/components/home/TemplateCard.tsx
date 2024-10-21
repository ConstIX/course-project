import { Comment, ThumbUp } from '@mui/icons-material'
import { Box, Button, IconButton, Paper, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeleteTemplate } from '../../hooks/useDeleteTemplate'
import { useIsAdminOrAuthor } from '../../hooks/useIsAdminOrAuthor'
import { useLikeMutation } from '../../redux/services/templates'
import { IComment } from '../../types/templates.types'
import CommentsModal from './CommentsModal'

interface ITemplateCard {
  id: number
  authorId: number
  title: string
  description?: string
  likedBy: string[]
  comments: IComment[]
  setSnackbarState: (obj: { message: string; open: boolean; severity: 'success' | 'error' }) => void
}

const TemplateCard: FC<ITemplateCard> = ({ id, authorId, title, description, likedBy, comments, setSnackbarState }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const userId = localStorage.getItem('userID')
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const [like] = useLikeMutation()
  const [deleteTemplateWithResults] = useDeleteTemplate()
  const [isAdminOrAuthor] = useIsAdminOrAuthor(authorId)

  const handleLikeTemplate = async () => {
    if (userId && likedBy.includes(userId)) return

    try {
      if (userId) await like({ id, likedBy: [...likedBy, userId] }).unwrap()
    } catch (err) {
      console.error('Failed to like template:', err)
    }
  }

  const handleDeleteTemplate = async (id: number) => {
    try {
      await deleteTemplateWithResults(id)
      setSnackbarState({ message: 'Template deleted successfuly.', open: true, severity: 'success' })
    } catch (err) {
      setSnackbarState({ message: 'Something went wrong.', open: true, severity: 'error' })
      console.error('Failed to delete template:', err)
    }
  }

  return (
    <Paper className="p-5">
      <Typography variant="h6" color="textPrimary">
        {title}
      </Typography>
      <Typography color="textSecondary">{description}</Typography>

      <Box className="mt-5 flex gap-3">
        <Button onClick={() => navigate(`/view-form/${id}`)} variant="outlined" color="secondary">
          View Form
        </Button>
        {token && (
          <>
            <Button onClick={() => navigate(`/fill-form/${id}`)} variant="outlined" color="primary">
              Fill Form
            </Button>
            <Button onClick={() => navigate(`/view-results/${id}`)} variant="outlined" color="success">
              View Results
            </Button>
            {isAdminOrAuthor && (
              <>
                <Button onClick={() => navigate(`/edit-template/${id}`)}>Edit</Button>
                <Button onClick={() => handleDeleteTemplate(id)}>Delete</Button>
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
          <IconButton onClick={handleLikeTemplate} color="primary" size="small" disabled={!token}>
            <ThumbUp fontSize="small" />
          </IconButton>
          <Typography color="textSecondary">{likedBy.length}</Typography>
        </Box>
      </Box>

      <CommentsModal open={modalOpen} onClose={() => setModalOpen(false)} templateId={id} comments={comments} />
    </Paper>
  )
}

export default TemplateCard
