import { z } from 'zod'
import { eq } from 'drizzle-orm'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = loginSchema.parse(body)

  const db = useDrizzle()

  // Find user by email
  const [user] = await db
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .limit(1)

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, user.password)
  if (!isValidPassword) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })
  }

  // Create session
  await setUserSession(event, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      githubData: user.githubData as any
    },
    loggedInAt: new Date()
  })

  // Create audit log
  await createAuditLog(user.id, 'login', { email }, event)

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  }
})
