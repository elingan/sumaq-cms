import { clerkClient } from '@clerk/nuxt/server'

export default defineEventHandler(async (event) => {
  // 1. Verificar autenticación
  const { userId } = event.context.auth()
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // 2. Verificar rol admin
  const user = await clerkClient(event).users.getUser(userId)
  if (user.publicMetadata.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Only admins can connect GitHub' })
  }

  // 3. Generar state y PKCE
  const state = generateOAuthState()
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = generateCodeChallenge(codeVerifier)

  // 4. Guardar en cookies seguras
  setCookie(event, 'github_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutos
  })

  setCookie(event, 'github_code_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
  })

  // 5. Construir URL de GitHub
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: process.env.GITHUB_REDIRECT_URI!,
    scope: 'repo,user:email,read:user',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })

  const githubAuthUrl = `https://github.com/login/oauth/authorize?${params}`

  // Redirigir
  return sendRedirect(event, githubAuthUrl)
})
