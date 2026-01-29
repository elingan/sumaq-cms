import { clerkClient } from '@clerk/nuxt/server'
import { getGitHubApp } from '../../utils/encryption'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code as string
  const installationId = query.installation_id as string
  const setupAction = query.setup_action as string
  const state = query.state as string

  // 1. Validar state (CSRF protection)
  const savedState = getCookie(event, 'github_install_state')
  const savedUserId = getCookie(event, 'github_install_user')

  if (!savedState || savedState !== state) {
    throw createError({ statusCode: 400, statusMessage: `Invalid state parameter. Expected: ${savedState}, Got: ${state}` })
  }

  if (!savedUserId) {
    throw createError({ statusCode: 400, statusMessage: 'Session expired' })
  }

  // Limpiar cookies
  deleteCookie(event, 'github_install_state')
  deleteCookie(event, 'github_install_user')

  // 2. Manejar flujo de instalación (cuando viene installation_id directamente)
  if (installationId && (setupAction === 'install' || setupAction === 'update')) {
    const app = getGitHubApp()
    const octokit = await app.getInstallationOctokit(parseInt(installationId))

    // Obtener info del usuario autenticado
    const { data: githubUser } = await octokit.request('GET /user')

    // Obtener info de la instalación
    const { data: installation } = await octokit.request('GET /app/installations/{installation_id}', {
      installation_id: parseInt(installationId),
    })

    // Guardar en Clerk
    await clerkClient(event).users.updateUserMetadata(savedUserId, {
      privateMetadata: {
        github: {
          installationId: parseInt(installationId),
          accountLogin: installation.account.login,
          accountId: installation.account.id,
          accountType: installation.account.type as 'User' | 'Organization',
          avatarUrl: installation.account.avatar_url,
          connectedAt: new Date().toISOString(),
          permissions: installation.permissions,
          repositorySelection: installation.repository_selection,
        },
      },
    })

    return sendRedirect(event, '/admin/settings?github=connected')
  }

  // 3. Manejar flujo OAuth (cuando viene code)
  if (code) {
    const app = getGitHubApp()

    const { authentication } = await app.oauth.createToken({
      code,
    })

    const userOctokit = await app.oauth.getUserOctokit({ token: authentication.token })
    const { data: githubUser } = await userOctokit.request('GET /user')
    const { data: installations } = await userOctokit.request('GET /user/installations')

    const ourAppId = parseInt(process.env.GITHUB_APP_ID!)
    const installation = installations.installations.find(
      (inst: any) => inst.app_id === ourAppId
    )

    if (!installation) {
      throw createError({
        statusCode: 404,
        statusMessage: 'GitHub App not installed. Please install the app first.'
      })
    }

    await clerkClient(event).users.updateUserMetadata(savedUserId, {
      privateMetadata: {
        github: {
          installationId: installation.id,
          accountLogin: installation.account.login,
          accountId: installation.account.id,
          accountType: installation.account.type as 'User' | 'Organization',
          avatarUrl: installation.account.avatar_url,
          connectedAt: new Date().toISOString(),
          permissions: installation.permissions,
          repositorySelection: installation.repository_selection,
        },
      },
    })

    return sendRedirect(event, '/admin/settings?github=connected')
  }

  return sendRedirect(event, '/admin/settings?github=cancelled')
})
