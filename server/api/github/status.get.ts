import { clerkClient } from '@clerk/nuxt/server'
import type { GitHubConnectionStatus } from '~/types/github'

export default defineEventHandler(async (event): Promise<GitHubConnectionStatus> => {
  const { userId } = event.context.auth()
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const user = await clerkClient(event).users.getUser(userId)
  const githubData = user.privateMetadata.github as any

  return {
    connected: !!githubData?.accessToken,
    login: githubData?.login || null,
    avatarUrl: githubData?.avatarUrl || null,
    connectedAt: githubData?.connectedAt || null,
  }
})
