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
