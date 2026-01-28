import { clerkClient } from '@clerk/nuxt/server'
import type { GitHubUser } from '~/types/github'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code as string
  const state = query.state as string

  // 1. Validar state (CSRF protection)
  const savedState = getCookie(event, 'github_oauth_state')
  const codeVerifier = getCookie(event, 'github_code_verifier')

  if (!savedState || !codeVerifier || savedState !== state) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid OAuth state' })
  }

  // Limpiar cookies
  deleteCookie(event, 'github_oauth_state')
  deleteCookie(event, 'github_code_verifier')

  // 2. Intercambiar code por access token
  const tokenResponse = await $fetch<{
    access_token: string
    token_type: string
    scope: string
  }>('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: {
      client_id: process.env.GITHUB_CLIENT_ID!,
      client_secret: process.env.GITHUB_CLIENT_SECRET!,
      code,
      redirect_uri: process.env.GITHUB_REDIRECT_URI!,
      code_verifier: codeVerifier,
    },
  })

  const accessToken = tokenResponse.access_token

  // 3. Obtener información del usuario de GitHub
  const githubUser = await $fetch<GitHubUser>('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
  })

  // 4. Guardar en Clerk privateMetadata
  const { userId } = event.context.auth()
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const encryptedToken = encryptToken(accessToken)

  await clerkClient(event).users.updateUserMetadata(userId, {
    privateMetadata: {
      github: {
        accessToken: encryptedToken,
        tokenType: tokenResponse.token_type,
        scope: tokenResponse.scope,
        connectedAt: new Date().toISOString(),
        login: githubUser.login,
        id: githubUser.id,
        avatarUrl: githubUser.avatar_url,
        name: githubUser.name,
      },
    },
  })

  // 5. Redirigir a página de configuración
  return sendRedirect(event, '/admin/settings?github=connected')
})
