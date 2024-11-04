export interface IJiraUser {
  emailAddress: string
  displayName: string
  products: string[] | null
  active: boolean
  notification: boolean
}

export interface IJiraTicket {
  fields: {
    project: {
      key: string
    }
    summary: string
    description?: string
    issuetype: {
      name: string
    }
    priority: {
      name: string
    }
    duedate: string
    customfield_10041?: string
    customfield_10048: string
    reporter: {
      accountId: string
      emailAddress: string
    }
  }
}

export interface IUserTicket {
  id: string
  fields: {
    reporter: { accountId: string; displayName: string }
    duedate: string
    priority: { name: string }
    status: { name: string }
    summary: string
    customfield_10048: string
    customfield_10041?: string
  }
}

export interface IUserTickets {
  issues: IUserTicket[]
}
