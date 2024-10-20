import { Close, Send } from '@mui/icons-material'
import { Box, Dialog, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material'
import { FC, useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useAddCommentMutation } from '../../redux/services/templates'
import { useGetUserByIdQuery } from '../../redux/services/users'

interface ICommentsModal {
  open: boolean
  onClose: () => void
  templateId: number
  comments: { userId: string; username: string; email: string; comment: string }[]
}

const CommentsModal: FC<ICommentsModal> = ({ open, onClose, templateId, comments }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const [addComment] = useAddCommentMutation()
  const userId = localStorage.getItem('userID')
  const token = localStorage.getItem('token')
  const { data: user } = useGetUserByIdQuery(userId as string)

  const commentsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      const scrollToBottom = () => {
        commentsRef.current?.scrollTo({
          top: commentsRef.current.scrollHeight,
          behavior: 'smooth'
        })
      }
      setTimeout(scrollToBottom, 0)
    }
  }, [open, comments])

  const onSubmit = async (data) => {
    const commentData = {
      userId,
      username: user?.username,
      email: user?.email,
      comment: data.comment
    }

    try {
      await addComment({
        id: templateId,
        comments: [...comments, commentData]
      }).unwrap()
      reset()
    } catch (err) {
      console.error('Failed to add comment:', err)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box className="flex justify-between">
        <DialogTitle>Comments</DialogTitle>
        <IconButton onClick={onClose} color="primary">
          <Close />
        </IconButton>
      </Box>

      <DialogContent ref={commentsRef} className="max-h-72 overflow-auto">
        {comments.map((comment, index) => (
          <Box key={index}>
            <Typography variant="subtitle2">{comment.username}</Typography>
            <Typography variant="subtitle2">{comment.email}</Typography>
            <Typography>{comment.comment}</Typography>
          </Box>
        ))}
      </DialogContent>

      {token && (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-3 p-4">
          <Controller
            name="comment"
            control={control}
            defaultValue=""
            rules={{ required: 'Comment is required' }}
            render={({ field }) => <TextField label="Add a comment" size="small" fullWidth {...field} error={!!errors.comment} helperText={errors.comment?.message as string} />}
          />
          <IconButton type="submit" color="primary">
            <Send />
          </IconButton>
        </Box>
      )}
    </Dialog>
  )
}

export default CommentsModal
