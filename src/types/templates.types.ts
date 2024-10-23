export interface IQuestion {
  id: string
  type: 'text' | 'number' | 'select' | 'checkbox' | 'radio' | 'tags'
  label: string
  description?: string
  options: string | string[]
}

export interface IComment {
  userId: string | null
  username: string | undefined
  email: string | undefined
  comment: string
}

export interface ITemplate {
  id: number
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
  date: string
  likedBy: string[]
  filledBy: string[]
  comments: IComment[]
}
