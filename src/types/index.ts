// src/types/index.ts

export type QuestionType = 'text' | 'number'

export interface Question {
  id: string
  type: QuestionType
  label: string
  description?: string
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
