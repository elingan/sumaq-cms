export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)

    if (session.user) {
        await createAuditLog(session.user.id, 'logout', {}, event)
    }

    await clearUserSession(event)

    return { success: true }
})
