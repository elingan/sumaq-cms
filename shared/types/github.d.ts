export interface GitHubUser {
  id: number
  login: string
  name: string
  email: string
  avatar_url: string
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  private: boolean
  html_url: string
  description: string | null
  updated_at: string
  language: string | null
  stargazers_count: number
}

export interface GitHubConnectionStatus {
  connected: boolean
  login: string | null
  avatarUrl: string | null
  connectedAt: string | null
  accountType: string | null
  repositorySelection: string | null
}

export interface GitHubMetadata {
  installationId: number
  accountLogin: string
  accountType: 'User' | 'Organization'
  avatarUrl: string
  repositorySelection: 'all' | 'selected'
  permissions: Record<string, string>
  connectedAt: string
}

// Extend Clerk User types
declare global {
  interface UserPrivateMetadata {
    github?: GitHubMetadata
  }
}

export {}
