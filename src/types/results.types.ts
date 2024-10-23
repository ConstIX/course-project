export interface ICurrentResults {
  id: number
  userData: { name: string; email: string }
  [key: string]: string | number | { name: string; email: string }
}

export interface IResult {
  id?: number
  templateId: number
  authorId: number
  userId: string | null
  userData: { name: string; email: string }
  templateTitle: string
  answers: {
    [questionId: string]: any
  }
}
