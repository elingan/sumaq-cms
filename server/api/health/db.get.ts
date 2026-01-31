import { db } from 'hub:db'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async () => {
  try {
    // Execute a simple query to verify database connection
    const result = await db.execute(sql`SELECT
      version() as version,
      current_database() as database,
      current_timestamp as timestamp
    `)

    // Get environment info
    const isDev = process.env.NODE_ENV === 'development'
    const hasDbUrl = !!process.env.DATABASE_URL

    return {
      status: 'ok',
      message: 'Database connection successful',
      environment: isDev ? 'development' : 'production',
      driver: isDev && !hasDbUrl ? 'pglite' : hasDbUrl ? 'neon-http' : 'unknown',
      timestamp: new Date().toISOString(),
      database: result.rows[0]
    }
  } catch (error) {
    return {
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }
  }
})
