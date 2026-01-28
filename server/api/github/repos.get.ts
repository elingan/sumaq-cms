import { clerkClient } from '@clerk/nuxt/server'
import type { GitHubRepo } from '~/types/github'

export default defineEventHandler(async (event) => {
  // 1. Verificar autenticación y rol
  const { userId } = event.context.auth()
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const user = await clerkClient(event).users.getUser(userId)
  if (user.publicMetadata.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Only admins can access repos' })
  }

  // 2. Obtener y descifrar token
  const githubData = user.privateMetadata.github as any
  if (!githubData?.accessToken) {
    throw createError({
      statusCode: 404,
      statusMessage: 'GitHub account not connected'
    })
  }

  const accessToken = decryptToken(githubData.accessToken)

  // 3. Llamar a GitHub API
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const perPage = parseInt(query.per_page as string) || 30
  const sort = query.sort as string || 'updated'
  const affiliation = query.affiliation as string || 'owner,collaborator'

  const repos = await $fetch<GitHubRepo[]>('https://api.github.com/user/repos', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
    query: {
      page,
      per_page: perPage,
      sort,
      affiliation,
    },
  })

  // 4. Retornar datos formateados
  return {
    repos: repos.map(repo => ({
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
    },
    github: {
      login: githubData.login,
      avatarUrl: githubData.avatarUrl,
    },
  }
})
