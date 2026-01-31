import { z } from 'zod'
import { eq } from 'drizzle-orm'

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  name: z.string().optional(),
  role: z.enum(['admin', 'owner', 'editor']).optional()
})

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  // Only admins can update users
  if (session.user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      message: 'Forbidden'
    })
  }

  const userId = event.context.params!.id
  const body = await readBody(event)
  const data = updateUserSchema.parse(body)

  const db = useDrizzle()

  const updates: any = {}

  if (data.email) updates.email = data.email
  if (data.name !== undefined) updates.name = data.name
  if (data.role) updates.role = data.role
  if (data.password) {
    updates.password = await hashPassword(data.password)
  }

  updates.updatedAt = new Date()

  // Update user
  const [updatedUser] = await db
    .update(tables.users)
    .set(updates)
    .where(eq(tables.users.id, userId))
    .returning({
      id: tables.users.id,
      email: tables.users.email,
      name: tables.users.name,
      role: tables.users.role
    })

  if (!updatedUser) {
    throw createError({
      statusCode: 404,
      message: 'User not found'
    })
  }

  // Create audit log
  await createAuditLog(
    session.user.id,
    'user_updated',
    { userId: updatedUser.id, changes: Object.keys(updates) },
    event
  )

  return updatedUser
})
