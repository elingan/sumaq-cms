import { clerkClient } from '@clerk/nuxt/server'

export default defineEventHandler(async (event) => {
  const { userId } = event.context.auth()

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // Verificar si el usuario es admin
  const user = await clerkClient(event).users.getUser(userId)
  const role = user.publicMetadata.role as string | undefined

  if (role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  // Obtener lista de usuarios
  const usersResponse = await clerkClient(event).users.getUserList({
    limit: 100,
    orderBy: '-created_at'
  })

  // Normalizar respuesta
  const users = Array.isArray(usersResponse) ? usersResponse : usersResponse.data

  return users
})
