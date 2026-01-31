import type { H3Event } from 'h3'
import { db, schema } from '@nuxthub/db'

export async function createAuditLog(
  userId: string | null,
  action: string,
  details?: Record<string, any>,
  event?: H3Event
) {
  await db.insert(schema.auditLogs).values({
    userId,
    action,
    details: details || null,
    ipAddress: event ? getRequestIP(event) || null : null,
    userAgent: event ? getHeader(event, 'user-agent') || null : null
  })
}
