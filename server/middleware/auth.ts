import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  // Skip token validation for the login endpoints or public routes
  // console.log('server-auth-middleware > request:', getRequestURL(event).pathname)
  const path = event.path || event.node.req.url || ''

  const unprotectedPaths = [
    '/login',
    '/register',
    '/password/',
    '/api/auth/login',
    '/api/_auth',
    '/public/',
    '/favicon',
    '/_i18n',
    '/_ipx',
    '/_nuxt',
    '/__nuxt',
    '/_fonts'
  ]

  if (unprotectedPaths.some(unprotectedPath => path.includes(unprotectedPath))) {
    return
  }

  // const session = await requireUserSession(event)
  // event.context.session = session
  console.log('server-auth-middleware >', event.node.req.method, path, ':')
})
