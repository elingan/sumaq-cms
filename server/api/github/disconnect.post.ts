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

  // Remover datos de GitHub
  await clerkClient(event).users.updateUserMetadata(userId, {
    privateMetadata: {
      github: null,
    },
  })

  return { success: true, message: 'GitHub disconnected' }
})
