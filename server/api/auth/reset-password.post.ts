import { z } from 'zod'
import { eq, and, gt } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6)
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { token, password } = resetPasswordSchema.parse(body)

  // Find valid reset token
  const resetRecord = await db.query.passwordResets.findFirst({
    where: and(
      eq(schema.passwordResets.token, token),
      gt(schema.passwordResets.expiresAt, new Date())
    )
  })

  if (!resetRecord) {
    throw createError({
      statusCode: 400,
      message: 'Invalid or expired reset token'
    })
  }

  // Hash new password
  const hashedPassword = await hashPassword(password)

  // Update user password
  await db
    .update(schema.users)
    .set({
      password: hashedPassword,
      updatedAt: new Date()
    })
    .where(eq(schema.users.id, resetRecord.userId))

  // Delete used token
  await db
    .delete(schema.passwordResets)
    .where(eq(schema.passwordResets.id, resetRecord.id))

  // Create audit log
  await createAuditLog(resetRecord.userId, 'password_reset_completed', {}, event)

  return { success: true }
})
