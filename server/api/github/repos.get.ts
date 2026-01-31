import { getGitHubApp } from '../../utils/encryption'

export default defineEventHandler(async (event) => {
  // 1. Verificar autenticación y rol
  const session = await requireUserSession(event)

  if (session.user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Only admins can access repos' })
  }

  // 2. Obtener datos de instalación
  const githubData = session.user.githubData
  if (!githubData?.installationId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'GitHub App not installed'
    })
  }

  // 3. Obtener Octokit con installation token
  const app = getGitHubApp()
  const octokit = await app.getInstallationOctokit(githubData.installationId)

  // 4. Obtener repositorios de la instalación
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const perPage = parseInt(query.per_page as string) || 30

  const { data: { repositories } } = await octokit.request('GET /installation/repositories', {
    per_page: perPage,
    page,
  })

  // 5. Retornar datos formateados
  return {
    repos: repositories.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      private: repo.private,
      url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      updatedAt: repo.updated_at,
    })),
    pagination: {
      page,
      perPage,
      total: repositories.length,
    },
    github: {
      login: githubData.accountLogin,
      avatarUrl: githubData.avatarUrl,
      repositorySelection: githubData.repositorySelection,
    },
  }
})
