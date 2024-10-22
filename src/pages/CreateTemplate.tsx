import { Box, Button, Typography } from '@mui/material'
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
      questions: [{ type: 'text', label: '', description: '', options: '' }],
      tags: [],
      access: 'public',
      selectedUsers: []
    }
  })

  const userId = localStorage.getItem('userID')
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
      questions: data.questions.map((obj, index) => {
        const existingQuestion = templateData?.questions[index]
        return {
          id: existingQuestion ? existingQuestion.id : uuidv4(),
          type: obj.type,
          label: obj.label,
          description: obj.description,
          options: Array.isArray(obj.options) ? obj.options : obj.options.split(',').map((i) => i.trim())
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
    if (templateData) {
      methods.reset({
        title: templateData.title,
        description: templateData.description,
        theme: templateData.theme,
        customTheme: templateData.customTheme,
        questions: templateData.questions,
        tags: templateData.tags,
        access: templateData.access,
        selectedUsers: templateData.selectedUsers
      })
    }
  }, [templateData, methods])

  return (
    <FormProvider {...methods}>
      <Box className="custom-container">
        <Typography variant="h4" color="primary">
          {templateData ? 'Editing' : 'Creating'} a form template
        </Typography>

        <Box component="form" onSubmit={methods.handleSubmit(submitHandler)} className="mt-4">
          <GeneralSettings />
          <AccessSettings />
          <QuestionSettings />

          <Box className="flex justify-end gap-3">
            <Button variant="outlined" onClick={() => navigate('/')} color="error">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disableElevation disabled={createLoading || updateLoading}>
              {templateData ? 'Update Template' : 'Create Template'}
            </Button>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  )
}

export default CreateTemplate
