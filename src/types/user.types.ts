export interface IUser {
  username: string
  email: string
  password: string
  registrationDate: string
  loginDate: string
  role: string
  status: string
  id: number
}

export interface ISalesforceUser {
  recentItems?: {
    Id: string
    Name: string
    attributes: Record<string, string>
  }[]
}
