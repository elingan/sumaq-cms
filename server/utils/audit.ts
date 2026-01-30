import { eq } from 'drizzle-orm'
import type { H3Event } from 'h3'

export async function createAuditLog(
  userId: number | null,
  action: string,
  details?: Record<string, any>,
  event?: H3Event
) {
  const db = useDrizzle()

  await db.insert(tables.auditLogs).values({
    userId,
    action,
    details: details || null,
    ipAddress: event ? getRequestIP(event) || null : null,
    userAgent: event ? getHeader(event, 'user-agent') || null : null
  })
}
