// src/types/index.ts

export type QuestionType = 'text' | 'number' | 'select' | 'checkbox' | 'radio' | 'tags'

export interface Question {
  id: string
  type: QuestionType
  label: string
  description?: string
  options: string | string[]
}

export interface Template {
  id: string
  authorId: number
  title: string
  description?: string
  theme: string
  customTheme?: string
  questions: Question[]
  tags: string[]
  access: string | string[]
  selectedUsers?: string[]
  likedBy: string[]
  comments: { userId: string; username: string; email: string; comment: string }[]
}

export interface Response {
  id: string
  templateId: string
  authorId: string
  userId: string
  templateTitle: string
  answers: {
    [questionId: string]: any
  }
}
