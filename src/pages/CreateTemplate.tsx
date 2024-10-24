import { Box, Button, Typography, useMediaQuery } from '@mui/material'
import moment from 'moment'
import { FC, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import AccessSettings from '../components/create-template/AccessSettings'
import GeneralSettings from '../components/create-template/GeneralSettings'
import QuestionSettings from '../components/create-template/QuestionSettings'
import { useCreateTemplateMutation, useUpdateTemplateMutation } from '../redux/services/templates'
import { useGetUserByIdQuery } from '../redux/services/users'
import { ITemplate } from '../types/templates.types'

const CreateTemplate: FC<{ templateData?: ITemplate }> = ({ templateData }) => {
  const methods = useForm<ITemplate>({
    defaultValues: {
      title: '',
      description: '',
      theme: 'quiz',
      customTheme: '',
      questions: [{ id: uuidv4(), type: 'text', label: '', description: '', options: '', required: false }],
      tags: [],
      access: 'public',
      selectedUsers: []
    }
  })

  const userId = localStorage.getItem('userID')
  const isMobile = useMediaQuery('(max-width: 600px)')
  const navigate = useNavigate()

  const { data: user } = useGetUserByIdQuery(userId!)
  const [createTemplate, { isLoading: createLoading }] = useCreateTemplateMutation()
  const [updateTemplate, { isLoading: updateLoading }] = useUpdateTemplateMutation()

  const submitHandler = async (data: ITemplate) => {
    const template = {
      authorId: user!.id,
      author: {
        name: user!.username,
        email: user!.email
      },
      title: data.title,
      description: data.description,
      theme: data.theme,
      customTheme: data.theme === 'other' ? data.customTheme : '',
      questions: data.questions.map((obj) => {
        return {
          id: obj.id,
          type: obj.type,
          label: obj.label,
          description: obj.description,
          options: Array.isArray(obj.options) ? obj.options : obj.options.split(',').map((i) => i.trim()),
          required: obj.required
        }
      }),
      tags: data.tags,
      access: data.access,
      selectedUsers: data.access === 'private' ? data.selectedUsers : [],
      date: moment().format('DD/MM/YYYY HH:mm'),
      likedBy: templateData ? templateData.likedBy : [],
      filledBy: templateData ? templateData.filledBy : [],
      comments: templateData ? templateData.comments : []
    }

    try {
      if (templateData) await updateTemplate({ id: templateData.id, ...template }).unwrap()
      else await createTemplate(template).unwrap()

      navigate('/')
    } catch (error) {
      console.error('Failed to save template:', error)
    }
  }

  useEffect(() => {
    if (templateData) methods.reset(templateData)
  }, [templateData, methods])

  return (
    <FormProvider {...methods}>
      <Box className="custom-container">
        <Typography variant="h4" color="primary" sx={{ marginBottom: '40px' }}>
          {templateData ? 'Editing' : 'Creating'} template
        </Typography>

        <Box component="form" onSubmit={methods.handleSubmit(submitHandler)} className="mt-4">
          <GeneralSettings />
          <AccessSettings />
          <QuestionSettings />

          <Box className="mt-10 flex justify-end gap-3">
            <Button variant="outlined" onClick={() => navigate('/')} color="error" fullWidth={isMobile}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disableElevation disabled={createLoading || updateLoading} fullWidth={isMobile}>
              {templateData ? 'Update Template' : 'Create Template'}
            </Button>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  )
}

export default CreateTemplate
