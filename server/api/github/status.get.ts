import type { GitHubConnectionStatus } from '../../../shared/types/github'

export default defineEventHandler(async (event): Promise<GitHubConnectionStatus> => {
  const session = await requireUserSession(event)
  const githubData = session.user.githubData

  return {
    connected: !!githubData?.installationId,
    login: githubData?.login || null,
    avatarUrl: githubData?.avatarUrl || null,
    connectedAt: null,
    accountType: githubData?.accountType || null,
    repositorySelection: githubData?.repositorySelection || null,
  }
})
