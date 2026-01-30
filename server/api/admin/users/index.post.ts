import { z } from 'zod'

const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
    role: z.enum(['admin', 'owner', 'editor']).default('editor')
})

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event)

    // Only admins can create users
    if (session.user.role !== 'admin') {
        throw createError({
            statusCode: 403,
            message: 'Forbidden'
        })
    }

    const body = await readBody(event)
    const data = createUserSchema.parse(body)

    const db = useDrizzle()

    // Hash password
    const hashedPassword = await hashPassword(data.password)

    // Create user
    const [newUser] = await db
        .insert(tables.users)
        .values({
            email: data.email,
            password: hashedPassword,
            name: data.name || null,
            role: data.role
        })
        .returning({
            id: tables.users.id,
            email: tables.users.email,
            name: tables.users.name,
            role: tables.users.role
        })

    // Create audit log
    await createAuditLog(
        session.user.id,
        'user_created',
        { userId: newUser.id, email: newUser.email },
        event
    )

    return newUser
})
