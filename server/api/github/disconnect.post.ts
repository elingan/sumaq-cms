import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  if (session.user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const githubData = session.user.githubData

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

  // Remover datos de GitHub de la base de datos
  const db = useDrizzle()
  await db
    .update(tables.users)
    .set({ githubData: null })
    .where(eq(tables.users.id, session.user.id))

  return { success: true, message: 'GitHub App disconnected' }
})
