export interface Result {
  id: number
  templateId: number
  authorId: number
  userId: string
  userData: { name: string; email: string }
  templateTitle: string
  answers: {
    [questionId: string]: any
  }
}
