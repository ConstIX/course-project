export interface ISalesforceUser {
  recentItems?: {
    Id: string
    Name: string
    attributes: Record<string, string>
  }[]
}
