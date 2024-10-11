import { Box, Button, Tab, Tabs, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import AccessSettings from '../components/template/AccessSettings'
import GeneralSettings from '../components/template/GeneralSettings'
import QuestionSettings from '../components/template/QuestionSettings'
import { useCreateTemplateMutation, useUpdateTemplateMutation } from '../redux/services/templates'
import { useGetUserByIdQuery } from '../redux/services/users'
import { Question, Template } from '../types'

interface FormValues {
  title: string
  description?: string
  theme: string
  customTheme?: string
  questions: {
    type: Question['type']
    label: string
    description?: string
    options: string
  }[]
  tags: string[]
  access: string | string[]
  selectedUsers?: string[]
}

const CreateTemplate: FC<{ templateData?: Template }> = ({ templateData }) => {
  const methods = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      theme: 'quiz',
      customTheme: '',
      questions: [],
      tags: [],
      access: 'public',
      selectedUsers: []
    }
  })

  const userId = localStorage.getItem('userID')
  const { data: user } = useGetUserByIdQuery(userId as string)
  const [createTemplate, { isLoading }] = useCreateTemplateMutation()
  const [updateTemplate] = useUpdateTemplateMutation()
  const navigate = useNavigate()

  const [tabIndex, setTabIndex] = useState(0)

  const submitHandler = async (data: FormValues) => {
    const template: Partial<Template> = {
      authorId: user.id,
      title: data.title,
      description: data.description,
      theme: data.theme,
      customTheme: data.theme === 'other' ? data.customTheme : '',
      questions: data.questions.map((obj) => ({
        id: uuidv4(),
        type: obj.type,
        label: obj.label,
        description: obj.description,
        options: Array.isArray(obj.options) ? obj.options : obj.options.split(',').map((opt) => opt.trim())
      })),
      tags: data.tags,
      access: data.access,
      selectedUsers: data.access === 'private' ? data.selectedUsers : [],
      likedBy: [],
      comments: []
    }

    try {
      if (templateData) {
        await updateTemplate({ id: templateData.id, ...template }).unwrap()
      } else {
        await createTemplate(template).unwrap()
      }
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
      <Box className="mx-auto mt-32 w-full max-w-7xl px-3 md3:mt-24">
        <Typography variant="h4" color="primary">
          {templateData ? 'Editing' : 'Creating'} a form template
        </Typography>

        <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} className="mt-4">
          <Tab label="General" />
          <Tab label="Questions" />
          <Tab label="Tags & Access" />
        </Tabs>

        <form onSubmit={methods.handleSubmit(submitHandler)} className="mt-4">
          {tabIndex === 0 && <GeneralSettings />}
          {tabIndex === 1 && <QuestionSettings />}
          {tabIndex === 2 && <AccessSettings />}

          <Box className="mt-4 flex justify-end gap-3">
            <Button variant="outlined" onClick={() => navigate('/')} disableElevation>
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit" disableElevation disabled={isLoading}>
              {templateData ? 'Update Template' : 'Create Template'}
            </Button>
          </Box>
        </form>
      </Box>
    </FormProvider>
  )
}

export default CreateTemplate
