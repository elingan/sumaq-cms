import { readFileSync } from 'fs'
import postgres from 'postgres'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { config } from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load environment variables
config({ path: join(__dirname, '../.env') })

// Read the migration file
const migrationSQL = readFileSync(
    join(__dirname, '../server/database/migrations/0001_create_users_table.sql'),
    'utf-8'
)

// Connect to the database
const sql = postgres(process.env.DATABASE_URL, {
    ssl: 'require'
})

console.log('Running migration...')

try {
    // Execute the migration
    await sql.unsafe(migrationSQL)
    console.log('✅ Migration completed successfully!')
    console.log('✅ Admin user created: elingan@gmail.com / admin123')
} catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
} finally {
    await sql.end()
}
