import { z } from 'zod'
import { eq, and, gt } from 'drizzle-orm'

const resetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(6)
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { token, password } = resetPasswordSchema.parse(body)

    const db = useDrizzle()

    // Find valid reset token
    const [resetRecord] = await db
        .select()
        .from(tables.passwordResets)
        .where(
            and(
                eq(tables.passwordResets.token, token),
                gt(tables.passwordResets.expiresAt, new Date())
            )
        )
        .limit(1)

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
        .update(tables.users)
        .set({
            password: hashedPassword,
            updatedAt: new Date()
        })
        .where(eq(tables.users.id, resetRecord.userId))

    // Delete used token
    await db
        .delete(tables.passwordResets)
        .where(eq(tables.passwordResets.id, resetRecord.id))

    // Create audit log
    await createAuditLog(resetRecord.userId, 'password_reset_completed', {}, event)

    return { success: true }
})
