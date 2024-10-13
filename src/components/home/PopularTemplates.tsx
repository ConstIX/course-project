import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetTemplatesQuery } from '../../redux/services/templates'

const PopularTemplates: FC = () => {
  const { data: templates } = useGetTemplatesQuery()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const popularTemplates =
    (templates && [...templates].sort((a, b) => b.filledBy?.length - a.filledBy?.length).slice(0, 5)) || []

  return (
    <Box className="mb-10">
      <Typography color="primary" variant="h4">
        Popular Templates
      </Typography>

      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              {token && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {popularTemplates.map((template) => (
              <TableRow
                key={template.id}
                onClick={() => navigate(`/view-form/${template.id}`)}
                style={{ cursor: 'pointer' }}>
                <TableCell>{template.id}</TableCell>
                <TableCell>{template.title}</TableCell>
                <TableCell>{template.author.name}</TableCell>
                {token && (
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/fill-form/${template.id}`)
                      }}
                      disableElevation>
                      Fill Form
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default PopularTemplates
