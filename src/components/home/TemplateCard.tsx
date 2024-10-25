import { Comment, Delete, Edit, MoreVert, ThumbUp } from '@mui/icons-material'
import { Box, Button, Card, CardActions, CardContent, CardHeader, IconButton, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useDeleteTemplate } from '../../hooks/useDeleteTemplate'
import { useIsAdminOrAuthor } from '../../hooks/useIsAdminOrAuthor'
import { useTemplateAccess } from '../../hooks/useTemplateAccess'
import { useLikeMutation } from '../../redux/services/templates'
import { ITemplate } from '../../types/templates.types'
import DropdownMenu from '../ui/Menu'
import CommentsModal from './CommentsModal'

interface ITemplateCard extends ITemplate {
  setSnackbarState: (state: { message: string; open: boolean; severity: 'success' | 'error' }) => void
}

const TemplateCard: FC<ITemplateCard> = ({ id, authorId, title, description, theme, customTheme, date, access, selectedUsers, likedBy, comments, setSnackbarState }) => {
  const [modalOpen, setModalOpen] = useState(false)

  const userId = localStorage.getItem('userID')
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const { t } = useTranslation(['toaster', 'button', 'template'])

  const [like] = useLikeMutation()
  const [deleteTemplateWithResults] = useDeleteTemplate()
  const [isAdminOrAuthor] = useIsAdminOrAuthor(authorId)
  const [hasAccess] = useTemplateAccess(access, selectedUsers, isAdminOrAuthor)

  const handleLikeTemplate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (likedBy.includes(userId!)) return

    try {
      if (userId) await like({ id: id!, likedBy: [...likedBy, userId] }).unwrap()
    } catch (err) {
      console.error('Failed to like template:', err)
    }
  }

  const handleDeleteTemplate = async () => {
    try {
      await deleteTemplateWithResults(id!)
      setSnackbarState({ message: t('toaster.deleteTemplate'), open: true, severity: 'success' })
    } catch (err) {
      setSnackbarState({ message: t('toaster.error'), open: true, severity: 'error' })
      console.error('Failed to delete template:', err)
    }
  }

  const handleAction = (e: React.MouseEvent<HTMLButtonElement>, actionType: 'navigate' | 'openModal', path?: string) => {
    e.stopPropagation()
    if (actionType === 'navigate' && path) navigate(path)
    if (actionType === 'openModal') setModalOpen(true)
  }

  const actions = [
    { label: t('button.edit', { ns: 'button' }), icon: <Edit color="primary" fontSize="small" />, function: () => navigate(`/edit-template/${id}`) },
    { label: t('button.delete', { ns: 'button' }), icon: <Delete color="error" fontSize="small" />, function: () => handleDeleteTemplate() }
  ]

  return (
    <Card
      onClick={() => navigate(`view-form/${id}`)}
      sx={{ display: 'flex', height: '100%', cursor: 'pointer', flexDirection: 'column', transition: 'all 0.3s ease 0s', '&:hover': { transform: 'translateY(-0.5rem)' } }}>
      <CardHeader
        title={title}
        subheader={`${t('template.theme', { ns: 'template' })}: ${theme === 'other' ? customTheme?.toLocaleLowerCase() : theme}`}
        action={isAdminOrAuthor ? <DropdownMenu actions={actions} icon={<MoreVert />} /> : null}
        sx={{ paddingBottom: 1 }}
      />

      <CardContent sx={{ flexGrow: 1, paddingTop: 0 }}>
        <Box className="mb-10 flex justify-between gap-5">
          <Typography variant="subtitle2" color="textSecondary">
            {t('template.lastUpdate', { ns: 'template' })}: {date.slice(0, 10)}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {t(`template.${access}`, { ns: 'template' })}
          </Typography>
        </Box>
        <Typography color="textSecondary">{description}</Typography>
      </CardContent>

      <CardActions>
        <Button onClick={(e) => handleAction(e, 'navigate', `/fill-form/${id}`)} variant="outlined" color="primary" fullWidth disabled={!hasAccess || !token}>
          {t('button.fillForm', { ns: 'button' })}
        </Button>
        <Button onClick={(e) => handleAction(e, 'navigate', `/view-results/${id}`)} variant="outlined" color="success" fullWidth disabled={!hasAccess || !token}>
          {t('button.viewResults', { ns: 'button' })}
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

      <CommentsModal open={modalOpen} onClose={() => setModalOpen(false)} templateId={id!} comments={comments} />
    </Card>
  )
}

export default TemplateCard
