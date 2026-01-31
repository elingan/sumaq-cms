import type { users, passwordResets, auditLogs } from '@nuxthub/db/schema'

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type PublicUser = Omit<User, 'password'>
export type UserForm = Pick<NewUser, 'name' | 'email' | 'password'>

export type PasswordReset = typeof passwordResets.$inferSelect
export type NewPasswordReset = typeof passwordResets.$inferInsert

export type AuditLog = typeof auditLogs.$inferSelect
export type NewAuditLog = typeof auditLogs.$inferInsert
