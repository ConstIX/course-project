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
  title: string
  description?: string
  questions: Question[]
}

export interface Response {
  id: string
  templateId: string
  answers: {
    [questionId: string]: any
  }
}
