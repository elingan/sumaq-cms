declare module '#auth-utils' {
  interface User {
    id: string
    email: string
    name: string | null
    role: 'admin' | 'owner' | 'editor' | 'partner'
    githubData?: {
      installationId?: number
      accountType?: string
      repositorySelection?: string
      login?: string
      avatarUrl?: string
    } | null
  }

  interface UserSession {
    user: User
    loggedInAt: Date
  }
}

export { }
