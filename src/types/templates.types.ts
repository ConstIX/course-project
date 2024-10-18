export interface IQuestion {
  id: string
  type: 'text' | 'number' | 'select' | 'checkbox' | 'radio' | 'tags'
  label: string
  description?: string
  options: string[]
}

export interface ITemplate {
  id: string
  authorId: number
  author: { name: string; email: string }
  title: string
  description?: string
  theme: string
  customTheme?: string
  questions: IQuestion[]
  tags: string[]
  access: string
  selectedUsers?: string[]
  likedBy: string[]
  filledBy: string[]
  comments: { userId: string; username: string; email: string; comment: string }[]
}
