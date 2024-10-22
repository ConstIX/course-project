import { Comment, Delete, Edit, ThumbUp } from '@mui/icons-material'
import { Box, Button, Card, CardActions, CardContent, CardHeader, IconButton, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeleteTemplate } from '../../hooks/useDeleteTemplate'
import { useIsAdminOrAuthor } from '../../hooks/useIsAdminOrAuthor'
import { useLikeMutation } from '../../redux/services/templates'
import { ITemplate } from '../../types/templates.types'
import DropdownMenu from '../Menu'
import CommentsModal from './CommentsModal'

interface ITemplateCard extends ITemplate {
  setSnackbarState: (obj: { message: string; open: boolean; severity: 'success' | 'error' }) => void
}

const TemplateCard: FC<ITemplateCard> = ({ id, authorId, title, description, date, access, likedBy, comments, setSnackbarState }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const userId = localStorage.getItem('userID')
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const [like] = useLikeMutation()
  const [deleteTemplateWithResults] = useDeleteTemplate()
  const [isAdminOrAuthor] = useIsAdminOrAuthor(authorId)

  const handleLikeTemplate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
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

  const handleAction = (e: React.MouseEvent<HTMLButtonElement>, actionType: 'navigate' | 'openModal', path?: string) => {
    e.stopPropagation()
    if (actionType === 'navigate' && path && token) navigate(path)
    else if (actionType === 'openModal') setModalOpen(true)
    else setSnackbarState({ message: 'You are not authorized!', open: true, severity: 'error' })
  }

  const actions = [
    { label: 'Edit', icon: <Edit color="primary" fontSize="small" />, function: () => navigate(`/edit-template/${id}`) },
    { label: 'Delete', icon: <Delete color="error" fontSize="small" />, function: () => handleDeleteTemplate(id) }
  ]

  return (
    <Card
      onClick={() => navigate(`view-form/${id}`)}
      sx={{ display: 'flex', height: '100%', cursor: 'pointer', flexDirection: 'column', transition: 'all 0.3s ease 0s', '&:hover': { transform: 'translateY(-0.5rem)' } }}>
      <CardHeader title={title} action={isAdminOrAuthor ? <DropdownMenu actions={actions} isHeader={false} /> : null} sx={{ paddingBottom: 0 }} />

      <CardContent sx={{ flexGrow: 1, paddingTop: 0 }}>
        <Box className="mb-10 flex justify-between">
          <Typography variant="subtitle2" color="textSecondary">
            Last update: {date.slice(0, 10)}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {access}
          </Typography>
        </Box>
        <Typography color="textSecondary">{description}</Typography>
      </CardContent>

      <CardActions>
        <Button onClick={(e) => handleAction(e, 'navigate', `/fill-form/${id}`)} variant="outlined" color="primary" fullWidth>
          Fill Form
        </Button>
        <Button onClick={(e) => handleAction(e, 'navigate', `/view-results/${id}`)} variant="outlined" color="success" fullWidth>
          View Results
        </Button>
      </CardActions>

      <CardActions className="flex gap-3">
        <Box className="flex items-center gap-1">
          <IconButton color="primary" size="small" onClick={(e) => handleAction(e, 'openModal')}>
            <Comment fontSize="small" />
          </IconButton>
          <Typography color="textSecondary">{comments.length}</Typography>
        </Box>
        <Box className="flex items-center gap-1">
          <IconButton onClick={(e) => handleLikeTemplate(e)} color="primary" size="small" disabled={!token}>
            <ThumbUp fontSize="small" />
          </IconButton>
          <Typography color="textSecondary">{likedBy.length}</Typography>
        </Box>
      </CardActions>

      <CommentsModal open={modalOpen} onClose={() => setModalOpen(false)} templateId={id} comments={comments} />
    </Card>
  )
}

export default TemplateCard
