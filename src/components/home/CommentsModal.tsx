import { Close, PersonPin, Send } from '@mui/icons-material'
import { Box, Dialog, DialogContent, DialogTitle, Divider, IconButton, TextField, Typography } from '@mui/material'
import { FC, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateCommentMutation } from '../../redux/services/templates'
import { useGetUserByIdQuery } from '../../redux/services/users'
import { IComment } from '../../types/templates.types'

interface ICommentsModal {
  open: boolean
  onClose: () => void
  templateId: number
  comments: IComment[]
}

const CommentsModal: FC<ICommentsModal> = ({ open, onClose, templateId, comments }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<{ comment: string }>()

  const userId = localStorage.getItem('userID')
  const token = localStorage.getItem('token')
  const commentsRef = useRef<HTMLDivElement>(null)

  const { data: user } = useGetUserByIdQuery(userId || '')
  const [createComment] = useCreateCommentMutation()

  const onSubmit = async (data: { comment: string }) => {
    const commentData = {
      userId,
      username: user?.username,
      email: user?.email,
      comment: data.comment
    }

    try {
      await createComment({ id: templateId, comments: [...comments, commentData] }).unwrap()
      reset()
    } catch (err) {
      console.error('Failed to add comment:', err)
    }
  }

  useEffect(() => {
    if (open) setTimeout(() => commentsRef.current?.scrollTo({ top: commentsRef.current.scrollHeight, behavior: 'smooth' }), 0)
  }, [open, comments])

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box className="flex justify-between">
        <DialogTitle color="primary">Comments</DialogTitle>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent ref={commentsRef} className="max-h-72 space-y-3 overflow-auto">
        {comments.length ? (
          comments.map((comment, index) => (
            <Box key={index} className="space-y-3">
              <Box className="flex items-center gap-3">
                <PersonPin fontSize="large" color="disabled" />
                <Box>
                  <Typography>{comment.username}</Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    {comment.email}
                  </Typography>
                </Box>
              </Box>
              <Typography sx={{ marginLeft: 6 }}>{comment.comment}</Typography>
              <Divider />
            </Box>
          ))
        ) : (
          <Typography sx={{ textAlign: 'center' }} color="textSecondary">
            No comments...
          </Typography>
        )}
      </DialogContent>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-3 p-4">
        <TextField label="Message..." size="small" fullWidth {...register('comment', { required: 'Comment is required' })} error={!!errors.comment} disabled={!token} />
        <IconButton type="submit" color="primary" disabled={!token}>
          <Send />
        </IconButton>
      </Box>
    </Dialog>
  )
}

export default CommentsModal
