import { Box, List, ListItem, ListItemText, Typography } from '@mui/material'
import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { useGetTemplateByIdQuery } from '../redux/services/templates'

const ViewTemplate: FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data: template, isLoading, error } = useGetTemplateByIdQuery(id!)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error || !template) {
    return <div>Error loading template</div>
  }

  return (
    <Box className="mx-auto mt-32 w-full max-w-5xl px-3 md3:mt-24">
      <Typography variant="h4" color="primary" gutterBottom>
        {template.title}
      </Typography>

      <Typography variant="body1" color="textSecondary" gutterBottom>
        {template.description}
      </Typography>

      <Typography variant="h5" color="primary" gutterBottom>
        Questions
      </Typography>

      <List>
        {template.questions.map((question, index) => (
          <ListItem key={index} className="border-b">
            <ListItemText
              primary={`${question.label}`}
              secondary={
                <>
                  <Typography variant="body2">
                    {question.description ? `Description: ${question.description}` : 'No description'}
                  </Typography>
                  {(question.type === 'select' || question.type === 'checkbox') && (
                    <Typography variant="body2">Options: {question.options && question.options.join(', ')}</Typography>
                  )}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default ViewTemplate
