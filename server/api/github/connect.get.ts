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

  // 3. Generar state para CSRF protection
  const state = generateOAuthState()

  // 4. Guardar state en cookie segura
  setCookie(event, 'github_install_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutos
  })

  // Guardar también el userId para verificar en el callback
  setCookie(event, 'github_install_user', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
  })

  // 5. Construir URL de instalación de GitHub App
  // Usamos el flujo de autorización que funciona tanto para nuevas instalaciones
  // como para apps ya instaladas
  const redirectUri = `${getRequestURL(event).origin}/api/github/callback`
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: redirectUri,
    state,
  })

  // Redirigir al flujo de autorización de la GitHub App
  const installUrl = `https://github.com/login/oauth/authorize?${params}`

  return sendRedirect(event, installUrl)
})
