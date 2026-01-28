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
}

export interface GitHubMetadata {
  accessToken: string  // Encrypted
  tokenType: string
  scope: string
  connectedAt: string
  login: string
  id: number
  avatarUrl: string
  name: string
}

// Extend Clerk User types
declare global {
  interface UserPrivateMetadata {
    github?: GitHubMetadata
  }
}

export {}
