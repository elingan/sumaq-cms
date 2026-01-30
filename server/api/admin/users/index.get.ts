import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)

    // Only admins can access
    if (session.user.role !== 'admin') {
        throw createError({
            statusCode: 403,
            message: 'Forbidden'
        })
    }

    const db = useDrizzle()

    const allUsers = await db
        .select({
            id: tables.users.id,
            email: tables.users.email,
            name: tables.users.name,
            role: tables.users.role,
            createdAt: tables.users.createdAt
        })
        .from(tables.users)
        .orderBy(tables.users.createdAt)

    return allUsers
})
