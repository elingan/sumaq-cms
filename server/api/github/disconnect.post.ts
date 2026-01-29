import { clerkClient } from '@clerk/nuxt/server'

export default defineEventHandler(async (event) => {
  const { userId } = event.context.auth()
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const user = await clerkClient(event).users.getUser(userId)
  if (user.publicMetadata.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const githubData = user.privateMetadata.github as any

  // Opcional: Desinstalar la app de GitHub (requiere permisos adicionales)
  // if (githubData?.installationId) {
  //   try {
  //     const app = getGitHubApp()
  //     const octokit = await app.getInstallationOctokit(githubData.installationId)
  //     await octokit.rest.apps.deleteInstallation({
  //       installation_id: githubData.installationId,
  //     })
  //   } catch (error) {
  //     console.error('Error uninstalling GitHub App:', error)
  //   }
  // }

  // Remover datos de GitHub de Clerk
  await clerkClient(event).users.updateUserMetadata(userId, {
    privateMetadata: {
      github: null,
    },
  })

  return { success: true, message: 'GitHub App disconnected' }
})
