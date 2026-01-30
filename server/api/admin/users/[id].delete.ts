import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)

    // Only admins can delete users
    if (session.user.role !== 'admin') {
        throw createError({
            statusCode: 403,
            message: 'Forbidden'
        })
    }

    const userId = parseInt(event.context.params!.id)

    // Prevent deleting yourself
    if (userId === session.user.id) {
        throw createError({
            statusCode: 400,
            message: 'Cannot delete your own account'
        })
    }

    const db = useDrizzle()

    // Delete user
    const [deletedUser] = await db
        .delete(tables.users)
        .where(eq(tables.users.id, userId))
        .returning({
            id: tables.users.id,
            email: tables.users.email
        })

    if (!deletedUser) {
        throw createError({
            statusCode: 404,
            message: 'User not found'
        })
    }

    // Create audit log
    await createAuditLog(
        session.user.id,
        'user_deleted',
        { userId: deletedUser.id, email: deletedUser.email },
        event
    )

    return { success: true }
})
