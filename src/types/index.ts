// src/types/index.ts

export type QuestionType = 'text' | 'number' | 'select' | 'checkbox'

export interface Question {
  id: string
  type: QuestionType
  label: string
  description?: string
  options?: string
}

export interface Template {
  id: string
  authorId: number
  title: string
  description?: string
  questions: Question[]
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
