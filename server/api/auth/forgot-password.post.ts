import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { randomBytes } from 'crypto'
import { db, schema } from '@nuxthub/db'

const forgotPasswordSchema = z.object({
  email: z.string().email()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email } = forgotPasswordSchema.parse(body)

  // Find user by email
  const user = await db.query.users.findFirst({
    where: eq(schema.users.email, email)
  })

  // Always return success even if user not found (security best practice)
  if (!user) {
    return { success: true }
  }

  // Generate reset token
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  // Store reset token
  await db.insert(schema.passwordResets).values({
    userId: user.id,
    token,
    expiresAt
  })

  // TODO: Send email with reset link
  // For now, just log it
  const resetUrl = `${getRequestURL(event).origin}/reset-password?token=${token}`
  console.log('Password reset link:', resetUrl)

  // Create audit log
  await createAuditLog(user.id, 'password_reset_requested', { email }, event)

  return { success: true }
})
